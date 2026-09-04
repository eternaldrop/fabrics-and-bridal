import { Container } from "@/components/ui/container";

export const metadata = { title: "Privacy Policy — Fabrics & Bridals" };

export default function PrivacyPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-2">Privacy policy</h1>
      <p className="text-taupe text-sm mb-10">Last updated: [date]</p>

      <div className="space-y-8 text-ink/80 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-ink mb-2">1. Information we collect</h2>
          <p>
            When you create an account, place an order, or book a
            consultation, we collect information such as your name,
            email, measurements, order details, and — if you upload one —
            inspiration photos for your mood board.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">2. How we use your information</h2>
          <p>
            We use this information to process orders, build and share
            mood boards, communicate with you about your order or
            consultation, and improve the site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">3. Third-party services</h2>
          <p>
            We use trusted third parties to run the site: Cloudinary
            (image storage), Paystack (payment processing), and a
            database host to store your account and order data. Each
            handles data under its own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">4. Cookies</h2>
          <p>
            We use essential cookies to keep you signed in and remember
            your session. We don&apos;t use them for advertising.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">5. Your rights</h2>
          <p>
            You can request a copy of your data, ask us to correct it, or
            request deletion of your account by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">6. Contact</h2>
          <p>
            Questions about this policy?{" "}
            <a href="/contact" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              Contact us
            </a>
            .
          </p>
        </section>
      </div>

      <p className="text-xs text-taupe mt-10 border-t border-taupe/30 pt-6">
        This is placeholder legal content, not legal advice — have a
        lawyer review and adapt it to your business and applicable data
        protection law before launch.
      </p>
    </Container>
  );
}
