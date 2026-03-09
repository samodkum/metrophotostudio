export type GalleryCategory =
  | "All"
  | "Pre-Wedding"
  | "Wedding"
  | "Baby Shoot"
  | "Haldi"
  | "Mehendi"
  | "Maternity"
  | "Birthday Shoot"
  | "Event Photography";

export interface GalleryImage {
  src: string;
  category: GalleryCategory;
  alt: string;
}

const makeImages = (prefix: string, count: number, category: GalleryCategory): GalleryImage[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/gallery/${prefix}-${i + 1}.png`,
    category,
    alt: `${category} photo ${i + 1}`,
  }));

export const galleryImages: GalleryImage[] = [
  ...makeImages("pre-wedding", 14, "Pre-Wedding"),
  ...makeImages("wedding", 16, "Wedding"),
  ...makeImages("baby", 12, "Baby Shoot"),
  ...makeImages("haldi", 10, "Haldi"),
  ...makeImages("mehendi", 9, "Mehendi"),
  ...makeImages("maternity", 11, "Maternity"),
  ...makeImages("birthday", 7, "Birthday Shoot"),
  ...makeImages("event", 5, "Event Photography"),
];

export const categories: GalleryCategory[] = [
  "All",
  "Pre-Wedding",
  "Wedding",
  "Baby Shoot",
  "Haldi",
  "Mehendi",
  "Maternity",
  "Birthday Shoot",
  "Event Photography",
];
