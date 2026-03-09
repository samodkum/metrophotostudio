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

    // 1. Fetch real Order ID from our Vercel Backend
    toast.loading("Initializing secure payment...", { id: "payment" });

    try {
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 500, // ₹5.00 in paise
          currency: "INR",
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to initialize payment backend.");
      }

      const orderData = await orderResponse.json();

      toast.dismiss("payment");

      // 2. Open Real Razorpay Widget with validated Order ID
      const options = {
        key: rzpKey,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id, // THE CRITICAL PIECE REQUIRED BY RAZORPAY
        name: "Metro Photo Studio",
        description: "Meeting Confirmation Fee",
        handler: async (response: any) => {
          try {
            toast.loading("Confirming booking...", { id: "confirm" });

            // Send to Supabase
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
              razorpay_payment_id: response.razorpay_payment_id,
              meet_link: "https://meet.google.com/hhx-cwdr-myb",
            });

            if (error) throw error;

            // Submit to Formspree
            await fetch("https://formspree.io/f/mreyekkg", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                Type: "Paid Consultation Booking (₹5)",
                Name: inquiryData.fullName,
                Email: inquiryData.email,
                Phone: inquiryData.phone,
                WhatsApp: inquiryData.whatsapp,
                Category: inquiryData.shootCategory,
                Address: inquiryData.address,
                Date: format(meetingDate, "PPP"),
                Time: meetingTime,
                RazorpayID: response.razorpay_payment_id
              })
            });

            toast.dismiss("confirm");
            toast.success("Payment successful! Booking confirmed.");
            onComplete();
          } catch (err: any) {
            console.error("SUPABASE INSERT ERROR:", err);
            toast.dismiss("confirm");
            toast.error(`Fail: ${err.message || err.details || JSON.stringify(err)}`);
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: inquiryData.fullName,
          email: inquiryData.email,
          contact: inquiryData.phone,
        },
        theme: {
          color: "#d4af37", // Gold
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            toast.info("Payment cancelled");
          },
        },
      };

      if (!Razorpay) {
        throw new Error("Razorpay SDK is not loaded. Please wait or check your adblocker.");
      }

      const rzp1 = new Razorpay(options as any);

      rzp1.on("payment.failed", function (response: any) {
        toast.error(`Payment Failed: ${response.error.description} (Reason: ${response.error.reason || 'Unknown'})`);
        console.error("Razorpay Error:", response.error);
        setSubmitting(false);
      });

      rzp1.open();

    } catch (err: any) {
      toast.dismiss("payment");
      toast.error(err.message || "Failed to initialize Razorpay");
      setSubmitting(false);
    }
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
            disabled={submitting || razorpayLoading}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting || razorpayLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {submitting
              ? "Initializing Server..."
              : razorpayLoading
                ? "Loading Razorpay..."
                : razorpayError
                  ? "Razorpay Error (Adblocker?)"
                  : "Pay Securely with Razorpay"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSection;
