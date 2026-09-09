// Fixed fabric taxonomy — used by the fabrics catalog filter bar and the
// admin upload form, so every fabric an admin adds automatically lines up
// with what customers can filter by. Outfits keep free-text categories
// since they weren't asked to follow this list.
export const FABRIC_CATEGORIES = [
  "Lace Fabrics",
  "Bridal Fabrics",
  "Business Fabrics",
  "Stretch Fabrics",
  "Casual Fabrics",
  "Jersey Fabrics",
  "Coat Fabrics",
] as const;

export const FABRIC_MATERIALS = [
  "Cotton",
  "Linen",
  "Silk",
  "Wool",
  "Cotton Blend",
  "Linen Blend",
  "Silk Blend",
  "Wool Blend",
  "Other",
] as const;

export const OUTFIT_CATEGORIES = [
  "Casual",
  "Native Wear",
  "Business",
  "Aso-Ebi",
  "Bridal",
  "Party",
] as const;

export const OUTFIT_SIZES = ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "Made to measure"] as const;
