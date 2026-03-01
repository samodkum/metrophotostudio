import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, getGalleryItems, LocalCategory, LocalGalleryItem } from "@/data/localStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Camera, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import InquiryFormDialog from "@/components/InquiryFormDialog";

const CategoryDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<LocalCategory | null>(null);
    const [items, setItems] = useState<LocalGalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        async function fetchCategoryData() {
            if (!slug) return;

            try {
                // 1. Fetch category by slug
                const allCats = getCategories();
                const catData = allCats.find(c => c.slug === slug);

                if (!catData) {
                    console.error("Category not found");
                    navigate("/404", { replace: true });
                    return;
                }

                setCategory(catData);

                // 2. Fetch all gallery items strictly associated with this category ID
                const allItems = getGalleryItems();
                const catItems = allItems.filter(i => i.category_id === catData.id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

                setItems(catItems);
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
            <Navbar onBookNow={() => setIsBookingOpen(true)} />

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
                        Explore our curated {category.name.toLowerCase()} portfolio. We specialize in capturing the perfect moments with professional lighting, styling, and direction.
                    </p>

                    <Button
                        className="bg-gold-gradient text-primary-foreground px-8 py-6 rounded-full text-lg font-semibold hover:shadow-gold hover:scale-105 transition-all duration-300 animate-fade-in"
                        style={{ animationDelay: "0.3s" }}
                        onClick={() => setIsBookingOpen(true)}
                    >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Your {category.name} Session
                    </Button>
                </div>
            </section>

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
                        onClick={() => setIsBookingOpen(true)}
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

            {/* Pass the category name as pre-selected to the inquiry form */}
            <InquiryFormDialog
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                onSubmit={() => { }}
                defaultCategory={category.name}
            />
        </div>
    );
};

export default CategoryDetail;
