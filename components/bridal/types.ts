import type { PaletteSwatch } from "./mood-board-palette";

export interface MoodBoardData {
  id: string;
  title: string;
  styleDescriptor: string | null;
  colorPalette: PaletteSwatch[];
  images: { cloudinaryPublicId: string }[];
}
