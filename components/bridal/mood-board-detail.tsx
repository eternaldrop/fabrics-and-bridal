import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { MoodBoardPalette } from "./mood-board-palette";
import type { MoodBoardData } from "./types";

// Pure display of a mood board's content — title, palette, and images.
// Used both for the sample boards on /bridal and (later) a real bride's
// approved board; surrounding chrome (modal, comments, approve button)
// is the caller's job, not this component's.
export function MoodBoardDetail({ board }: { board: MoodBoardData }) {
  return (
    <div>
      <h3 className="font-serif text-3xl md:text-4xl">{board.title}</h3>
      {board.styleDescriptor && (
        <p className="text-taupe mt-2">{board.styleDescriptor}</p>
      )}

      {board.colorPalette.length > 0 && (
        <div className="mt-6">
          <MoodBoardPalette palette={board.colorPalette} />
        </div>
      )}

      {board.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-8">
          {board.images.map((img, i) => (
            <div
              key={img.cloudinaryPublicId + i}
              className={`relative aspect-[4/5] border border-taupe/20 overflow-hidden ${
                i === 0 ? "col-span-2 aspect-[16/10]" : ""
              }`}
            >
              <Image
                src={cloudinaryUrl(img.cloudinaryPublicId, { width: 900 })}
                alt={`${board.title} — inspiration ${i + 1}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
