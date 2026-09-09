import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { MoodBoardPalette } from "./mood-board-palette";
import type { MoodBoardData } from "./types";

export function MoodBoardCard({
  board,
  onClick,
  span = "normal",
}: {
  board: MoodBoardData;
  onClick: () => void;
  span?: "normal" | "wide";
}) {
  const cover = board.images[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-left block active:scale-[0.98] transition-transform duration-150 ${span === "wide" ? "md:col-span-2" : ""}`}
    >
      <div
        className={`relative w-full border border-taupe/20 overflow-hidden aspect-[4/5] transition-shadow duration-300 group-hover:shadow-lg ${
          span === "wide" ? "md:aspect-[16/9]" : ""
        }`}
      >
        {cover ? (
          <Image
            src={cloudinaryUrl(cover.cloudinaryPublicId, { width: 800 })}
            alt={board.title}
            fill
            sizes={span === "wide" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-taupe text-xs bg-taupe/10">
            No image yet
          </div>
        )}
      </div>

      <p className="font-serif text-lg mt-3 leading-tight transition-colors duration-150 group-hover:text-blush">{board.title}</p>
      {board.styleDescriptor && (
        <p className="text-xs text-taupe mt-1">{board.styleDescriptor}</p>
      )}

      {board.colorPalette.length > 0 && (
        <div className="mt-3">
          <MoodBoardPalette palette={board.colorPalette} size="sm" />
        </div>
      )}
    </button>
  );
}
