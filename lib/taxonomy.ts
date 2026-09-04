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
