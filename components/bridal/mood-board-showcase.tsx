"use client";

import { useState } from "react";
import { MoodBoardCard } from "./mood-board-card";
import { MoodBoardDetail } from "./mood-board-detail";
import type { MoodBoardData } from "./types";

export function MoodBoardShowcase({ boards }: { boards: MoodBoardData[] }) {
  const [openBoard, setOpenBoard] = useState<MoodBoardData | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
        {boards.map((board, i) => (
          <MoodBoardCard
            key={board.id}
            board={board}
            onClick={() => setOpenBoard(board)}
            span={i % 5 === 0 ? "wide" : "normal"}
          />
        ))}
      </div>

      {openBoard && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={() => setOpenBoard(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-cream border border-taupe/30 p-6 md:p-10 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenBoard(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-sm text-taupe hover:text-ink border border-taupe/40 rounded-brand px-3 py-1.5"
            >
              Close
            </button>
            <MoodBoardDetail board={openBoard} />
          </div>
        </div>
      )}
    </>
  );
}
