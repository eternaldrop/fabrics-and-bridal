import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getConsultationsForUser } from "@/lib/consultations";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export const metadata = { title: "My Account — Fabrics & Bridals" };

const statusLabels: Record<string, string> = {
  requested: "Requested",
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  const consultations = await getConsultationsForUser(session.user.id);

  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl mb-2">My account</h1>
      <p className="text-taupe mb-10">
        Signed in as {session.user.email}
      </p>

      <section className="mb-14">
        <h2 className="font-serif text-2xl mb-4">Orders</h2>
        <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
          <p className="text-taupe">
            Order history arrives with checkout in Phase 2. Items you add
            to your cart are saved on this device in the meantime.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Bridal consultations</h2>
          <LinkButton href="/bridal/consultation" variant="ghost">
            Book another
          </LinkButton>
        </div>

        {consultations.length === 0 ? (
          <div className="border border-dashed border-taupe/40 rounded-brand p-8 text-center">
            <p className="text-taupe mb-4">You haven&apos;t booked a consultation yet.</p>
            <LinkButton href="/bridal/consultation" variant="primary">
              Book Your Consultation
            </LinkButton>
          </div>
        ) : (
          <div className="divide-y divide-taupe/20 border-t border-b border-taupe/20">
            {consultations.map((c) => (
              <div key={c.id} className="py-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-lg">
                    {c.consultationType === "live" ? "Live consultation" : "Written consultation"}
                  </p>
                  <p className="text-sm text-taupe mt-1">
                    Requested {new Date(c.createdAt).toLocaleDateString()}
                    {c.weddingDate && ` · Wedding: ${c.weddingDate}`}
                  </p>
                </div>
                <span className="text-xs border border-taupe/40 rounded-brand px-3 py-1.5 shrink-0">
                  {statusLabels[c.status] ?? c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
