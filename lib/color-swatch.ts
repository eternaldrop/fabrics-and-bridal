// Best-effort name -> hex map for rendering a colour swatch chip next to a
// fabric's colour name. Covers every colour currently in the catalog;
// anything not listed here just skips the swatch and shows the name alone.
const COLOR_HEX: Record<string, string> = {
  black: "#1A1714",
  blue: "#3B5B8C",
  blush: "#D9A5AE",
  burgundy: "#5C1A2B",
  champagne: "#E8D8B8",
  charcoal: "#3A3A3A",
  fuchsia: "#C2185B",
  gold: "#C9A227",
  grey: "#8A8A8A",
  gray: "#8A8A8A",
  indigo: "#3A3A6B",
  ivory: "#FBF7EE",
  lilac: "#B79FCB",
  mint: "#9FD8C4",
  multicolor: "#C9A227",
  multicolour: "#C9A227",
  mustard: "#C9A227",
  natural: "#E4D9C4",
  "oatmeal fleck": "#D8CBB4",
  peach: "#F5C4A1",
  red: "#B23A2E",
  rose: "#C9808F",
  rust: "#8B3A1F",
  sage: "#9CAF88",
  silver: "#C7C7C7",
  "sky blue": "#87BEDC",
  "slate blue": "#6A7FA8",
  violet: "#7B5EA7",
  white: "#FBF7EE",
  wine: "#7B2D3E",
};

export function getSwatchColor(colorName: string | null | undefined): string | null {
  if (!colorName) return null;
  return COLOR_HEX[colorName.trim().toLowerCase()] ?? null;
}
