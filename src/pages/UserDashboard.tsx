import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Video, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserInquiry {
    id: string;
    shoot_category: string;
    meeting_date: string;
    meeting_time: string;
    payment_status: string;
    meet_link?: string;
    admin_meeting_status?: string | null;
}

const UserDashboard = () => {
    const { user, isLoaded } = useUser();
    const [bookings, setBookings] = useState<UserInquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBookings() {
            if (!user?.id) return;

            try {
                const { data, error } = await supabase
                    .from("inquiries")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Error fetching user bookings:", error);
                } else if (data) {
                    setBookings(data as UserInquiry[]);
                }
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded) {
            if (user) {
                fetchBookings();
            } else {
                setLoading(false);
            }
        }
    }, [user, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-display font-bold mb-4">You are not logged in</h1>
                <p className="text-muted-foreground mb-6">Please log in to view your meetings.</p>
                <Button onClick={() => window.location.href = "/"} className="bg-gold-gradient text-primary-foreground">
                    Go to Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">My Account</h1>
                    <p className="text-muted-foreground mt-2">Manage your bookings and view your meeting links.</p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-display font-bold text-gold-gradient">Your Meetings</h2>

                    {bookings.length === 0 ? (
                        <Card className="bg-secondary/50 border-border">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-lg font-medium text-foreground">No bookings found</p>
                                <p className="text-muted-foreground mt-1">You haven't scheduled any meetings yet.</p>
                                <Button onClick={() => window.location.href = "/"} className="mt-6 bg-gold-gradient text-primary-foreground">
                                    Book a Meeting
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookings.map((booking) => {
                                const meetingDate = new Date(booking.meeting_date);
                                const isPast = meetingDate < new Date();

                                return (
                                    <Card key={booking.id} className={`bg-card border-border transition-all ${isPast ? 'opacity-70' : 'hover:border-primary/50'}`}>
                                        <CardHeader className="pb-3 border-b border-border/50">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-xl font-display text-primary">
                                                    {booking.shoot_category || "Consultation"}
                                                </CardTitle>
                                                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${booking.payment_status === 'verified'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {booking.payment_status === 'verified' ? 'Confirmed' : 'Pending Payment'}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center text-sm text-foreground">
                                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {format(meetingDate, "EEEE, MMMM do, yyyy")}
                                                </div>
                                                <div className="flex items-center text-sm text-foreground">
                                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    {booking.meeting_time}
                                                </div>
                                                {booking.payment_status === 'verified' && (
                                                    <div className="flex items-center text-sm text-foreground">
                                                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                                        Paid ₹5 via Razorpay
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4 mt-2 border-t border-border/50">
                                                {booking.meet_link && booking.admin_meeting_status === 'approved' ? (
                                                    <Button
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                                        onClick={() => window.open(booking.meet_link, "_blank")}
                                                    >
                                                        <Video className="h-4 w-4 mr-2" />
                                                        Join Video Meeting
                                                    </Button>
                                                ) : (
                                                    <div className="text-center p-3 rounded-lg bg-secondary border border-border">
                                                        <p className="text-xs text-muted-foreground font-medium">Meeting link will be provided once an Admin approves your booking.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
