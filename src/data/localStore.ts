import { v4 as uuidv4 } from "uuid";

export interface LocalCategory {
    id: string;
    name: string;
    slug: string;
}

export interface LocalGalleryItem {
    id: string;
    title: string | null;
    file_url: string;
    file_type: string;
    category_id: string | null;
    sort_order: number | null;
}

export interface LocalService {
    id: string;
    title: string;
    description: string | null;
    icon: string | null;
    pricing: string | null;
    sort_order: number | null;
}

export interface LocalTestimonial {
    id: string;
    name: string;
    category: string;
    rating: number;
    text: string;
}

// -- Categories -- 
export const getCategories = (): LocalCategory[] => {
    const raw = localStorage.getItem("site_categories");
    // Auto-seed some initial categories if empty
    if (!raw) {
        const defaultCats = [
            { id: uuidv4(), name: "Wedding", slug: "wedding" },
            { id: uuidv4(), name: "Pre-Wedding", slug: "pre-wedding" },
            { id: uuidv4(), name: "Baby Shoot", slug: "baby-shoot" },
        ];
        localStorage.setItem("site_categories", JSON.stringify(defaultCats));
        return defaultCats;
    }
    return JSON.parse(raw);
};

export const saveCategories = (cats: LocalCategory[]) => {
    localStorage.setItem("site_categories", JSON.stringify(cats));
};

// -- Gallery --
export const getGalleryItems = (): LocalGalleryItem[] => {
    const raw = localStorage.getItem("site_gallery");
    if (!raw) return [];
    return JSON.parse(raw);
};

export const saveGalleryItems = (items: LocalGalleryItem[]) => {
    localStorage.setItem("site_gallery", JSON.stringify(items));
};

// -- Services --
export const getServices = (): LocalService[] => {
    const raw = localStorage.getItem("site_services");
    if (!raw) return [];
    return JSON.parse(raw);
}

export const saveServices = (services: LocalService[]) => {
    localStorage.setItem("site_services", JSON.stringify(services));
}

// -- Testimonials --
export const getTestimonials = (): LocalTestimonial[] => {
    const raw = localStorage.getItem("site_testimonials");
    if (!raw) {
        // Seed with the default testimonials
        const defaultTestimonials = [
            { id: uuidv4(), name: "Priya & Rohit Sharma", category: "Wedding", rating: 5, text: "Absolutely stunning work! Every frame captured the magic of our wedding day. The team was professional and made us feel so comfortable." },
            { id: uuidv4(), name: "Sneha Patil", category: "Maternity", rating: 5, text: "The maternity shoot was beyond beautiful. They knew exactly how to make me feel confident and the photos turned out like a dream." },
            { id: uuidv4(), name: "Amit & Neha Desai", category: "Pre-Wedding", rating: 5, text: "Our pre-wedding shoot was so much fun! The locations, the poses, the final edits — everything was perfect. Highly recommend!" },
            { id: uuidv4(), name: "Kavita Joshi", category: "Baby Shoot", rating: 5, text: "They captured our little one's expressions so naturally. The patience and creativity of the team is truly remarkable." },
            { id: uuidv4(), name: "Rajesh & Meena Kulkarni", category: "Haldi", rating: 5, text: "The haldi ceremony photos were vibrant and full of life. Every candid moment was captured beautifully. Amazing work!" },
            { id: uuidv4(), name: "Anita Verma", category: "Birthday Shoot", rating: 4, text: "My daughter's birthday party was captured so well. The team blended in and caught every joyful moment perfectly." },
        ];
        localStorage.setItem("site_testimonials", JSON.stringify(defaultTestimonials));
        return defaultTestimonials;
    }
    return JSON.parse(raw);
}

export const saveTestimonials = (testimonials: LocalTestimonial[]) => {
    localStorage.setItem("site_testimonials", JSON.stringify(testimonials));
}

// -- Stats (Mock count for Dashboard) --
export const getStats = () => {
    return {
        gallery: getGalleryItems().length,
        categories: getCategories().length,
        services: getServices().length,
        testimonials: getTestimonials().length,
    }
}
