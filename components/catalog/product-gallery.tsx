"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface GalleryImage {
  cloudinaryPublicId: string;
}

export function ProductGallery({
  images: initialImages,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [images, setImages] = useState(initialImages);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 flex items-center justify-center text-taupe text-sm">
        No images yet
      </div>
    );
  }

  const main = images[0];
  // Layout is fixed at main + up to 3 styling shots; extra uploads beyond
  // that aren't shown here.
  const thumbnails = images.slice(1, 4);
  const hasThumbnails = thumbnails.length > 0;

  // Swap the clicked thumbnail into the main position; the previous main
  // image takes that thumbnail's old slot.
  function selectThumbnail(thumbIndex: number) {
    setImages((prev) => {
      const next = [...prev];
      const mainImg = next[0];
      next[0] = next[thumbIndex + 1];
      next[thumbIndex + 1] = mainImg;
      return next;
    });
  }

  return (
    <div>
      {/* Without styling shots, the main image just takes the full width —
          reserving a second grid column here would leave a hollow gap
          where the thumbnails would have been. */}
      <div className={`grid grid-cols-1 gap-3 ${hasThumbnails ? "md:grid-cols-[2fr_1fr]" : ""}`}>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden cursor-zoom-in block order-1"
        >
          <Image
            src={cloudinaryUrl(main.cloudinaryPublicId, { width: 1200 })}
            alt={productName}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </button>

        {hasThumbnails && (
          <div className="grid grid-cols-3 md:grid-cols-1 gap-3 order-2">
            {thumbnails.map((img, i) => (
              <button
                key={img.cloudinaryPublicId}
                type="button"
                onClick={() => selectThumbnail(i)}
                className="group relative w-full aspect-[4/5] border border-taupe/30 overflow-hidden hover:border-rose transition-colors"
              >
                <Image
                  src={cloudinaryUrl(img.cloudinaryPublicId, { width: 400 })}
                  alt={`${productName} — styled look ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 20vw, 33vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-cream text-sm border border-cream/40 rounded-brand px-3 py-1.5 hover:border-cream"
          >
            Close
          </button>
          <div
            className="relative w-full max-w-3xl aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={cloudinaryUrl(main.cloudinaryPublicId, { width: 1600 })}
              alt={productName}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
