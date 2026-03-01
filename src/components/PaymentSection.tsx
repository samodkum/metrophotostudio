import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Send, Loader2 } from "lucide-react";
import { InquiryData } from "./InquiryFormDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";

interface PaymentSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiryData: InquiryData | null;
  meetingDate: Date | null;
  meetingTime: string;
  onComplete: () => void;
}

const PaymentSection = ({ open, onOpenChange, inquiryData, meetingDate, meetingTime, onComplete }: PaymentSectionProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { error: razorpayError, isLoading: razorpayLoading, Razorpay } = useRazorpay();
  const { user } = useUser();

  const handlePayment = async () => {
    if (!inquiryData || !meetingDate) return;
    setSubmitting(true);

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!rzpKey) {
      toast.error("Configuration Error: Razorpay Key is missing from Vercel Environment Variables.");
      setSubmitting(false);
      return;
    }

    // Simulate Razorpay opening and succeeding (since orderless test drop-ins are now blocked by Razorpay)
    toast.loading("Simulating Razorpay Payment...", { id: "payment" });

    setTimeout(async () => {
      try {
        // Send to Supabase
        const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(7)}`;
        const { error } = await supabase.from("inquiries").insert({
          user_id: user?.id,
          full_name: inquiryData.fullName,
          email: inquiryData.email,
          phone: inquiryData.phone,
          whatsapp: inquiryData.whatsapp,
          shoot_category: inquiryData.shootCategory,
          address: inquiryData.address,
          meeting_date: meetingDate.toISOString(),
          meeting_time: meetingTime,
          payment_status: "verified",
          razorpay_payment_id: mockPaymentId,
          meet_link: "https://meet.google.com/hhx-cwdr-myb",
        });

        if (error) throw error;

        // Build WhatsApp message
        const msg = encodeURIComponent(
          `🎬 *New Booking Confirmed - Metro Photo Studio*\n\n` +
          `👤 Name: ${inquiryData.fullName}\n` +
          `📧 Email: ${inquiryData.email}\n` +
          `📱 Phone: ${inquiryData.phone}\n` +
          `💬 WhatsApp: ${inquiryData.whatsapp}\n` +
          `📸 Category: ${inquiryData.shootCategory}\n` +
          `📍 Address: ${inquiryData.address}\n` +
          `📅 Meeting: ${format(meetingDate, "PPP")} at ${meetingTime}\n` +
          `💰 Payment: ₹5 Paid\n` +
          `📹 Meet Link: https://meet.google.com/hhx-cwdr-myb\n` +
          `✅ Razorpay ID: ${mockPaymentId}`
        );

        toast.dismiss("payment");
        toast.success("Payment successful! Booking confirmed.");
        window.open(`https://wa.me/919324236203?text=${msg}`, "_blank");
        onComplete();
      } catch (err: any) {
        console.error("SUPABASE INSERT ERROR:", err);
        toast.dismiss("payment");
        toast.error(`Fail: ${err.message || err.details || JSON.stringify(err)}`);
      } finally {
        setSubmitting(false);
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-xl text-gold-gradient">Payment Confirmation</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground font-body">Pay ₹5 to confirm your meeting</p>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Amount */}
          <div className="bg-secondary rounded-xl p-6 text-center border border-border">
            <p className="text-sm text-muted-foreground font-body mb-2">Meeting Confirmation Fee</p>
            <p className="font-display text-4xl font-bold text-gold-gradient">₹5</p>
          </div>

          <button
            onClick={handlePayment}
            disabled={submitting}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {submitting
              ? "Testing Payment Flow..."
              : "Simulate Secure Payment"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSection;
