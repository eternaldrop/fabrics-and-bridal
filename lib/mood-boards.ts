import { eq, inArray, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { moodBoards, moodBoardItems } from "@/db/schema";
import type { MoodBoardData } from "@/components/bridal/types";
import type { PaletteSwatch } from "@/components/bridal/mood-board-palette";

export async function getSampleMoodBoards(): Promise<MoodBoardData[]> {
  const boards = await db
    .select()
    .from(moodBoards)
    .where(eq(moodBoards.isSample, true))
    .orderBy(asc(moodBoards.createdAt));

  if (boards.length === 0) return [];

  const items = await db
    .select()
    .from(moodBoardItems)
    .where(inArray(moodBoardItems.moodBoardId, boards.map((b) => b.id)))
    .orderBy(asc(moodBoardItems.position));

  const itemsByBoard = new Map<string, { cloudinaryPublicId: string }[]>();
  for (const item of items) {
    if (!item.cloudinaryPublicId) continue;
    const list = itemsByBoard.get(item.moodBoardId) ?? [];
    list.push({ cloudinaryPublicId: item.cloudinaryPublicId });
    itemsByBoard.set(item.moodBoardId, list);
  }

  return boards.map((board) => ({
    id: board.id,
    title: board.title,
    styleDescriptor: board.styleDescriptor,
    colorPalette: (board.colorPalette as PaletteSwatch[] | null) ?? [],
    images: itemsByBoard.get(board.id) ?? [],
  }));
}
