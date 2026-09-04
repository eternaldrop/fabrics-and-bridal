export interface HeroCarouselImage {
  publicId: string;
  alt: string;
}

export interface HeroCarouselSlide {
  id: string;
  title: string;
  subtext: string;
  /** First image is the primary/full-bleed one; 1–2 more layer on top as a collage. */
  images: HeroCarouselImage[];
  /** Small on-page credit for any externally-sourced (non-catalog) photo in this slide. */
  credits?: string[];
}

// Swap publicId values for real photography any time — nothing else
// needs to change. Reuses a few existing catalog fabric photos alongside
// two photos sourced specifically for this carousel.
export const heroCarouselSlides: HeroCarouselSlide[] = [
  {
    id: "fabrics-and-vibes",
    title: "Fabrics & Vibes",
    subtext: "Lace, silk, velvet — fabric sold by the yard, ready for tailoring.",
    images: [
      { publicId: "fabrics-and-bridals/seed-photos/ankara-wax-print", alt: "Ankara wax print fabric" },
      { publicId: "fabrics-and-bridals/seed-photos/silk-charmeuse", alt: "Silk charmeuse fabric" },
      { publicId: "fabrics-and-bridals/seed-photos/emerald-velvet", alt: "Emerald velvet fabric" },
    ],
  },
  {
    id: "colorful-vibes",
    title: "Colorful Vibes",
    subtext: "Palettes and inspiration to build your mood board around.",
    images: [
      { publicId: "fabrics-and-bridals/site/carousel-dahlia", alt: "Pink dahlia flowers" },
      { publicId: "fabrics-and-bridals/seed-photos/gold-brocade", alt: "Gold brocade fabric" },
      { publicId: "fabrics-and-bridals/seed-photos/kente-cloth", alt: "Kente cloth fabric" },
    ],
    credits: ["\"Whimsey Dahlia\" by audreyjm529, CC BY 2.0"],
  },
  {
    id: "bridal-catalogues",
    title: "Bridal Catalogues",
    subtext: "Curated looks and fabrics for your wedding day, start to finish.",
    images: [
      { publicId: "fabrics-and-bridals/site/carousel-gown", alt: "Bride in a full-length gown with train" },
      { publicId: "fabrics-and-bridals/seed-photos/ivory-chantilly-lace", alt: "Ivory Chantilly lace fabric" },
      { publicId: "fabrics-and-bridals/site/hero", alt: "Wedding dress lace detail" },
    ],
    credits: [
      "\"The Gown\" by CharlotWest, CC BY-SA 2.0",
      "\"Free Wedding Dress Lace Texture\" by Beverly & Pack, CC BY 2.0",
    ],
  },
];
