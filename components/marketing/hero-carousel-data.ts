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
// photos sourced specifically for this carousel.
export const heroCarouselSlides: HeroCarouselSlide[] = [
  {
    id: "fabrics-and-vibes",
    title: "Fabrics & Vibes",
    subtext: "Lace, silk, velvet — fabric sold by the yard, ready for tailoring.",
    images: [
      { publicId: "fabrics-and-bridals/site/hero-fabric-rolls", alt: "Rolls of pink satin, ivory lace, and gold linen fabric" },
      { publicId: "fabrics-and-bridals/site/hero-chiffon-swirl", alt: "Swirled cream chiffon fabric" },
      { publicId: "fabrics-and-bridals/site/hero-leaf-print-fabric", alt: "Draped fabric with a mauve leaf print" },
    ],
  },
  {
    id: "colorful-vibes",
    title: "Colorful Vibes",
    subtext: "Palettes and inspiration to build your mood board around.",
    images: [
      { publicId: "fabrics-and-bridals/site/hero-colorful-jumpsuit", alt: "A woman in a colourful printed jumpsuit" },
      { publicId: "fabrics-and-bridals/seed-photos/gold-brocade", alt: "Gold brocade fabric" },
      { publicId: "fabrics-and-bridals/seed-photos/kente-cloth", alt: "Kente cloth fabric" },
    ],
  },
  {
    id: "bridal-catalogues",
    title: "Bridal Catalogues",
    subtext: "Curated looks and fabrics for your wedding day, start to finish.",
    images: [
      { publicId: "fabrics-and-bridals/bridal-page/hero", alt: "Bride in an embroidered lace gown beside rolls of fabric" },
      { publicId: "fabrics-and-bridals/bridal-page/bridal-gown", alt: "Bride in a champagne satin gown" },
      { publicId: "fabrics-and-bridals/site/hero-bridal-consultation", alt: "A bride and her stylist reviewing fabric swatches and a colour palette" },
    ],
  },
  {
    id: "made-to-measure",
    title: "Made to Measure",
    subtext: "Ready-made or cut to your exact measurements — outfits built to fit.",
    images: [
      { publicId: "fabrics-and-bridals/site/hero-outfit-black-gown", alt: "A woman in a flowing black gown with a gold headwrap" },
      { publicId: "fabrics-and-bridals/site/hero-outfit-tan-dress", alt: "A woman in a pleated tan dress" },
      { publicId: "fabrics-and-bridals/site/hero-outfit-palm-coord", alt: "A couple in matching palm-print co-ord sets" },
    ],
  },
];
