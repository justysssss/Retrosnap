/**
 * Comprehensive Photo Filter Library
 * Reusable across projects - supports Instax, Kodak, and Polaroid film aesthetics
 */

export interface PhotoFilter {
  id: string;
  name: string;
  description: string;
  cssFilter: string;
  category: "instax" | "kodak" | "polaroid" | "classic";
}

export const PHOTO_FILTERS: PhotoFilter[] = [
  // Classic Filters
  {
    id: "normal",
    name: "Normal",
    description: "No filter applied",
    cssFilter: "none",
    category: "classic",
  },
  {
    id: "sepia",
    name: "Sepia",
    description: "Classic brown-tinted vintage",
    cssFilter: "sepia(100%)",
    category: "classic",
  },
  {
    id: "grayscale",
    name: "Grayscale",
    description: "Black and white",
    cssFilter: "grayscale(100%)",
    category: "classic",
  },

  // Fujifilm Instax Filters
  {
    id: "instax-natural",
    name: "Instax Natural",
    description: "Slightly warm, high contrast",
    cssFilter: "contrast(110%) saturate(105%) brightness(102%) sepia(5%)",
    category: "instax",
  },
  {
    id: "instax-vivid",
    name: "Instax Vivid",
    description: "Boosted saturation, punchy colors",
    cssFilter: "saturate(150%) contrast(120%) brightness(105%)",
    category: "instax",
  },
  {
    id: "instax-soft",
    name: "Instax Soft",
    description: "Muted tones, dreamy look",
    cssFilter: "saturate(70%) brightness(110%) contrast(90%) blur(0.3px)",
    category: "instax",
  },
  {
    id: "instax-cool",
    name: "Instax Cool",
    description: "Blue-tinted, modern aesthetic",
    cssFilter: "hue-rotate(10deg) saturate(90%) brightness(105%) contrast(105%)",
    category: "instax",
  },
  {
    id: "instax-warm",
    name: "Instax Warm",
    description: "Orange/pink tones, sunset feel",
    cssFilter: "sepia(25%) saturate(130%) hue-rotate(-10deg) brightness(108%)",
    category: "instax",
  },
  {
    id: "instax-monochrome",
    name: "Instax Monochrome",
    description: "Black & white with grain",
    cssFilter: "grayscale(100%) contrast(115%) brightness(98%)",
    category: "instax",
  },
  {
    id: "instax-sepia",
    name: "Instax Sepia",
    description: "Classic brown-tinted vintage",
    cssFilter: "sepia(85%) contrast(105%) brightness(100%) saturate(80%)",
    category: "instax",
  },

  // Kodak Film Stock Filters
  {
    id: "kodak-portra-400",
    name: "Kodak Portra 400",
    description: "Natural skin tones, pastel colors",
    cssFilter: "saturate(85%) contrast(95%) brightness(105%) hue-rotate(-5deg) sepia(8%)",
    category: "kodak",
  },
  {
    id: "kodak-gold-200",
    name: "Kodak Gold 200",
    description: "Warm golden hour glow",
    cssFilter: "sepia(20%) saturate(120%) contrast(105%) brightness(108%) hue-rotate(-8deg)",
    category: "kodak",
  },
  {
    id: "kodak-ektar-100",
    name: "Kodak Ektar 100",
    description: "Ultra-saturated, vibrant",
    cssFilter: "saturate(140%) contrast(115%) brightness(103%) hue-rotate(-3deg)",
    category: "kodak",
  },
  {
    id: "kodak-trix-400",
    name: "Kodak Tri-X 400",
    description: "High-contrast B&W with grain",
    cssFilter: "grayscale(100%) contrast(125%) brightness(95%)",
    category: "kodak",
  },
  {
    id: "kodak-colorplus-200",
    name: "Kodak ColorPlus 200",
    description: "Budget film, slightly cool",
    cssFilter: "saturate(95%) contrast(100%) brightness(103%) hue-rotate(5deg)",
    category: "kodak",
  },
  {
    id: "kodak-tmax-100",
    name: "Kodak T-Max 100",
    description: "Clean B&W, low grain",
    cssFilter: "grayscale(100%) contrast(108%) brightness(102%)",
    category: "kodak",
  },
  {
    id: "kodak-ektachrome",
    name: "Kodak Ektachrome",
    description: "Slide film, rich blues/greens",
    cssFilter: "saturate(125%) contrast(112%) brightness(100%) hue-rotate(3deg)",
    category: "kodak",
  },

  // Classic Polaroid Filters
  {
    id: "polaroid-600",
    name: "Polaroid 600",
    description: "Faded colors, slight cyan cast",
    cssFilter: "saturate(75%) contrast(95%) brightness(105%) hue-rotate(5deg) sepia(10%)",
    category: "polaroid",
  },
  {
    id: "polaroid-sx70",
    name: "Polaroid SX-70",
    description: "Warm, muted, dreamy",
    cssFilter: "saturate(80%) contrast(90%) brightness(108%) sepia(15%) blur(0.2px)",
    category: "polaroid",
  },
  {
    id: "polaroid-669",
    name: "Polaroid 669",
    description: "Professional pack film, accurate colors",
    cssFilter: "saturate(95%) contrast(105%) brightness(102%) sepia(5%)",
    category: "polaroid",
  },
];

/**
 * Get filters by category
 */
export const getFiltersByCategory = (category: PhotoFilter["category"]) => {
  return PHOTO_FILTERS.filter((filter) => filter.category === category);
};

/**
 * Get filter by ID
 */
export const getFilterById = (id: string) => {
  return PHOTO_FILTERS.find((filter) => filter.id === id);
};

/**
 * Filter categories metadata
 */
export const FILTER_CATEGORIES = [
  {
    id: "classic" as const,
    name: "Classic",
    description: "Timeless black & white and sepia tones",
  },
  {
    id: "instax" as const,
    name: "Fujifilm Instax",
    description: "Modern instant film aesthetics",
  },
  {
    id: "kodak" as const,
    name: "Kodak Film",
    description: "Vintage film stock emulation",
  },
  {
    id: "polaroid" as const,
    name: "Polaroid",
    description: "Iconic instant photography look",
  },
] as const;
