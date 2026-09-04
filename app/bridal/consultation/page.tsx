import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { ConsultationForm } from "@/components/bridal/consultation-form";

export const metadata = { title: "Book Your Consultation — Fabrics & Bridals" };

export default async function ConsultationBookingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/bridal/consultation");
  }

  return (
    <Container className="py-16 md:py-20">
      <ConsultationForm />
    </Container>
  );
}
