import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedSampleMoodBoard } from "@/lib/mood-boards";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { MoodBoardPalette } from "@/components/bridal/mood-board-palette";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { Reveal } from "@/components/ui/reveal";

export const metadata = { title: "A Sample Mood Board — Fabrics & Bridals" };

// Editorial commentary for the featured board — written once, tailored to
// its palette, since the sample content doesn't carry per-note data.
const stylingNotes = [
  "Fabric: soft ivory chantilly lace paired with airy blush chiffon keeps the palette light without feeling flat.",
  "Palette: warm gold accents — jewellery, stationery, candles — lift the blush-and-sage combination for golden-hour photos.",
  "Silhouette: relaxed, garden-appropriate drape — nothing structured or heavy that would feel out of place outdoors.",
];

export default async function SampleMoodBoardPage() {
  const board = await getFeaturedSampleMoodBoard();
  if (!board) notFound();

  return (
    <Container className="py-16 md:py-20 max-w-3xl">
      <Link
        href="/bridal/consultation"
        className="link-underline text-sm text-taupe hover:text-ink transition-colors"
      >
        ← Back to consultation
      </Link>

      <Reveal>
        <p className="text-xs text-taupe uppercase tracking-wide mt-8">A sample mood board</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-2">{board.title}</h1>
        {board.styleDescriptor && (
          <p className="text-ink/80 mt-3 max-w-lg">{board.styleDescriptor}</p>
        )}
        <p className="text-taupe text-sm mt-4 max-w-lg">
          This is the kind of board a stylist puts together after your free
          consultation — a curated palette, fabric and outfit inspiration, and
          notes on how it all comes together.
        </p>
      </Reveal>

      {board.colorPalette.length > 0 && (
        <Reveal className="mt-12">
          <h2 className="font-serif text-xl mb-4">The palette</h2>
          <MoodBoardPalette palette={board.colorPalette} />
        </Reveal>
      )}

      {board.images.length > 0 && (
        <Reveal className="mt-12">
          <h2 className="font-serif text-xl mb-4">Fabric &amp; styling inspiration</h2>
          <div className="grid grid-cols-2 gap-3">
            {board.images.map((img, i) => (
              <div
                key={img.cloudinaryPublicId + i}
                className={`group relative border border-taupe/20 overflow-hidden transition-shadow duration-300 hover:shadow-lg ${
                  i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={cloudinaryUrl(img.cloudinaryPublicId, { width: 900 })}
                  alt={`${board.title} — inspiration ${i + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="mt-12">
        <h2 className="font-serif text-xl mb-4">Styling notes</h2>
        <ul className="space-y-3 text-sm text-ink/80">
          {stylingNotes.map((note) => (
            <li key={note} className="flex gap-3">
              <span className="text-rose">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-16 pt-10 border-t border-taupe/20 text-center">
        <h2 className="font-serif text-2xl md:text-3xl mb-4">Ready for your own board?</h2>
        <LinkButton href="/bridal/consultation" variant="primary">
          Book Your Consultation
        </LinkButton>
      </Reveal>
    </Container>
  );
}
