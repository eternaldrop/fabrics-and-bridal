"use client";

import { useState } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

export function ProductGallery({
  images,
  productName,
}: {
  images: { cloudinaryPublicId: string }[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 flex items-center justify-center text-taupe text-sm">
        No images yet
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative w-full aspect-[4/5] bg-taupe/10 border border-taupe/20 overflow-hidden cursor-zoom-in block"
      >
        <Image
          src={cloudinaryUrl(active.cloudinaryPublicId, { width: 1200 })}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </button>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((img, i) => (
            <button
              key={img.cloudinaryPublicId + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 aspect-[4/5] border overflow-hidden ${
                i === activeIndex ? "border-ink" : "border-taupe/30"
              }`}
            >
              <Image
                src={cloudinaryUrl(img.cloudinaryPublicId, { width: 200 })}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

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
          <div className="relative w-full max-w-3xl aspect-[4/5]">
            <Image
              src={cloudinaryUrl(active.cloudinaryPublicId, { width: 1600 })}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
