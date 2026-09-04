import { Container } from "@/components/ui/container";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/social-icons";

export const metadata = { title: "Contact Us — Fabrics & Bridals" };

// Placeholder handles — swap for the real accounts when ready.
const socialLinks = [
  { href: "https://instagram.com/fabricsandbridals", label: "Instagram", Icon: InstagramIcon },
  { href: "https://facebook.com/fabricsandbridals", label: "Facebook", Icon: FacebookIcon },
  { href: "https://tiktok.com/@fabricsandbridals", label: "TikTok", Icon: TikTokIcon },
  { href: "https://wa.me/2348012345678", label: "WhatsApp", Icon: WhatsAppIcon },
];

export default function ContactPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-6">Contact us</h1>
      <p className="text-ink/80 mb-10">
        Questions about an order, a fabric, or your bridal consultation?
        Reach out and we&apos;ll get back to you.
      </p>

      <dl className="space-y-6 text-sm">
        <div>
          <dt className="text-taupe mb-1">Email</dt>
          <dd>
            <a href="mailto:hello@fabricsandbridals.com" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              hello@fabricsandbridals.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-taupe mb-1">Phone / WhatsApp</dt>
          <dd>
            <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              +234 801 234 5678
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-taupe mb-1">Studio address</dt>
          <dd>14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria</dd>
        </div>
        <div>
          <dt className="text-taupe mb-1">Studio hours</dt>
          <dd>Monday – Saturday, 9am – 6pm</dd>
        </div>
      </dl>

      <div className="flex items-center gap-5 mt-10">
        {socialLinks.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-taupe hover:text-blush transition-colors"
          >
            <Icon className="w-6 h-6" />
          </a>
        ))}
      </div>

      <p className="text-xs text-taupe mt-8">
        Contact details and social handles above are dummy placeholders —
        replace with your real business email, phone number, address,
        hours, and social accounts.
      </p>
    </Container>
  );
}
