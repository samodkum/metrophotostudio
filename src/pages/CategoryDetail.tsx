import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Camera, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import InquiryFormDialog, { type InquiryData } from "@/components/InquiryFormDialog";
import BookingSelectionDialog from "@/components/BookingSelectionDialog";
import MeetingScheduler from "@/components/MeetingScheduler";
import PaymentSection from "@/components/PaymentSection";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { format } from "date-fns";

type BookingStep = "closed" | "selection" | "inquiry" | "meeting" | "payment";

const CategoryDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Booking flow state
    const [step, setStep] = useState<BookingStep>("closed");
    const [bookingType, setBookingType] = useState<"free" | "paid" | null>(null);
    const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
    const [meetingDate, setMeetingDate] = useState<Date | null>(null);
    const [meetingTime, setMeetingTime] = useState("");
    const { user, isSignedIn } = useUser();
    const clerk = useClerk();

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
            if (!inquiryData) return;

            toast.loading("Confirming your free callback...", { id: "free-booking" });

            try {
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
                    payment_status: "verified",
                    razorpay_payment_id: "free_callback",
                    meet_link: null,
                });

                if (error) throw error;

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

    useEffect(() => {
        async function fetchCategoryData() {
            if (!slug) return;

            try {
                // 1. Fetch category by slug
                const { data: catData, error: catError } = await supabase
                    .from("categories")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (catError || !catData) {
                    console.error("Category not found", catError);
                    navigate("/404", { replace: true });
                    return;
                }

                setCategory(catData);

                // 2. Fetch all gallery items strictly associated with this category ID
                const { data: itemData, error: itemError } = await supabase
                    .from("gallery_items")
                    .select("*")
                    .eq("category_id", catData.id)
                    .order("sort_order", { ascending: true });

                if (!itemError && itemData) {
                    setItems(itemData);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchCategoryData();
    }, [slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="font-display text-muted-foreground animate-pulse">Loading amazing shots...</p>
            </div>
        );
    }

    if (!category) return null;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <Navbar onBookNow={openBooking} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-secondary/30 pointer-events-none" />
                <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <Button
                        variant="ghost"
                        className="mb-6 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>

                    <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-gold-gradient leading-tight tracking-tight animate-fade-in">
                        {category.name} Shoot
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        {category.description || `Explore our curated ${category.name.toLowerCase()} portfolio. We specialize in capturing the perfect moments with professional lighting, styling, and direction.`}
                    </p>

                    <Button
                        className="bg-gold-gradient text-primary-foreground px-8 py-6 rounded-full text-lg font-semibold hover:shadow-gold hover:scale-105 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: "0.3s" }}
                        onClick={openBooking}
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Your {category.name} Session
                    </Button>
                </div>
            </section>

            {/* Details Section */}
            {(category.deliverables || category.delivery_time || category.process_details) && (
                <section className="py-12 bg-background border-y border-border/50">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="font-display text-2xl font-bold">The Process</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {category.process_details || "We take care of everything from start to finish, ensuring you get the perfect results."}
                                </p>
                            </div>
                            <div className="space-y-6 bg-secondary/30 p-6 rounded-2xl border border-border">
                                {category.deliverables && (
                                    <div>
                                        <h4 className="font-bold mb-2 flex items-center text-primary"><Camera className="w-4 h-4 mr-2" /> Deliverables</h4>
                                        <p className="text-muted-foreground text-sm">{category.deliverables}</p>
                                    </div>
                                )}
                                {(category.deliverables && category.delivery_time) && <div className="h-px bg-border/50 w-full" />}
                                {category.delivery_time && (
                                    <div>
                                        <h4 className="font-bold mb-2 flex items-center text-primary"><Calendar className="w-4 h-4 mr-2" /> Delivery Time</h4>
                                        <p className="text-muted-foreground text-sm">{category.delivery_time}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery Section */}
            <section className="py-20 bg-secondary/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-12">
                        <Camera className="h-6 w-6 text-primary" />
                        <h2 className="font-display text-3xl font-bold">Featured Portfolio</h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-2xl border border-border">
                            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-display font-medium mb-2">Portfolio Coming Soon</h3>
                            <p className="text-muted-foreground">We are currently curating our best {category.name.toLowerCase()} shots.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`group relative rounded-2xl overflow-hidden glass-panel hover-lift ${index === 0 ? "md:col-span-2 md:row-span-2" : ""
                                        }`}
                                >
                                    {item.file_type === "video" ? (
                                        <video
                                            src={item.file_url}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={item.file_url}
                                            alt={item.title || `${category.name} photo`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        {item.title && (
                                            <h3 className="text-white font-display text-lg font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                {item.title}
                                            </h3>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-gradient opacity-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display text-4xl font-bold mb-6">Ready to create magic?</h2>
                    <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                        Let's discuss your vision and plan the perfect {category.name.toLowerCase()} shoot together.
                    </p>
                    <Button
                        className="bg-gold-gradient text-primary-foreground px-8 py-6 rounded-full text-lg font-semibold hover:shadow-gold transition-all duration-300"
                        onClick={openBooking}
                    >
                        Schedule Consultation <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            <footer className="py-8 bg-secondary border-t border-border mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Metro Photo Studio. All rights reserved.</p>
                </div>
            </footer>

            {/* Full Booking Flow */}
            <BookingSelectionDialog
                open={step === "selection"}
                onOpenChange={(open) => !open && setStep("closed")}
                onSelect={handleSelection}
            />

            <InquiryFormDialog
                open={step === "inquiry"}
                onOpenChange={(open) => !open && setStep("closed")}
                onSubmit={handleInquirySubmit}
                defaultCategory={category.name}
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

export default CategoryDetail;
