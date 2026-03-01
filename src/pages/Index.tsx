import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GallerySection from "@/components/GallerySection";
import ServicesSection from "@/components/ServicesSection";
import InstagramSection from "@/components/InstagramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryFormDialog, { type InquiryData } from "@/components/InquiryFormDialog";
import MeetingScheduler from "@/components/MeetingScheduler";
import PaymentSection from "@/components/PaymentSection";
import { useUser, useClerk } from "@clerk/clerk-react";

type BookingStep = "closed" | "inquiry" | "meeting" | "payment";

const Index = () => {
  const [step, setStep] = useState<BookingStep>("closed");
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [meetingTime, setMeetingTime] = useState("");
  const { isSignedIn } = useUser();
  const clerk = useClerk();

  // Auto popup on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      const visited = sessionStorage.getItem("metro_visited");
      if (!visited) {
        // If they are not signed in, maybe don't pop up the inquiry form yet? 
        // Or call openBooking() so they are prompted to sign in.
        // Let's call openBooking() to match the intended flow.
        openBooking();
        sessionStorage.setItem("metro_visited", "1");
      }
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const openBooking = () => {
    if (isSignedIn) {
      setStep("inquiry");
    } else {
      clerk.openSignIn({
        fallbackRedirectUrl: window.location.href,
        forceRedirectUrl: window.location.href,
      });
    }
  };

  // If the user just signed in and was trying to book, we want to open the booking automatically.
  // We can use a simple URL param or local storage flag if needed, but for now we just handle it when they click the button again.

  const handleInquirySubmit = (data: InquiryData) => {
    setInquiryData(data);
    setStep("meeting");
  };

  const handleMeetingSubmit = (date: Date, time: string) => {
    setMeetingDate(date);
    setMeetingTime(time);
    setStep("payment");
  };

  const handleComplete = () => {
    setStep("closed");
    setInquiryData(null);
    setMeetingDate(null);
    setMeetingTime("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={openBooking} />
      <HeroSection onBookNow={openBooking} />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <InstagramSection />
      <FooterSection />
      <WhatsAppButton />

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
