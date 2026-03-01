import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, LocalCategory } from "@/data/localStore";
import { Camera, ChevronRight } from "lucide-react";

const CategoriesSection = () => {
    const [categories, setCategories] = useState<LocalCategory[]>([]);

    useEffect(() => {
        setCategories(getCategories());
    }, []);

    if (categories.length === 0) return null;

    return (
        <section id="categories" className="py-20 bg-card border-t border-b border-border/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                        <span className="text-gold-gradient">Our Service Categories</span>
                    </h2>
                    <p className="text-muted-foreground font-body max-w-lg mx-auto">
                        Explore our specialized photography services tailored to your unique needs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="group relative overflow-hidden rounded-2xl bg-secondary border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-gold flex flex-col h-full"
                        >
                            {/* Image Header with Gradient Overlay */}
                            <div className="relative h-48 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                                {category.cover_image_url ? (
                                    <img
                                        src={category.cover_image_url}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <Camera className="h-12 w-12 text-muted-foreground/50" />
                                    </div>
                                )}
                                <h3 className="absolute bottom-4 left-6 z-20 font-display text-2xl font-bold text-white drop-shadow-md group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                            </div>

                            {/* Content Body */}
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-3">
                                    {category.description || `Professional ${category.name} photography and videography services.`}
                                </p>
                                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    View Portfolio <ChevronRight className="h-4 w-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
