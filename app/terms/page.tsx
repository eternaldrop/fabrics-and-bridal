import { Container } from "@/components/ui/container";

export const metadata = { title: "Terms & Conditions — Fabrics & Bridals" };

export default function TermsPage() {
  return (
    <Container className="py-16 max-w-2xl">
      <h1 className="font-serif text-4xl mb-2">Terms &amp; conditions</h1>
      <p className="text-taupe text-sm mb-10">Last updated: September 4, 2026</p>

      <div className="space-y-8 text-ink/80 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-ink mb-2">1. Acceptance of terms</h2>
          <p>
            By using this site and placing an order, you agree to these
            terms. If you don&apos;t agree, please don&apos;t use the site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">2. Orders and pricing</h2>
          <p>
            Prices are shown in Nigerian Naira (₦) and may change without notice.
            An order is confirmed once payment is received. We reserve the
            right to cancel and refund an order we cannot fulfill.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">3. Custom and made-to-order items</h2>
          <p>
            Custom and made-to-measure orders are produced based on the
            measurements and details you provide. Because these items are
            made specifically for you, they are generally not eligible for
            return or exchange except where the item is faulty or
            significantly different from what was ordered.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">4. Bridal consultations and mood boards</h2>
          <p>
            Mood boards are created based on the preferences you share
            during your consultation. Approving a mood board authorizes us
            to proceed with matching orders you place from it.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">5. Intellectual property</h2>
          <p>
            All site content — including photography, mood boards, and
            written material — belongs to us or our licensors and may not
            be reused without permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">6. Limitation of liability</h2>
          <p>
            We aren&apos;t liable for indirect or consequential losses
            arising from use of this site or delays outside our
            reasonable control.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">7. Governing law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink mb-2">8. Contact</h2>
          <p>
            Questions about these terms?{" "}
            <a href="/contact" className="underline decoration-taupe underline-offset-4 hover:text-blush">
              Contact us
            </a>
            .
          </p>
        </section>
      </div>

      <p className="text-xs text-taupe mt-10 border-t border-taupe/30 pt-6">
        This is placeholder legal content, not legal advice — the date,
        currency, and jurisdiction above are dummy values (assumed
        Nigeria, based on the Paystack integration). Have a lawyer review
        and confirm everything, including the return policy, before
        launch.
      </p>
    </Container>
  );
}
