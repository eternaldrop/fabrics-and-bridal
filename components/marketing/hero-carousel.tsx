"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import type { HeroCarouselSlide } from "./hero-carousel-data";

const AUTO_ADVANCE_MS = 5500;

export function HeroCarousel({ slides }: { slides: HeroCarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (isPaused) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isPaused, slides.length]);

  return (
    <section
      className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-ink"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Fabrics & Bridals highlights"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "z-10" : "z-0"
          }`}
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <SlideCollage slide={slide} isPriority={i === 0} />
        </div>
      ))}

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-cream/50 text-cream flex items-center justify-center hover:border-cream hover:bg-ink/20 transition-colors"
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-cream/50 text-cream flex items-center justify-center hover:border-cream hover:bg-ink/20 transition-colors"
      >
        <ChevronIcon direction="right" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            aria-current={i === index}
            className={`rounded-full transition-all duration-300 ${
              i === index ? "w-6 h-2 bg-rose" : "w-2 h-2 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function SlideCollage({ slide, isPriority }: { slide: HeroCarouselSlide; isPriority: boolean }) {
  const [primary, second, third] = slide.images;

  return (
    <div className="relative w-full h-full">
      {primary && (
        <Image
          src={cloudinaryUrl(primary.publicId, { width: 2000 })}
          alt={primary.alt}
          fill
          sizes="100vw"
          priority={isPriority}
          className="object-cover"
        />
      )}

      {/* Layered collage cards — desktop only, per spec ("stack or simplify
          the multi-image collage on mobile"); mobile keeps just the
          primary image so the cursive title stays uncluttered. */}
      {second && (
        <div className="hidden md:block absolute bottom-12 right-10 w-[24%] aspect-[4/5] border-4 border-cream overflow-hidden">
          <Image
            src={cloudinaryUrl(second.publicId, { width: 600 })}
            alt={second.alt}
            fill
            sizes="24vw"
            className="object-cover"
          />
        </div>
      )}
      {third && (
        <div className="hidden lg:block absolute bottom-[26%] right-[27%] w-[18%] aspect-[4/5] border-4 border-cream overflow-hidden">
          <Image
            src={cloudinaryUrl(third.publicId, { width: 500 })}
            alt={third.alt}
            fill
            sizes="18vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Scrim for text legibility over the photo — a targeted exception
          to the site's "no gradients" rule, used only here for contrast. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />

      <Container className="relative h-full flex flex-col justify-end pb-24 md:pb-28">
        <h2 className="font-script text-6xl md:text-8xl text-cream leading-none">
          {slide.title}
        </h2>
        <p className="mt-4 text-cream/85 max-w-md">{slide.subtext}</p>
      </Container>

      {slide.credits && slide.credits.length > 0 && (
        <p className="absolute bottom-2 right-3 z-20 text-[10px] text-cream/50">
          Photo: {slide.credits.join(" · ")}
        </p>
      )}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={direction === "left" ? "M10 3L5 8L10 13" : "M6 3L11 8L6 13"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
