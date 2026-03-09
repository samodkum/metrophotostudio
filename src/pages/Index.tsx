import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import GallerySection from "@/components/GallerySection";
import ServicesSection from "@/components/ServicesSection";
import InstagramSection from "@/components/InstagramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryFormDialog, { type InquiryData } from "@/components/InquiryFormDialog";
import MeetingScheduler from "@/components/MeetingScheduler";
import PaymentSection from "@/components/PaymentSection";
import BookingSelectionDialog from "@/components/BookingSelectionDialog";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type BookingStep = "closed" | "selection" | "inquiry" | "meeting" | "payment";

const Index = () => {
  const [step, setStep] = useState<BookingStep>("closed");
  const [bookingType, setBookingType] = useState<"free" | "paid" | null>(null);
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [meetingTime, setMeetingTime] = useState("");
  const { user, isSignedIn } = useUser();
  const clerk = useClerk();

  // Auto popup on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      const visited = sessionStorage.getItem("metro_visited");
      if (!visited) {
        openBooking();
        sessionStorage.setItem("metro_visited", "1");
      }
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const openBooking = () => {
    if (isSignedIn) {
      setStep("selection");
    } else {
      clerk.openSignIn({
        fallbackRedirectUrl: window.location.href,
        forceRedirectUrl: window.location.href,
      });
    }
  };

  const handleSelection = (type: "free" | "paid") => {
    setBookingType(type);
    setStep("inquiry");
  };

  const handleInquirySubmit = (data: InquiryData) => {
    setInquiryData(data);
    setStep("meeting");
  };

  const handleMeetingSubmit = async (date: Date, time: string) => {
    setMeetingDate(date);
    setMeetingTime(time);

    if (bookingType === "free") {
      // FREE FLOW: Bypass Razorpay, directly submit to Supabase & Formspree
      if (!inquiryData) return;

      toast.loading("Confirming your free callback...", { id: "free-booking" });

      try {
        // 1. Save to Supabase
        const { error } = await supabase.from("inquiries").insert({
          user_id: user?.id,
          full_name: inquiryData.fullName,
          email: inquiryData.email,
          phone: inquiryData.phone,
          whatsapp: inquiryData.whatsapp,
          shoot_category: inquiryData.shootCategory,
          address: inquiryData.address,
          meeting_date: date.toISOString(),
          meeting_time: time,
          payment_status: "verified", // Mark as verified since it's free
          razorpay_payment_id: "free_callback",
          meet_link: null, // No meet link for free callback
        });

        if (error) throw error;

        // 2. Send email notification via Formspree
        await fetch("https://formspree.io/f/mreyekkg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Type: "Free Callback Request",
            Name: inquiryData.fullName,
            Email: inquiryData.email,
            Phone: inquiryData.phone,
            WhatsApp: inquiryData.whatsapp,
            Category: inquiryData.shootCategory,
            Address: inquiryData.address,
            Date: format(date, "PPP"),
            Time: time
          })
        });

        toast.dismiss("free-booking");
        toast.success("Callback booked successfully! Our team will call you at the scheduled time.");

        handleComplete();

      } catch (err: any) {
        toast.dismiss("free-booking");
        toast.error(`Booking failed: ${err.message}`);
      }

    } else {
      // PAID FLOW: Proceed to payment modal
      setStep("payment");
    }
  };

  const handleComplete = () => {
    setStep("closed");
    setBookingType(null);
    setInquiryData(null);
    setMeetingDate(null);
    setMeetingTime("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={openBooking} />
      <HeroSection onBookNow={openBooking} />
      <ServicesSection />
      <CategoriesSection />
      <GallerySection />
      <TestimonialsSection />
      <InstagramSection />
      <FooterSection />
      <WhatsAppButton />

      <BookingSelectionDialog
        open={step === "selection"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSelect={handleSelection}
      />

      <InquiryFormDialog
        open={step === "inquiry"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSubmit={handleInquirySubmit}
      />
      <MeetingScheduler
        open={step === "meeting"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSubmit={handleMeetingSubmit}
      />
      <PaymentSection
        open={step === "payment"}
        onOpenChange={(open) => !open && setStep("closed")}
        inquiryData={inquiryData}
        meetingDate={meetingDate}
        meetingTime={meetingTime}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default Index;
