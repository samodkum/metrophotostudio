import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseGalleryItem, SupabaseCategory } from "@/pages/admin/GalleryManagement";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const [items, setItems] = useState<SupabaseGalleryItem[]>([]);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, categoryRes] = await Promise.all([
          supabase.from("gallery_items").select("*").order("sort_order", { ascending: true }),
          supabase.from("categories").select("*")
        ]);

        if (galleryRes.error) throw galleryRes.error;
        if (categoryRes.error) throw categoryRes.error;

        setItems(galleryRes.data as SupabaseGalleryItem[]);
        setCategories(categoryRes.data as SupabaseCategory[]);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCategory === "All"
    ? items
    : items.filter((img) => img.category_id === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const navigate = (dir: 1 | -1) => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + dir + filtered.length) % filtered.length);
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">Our Sample Work</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Browse through our portfolio across various photography categories
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${activeCategory === "All"
              ? "bg-gold-gradient text-primary-foreground shadow-gold"
              : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${activeCategory === cat.id
                ? "bg-gold-gradient text-primary-foreground shadow-gold"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid cursor-pointer group overflow-hidden rounded-lg border border-border hover:border-primary/40 transition-all"
            >
              {img.file_type === 'video' ? (
                <video src={img.file_url} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <img
                  src={img.file_url}
                  alt={img.title || 'Gallery image'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIdx !== null && (
          <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-foreground hover:text-primary z-10">
              <X className="h-8 w-8" />
            </button>
            <button onClick={() => navigate(-1)} className="absolute left-4 text-foreground hover:text-primary">
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-4 text-foreground hover:text-primary">
              <ChevronRight className="h-10 w-10" />
            </button>
            {filtered[lightboxIdx].file_type === 'video' ? (
              <video src={filtered[lightboxIdx].file_url} controls className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg animate-scale-in" />
            ) : (
              <img
                src={filtered[lightboxIdx].file_url}
                alt={filtered[lightboxIdx].title || 'Gallery image'}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg animate-scale-in"
              />
            )}
            <div className="absolute bottom-6 text-center">
              <span className="text-sm text-muted-foreground font-body bg-card/80 px-4 py-2 rounded-full">
                {categories.find(c => c.id === filtered[lightboxIdx].category_id)?.name || "Uncategorized"} · {lightboxIdx + 1} / {filtered.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
