import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const timeSlots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

interface MeetingSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (date: Date, time: string) => void;
}

const MeetingScheduler = ({ open, onOpenChange, onSubmit }: MeetingSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch booked slots whenever the date changes
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);
      // Start of day in ISO string
      const dateIso = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ).toISOString();

      try {
        const { data, error } = await supabase
          .from("inquiries")
          .select("meeting_time")
          .eq("meeting_date", dateIso)
          .in("payment_status", ["verified", "pending"]); // Ignore rejected

        if (error) {
          console.error("Error fetching slots:", error);
        } else if (data) {
          setBookedSlots(data.map((b) => b.meeting_time).filter(Boolean) as string[]);
        }
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchBookedSlots();
    // Reset selected time if the new date doesn't have it available
    setSelectedTime("");
  }, [selectedDate]);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSubmit(selectedDate, selectedTime);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-xl text-gold-gradient">Schedule Meeting</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground font-body">Pick a date and time for your consultation</p>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground font-body mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Select Date
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < today}
                className="rounded-lg border border-border bg-secondary"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground font-body mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Select Time
              {loadingSlots && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-2" />}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.filter(slot => !bookedSlots.includes(slot)).length === 0 && !loadingSlots ? (
                <p className="text-sm text-muted-foreground col-span-3 text-center py-4 bg-secondary rounded-lg border border-border">No slots available for this date.</p>
              ) : (
                timeSlots.filter(slot => !bookedSlots.includes(slot)).map((slot) => {
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      disabled={loadingSlots}
                      className={`py-2.5 px-3 rounded-lg text-sm font-body font-medium transition-all ${selectedTime === slot
                        ? "bg-gold-gradient text-primary-foreground shadow-gold border-transparent"
                        : "bg-secondary text-foreground hover:bg-muted border border-border"
                        }`}
                    >
                      {slot}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="bg-secondary rounded-lg p-3 border border-border animate-fade-in">
              <p className="text-sm text-muted-foreground font-body">
                Selected: <span className="text-primary font-semibold">{format(selectedDate, "PPP")}</span> at{" "}
                <span className="text-primary font-semibold">{selectedTime}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
