"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface GalleryImage {
  cloudinaryPublicId: string;
}

export function ProductGallery({
  images: allImages,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  // Every fabric/outfit shows exactly 3 images: a main shot plus two style
  // photos — matches what the admin upload form collects, so this never
  // has to handle more.
  const images = allImages.slice(0, 3);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const selected = images[selectedIndex] ?? images[0];
  const hasThumbnails = images.length > 1;

  return (
    <div>
      {/* With only one image, the main shot just takes the full width —
          reserving a second grid column here would leave a hollow gap
          where the thumbnails would have been. On desktop the thumbnail
          rail is a fixed, narrow column (md:h-full + grid-rows-3) so the
          three thumbnails' combined height always equals the main image's
          height, instead of each one independently matching its aspect
          ratio and the stack towering over the main shot. */}
      <div className={`grid grid-cols-1 gap-3 ${hasThumbnails ? "md:grid-cols-[1fr_96px]" : ""}`}>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden cursor-zoom-in block order-1 transition-shadow duration-300 hover:shadow-lg active:scale-[0.99]"
        >
          <Image
            key={selected.cloudinaryPublicId}
            src={cloudinaryUrl(selected.cloudinaryPublicId, { width: 1200 })}
            alt={productName}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="animate-fade-in object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        </button>

        {hasThumbnails && (
          <div className="grid grid-cols-3 gap-3 order-2 md:grid-cols-1 md:grid-rows-3 md:h-full">
            {images.map((img, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={img.cloudinaryPublicId}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-current={isSelected}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  className={`group relative w-full aspect-[4/5] md:aspect-auto md:h-full overflow-hidden transition-[border-color,transform,opacity] duration-200 active:scale-95 ${
                    isSelected
                      ? "border-2 border-ink opacity-100"
                      : "border border-taupe/30 opacity-70 hover:opacity-100 hover:border-rose"
                  }`}
                >
                  <Image
                    src={cloudinaryUrl(img.cloudinaryPublicId, { width: 200 })}
                    alt={`${productName} — image ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 96px, 33vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-cream text-sm border border-cream/40 rounded-brand px-3 py-1.5 hover:border-cream transition-[border-color,transform] duration-150 hover:scale-105 active:scale-95"
          >
            Close
          </button>
          <div
            className="animate-zoom-in relative w-full max-w-3xl aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={selected.cloudinaryPublicId}
              src={cloudinaryUrl(selected.cloudinaryPublicId, { width: 1600 })}
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
