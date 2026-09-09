"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Label, Input, Textarea, Select } from "@/components/ui/input";
import { Button, LinkButton } from "@/components/ui/button";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface FormState {
  guestName: string;
  guestEmail: string;
  weddingDate: string;
  venueType: string;
  weddingTheme: string;
  preferredColors: string;
  budgetRange: string;
  styleInspiration: string;
  inspirationImagePublicIds: string[];
}

const initialState: FormState = {
  guestName: "",
  guestEmail: "",
  weddingDate: "",
  venueType: "",
  weddingTheme: "",
  preferredColors: "",
  budgetRange: "",
  styleInspiration: "",
  inspirationImagePublicIds: [],
};

// Question 1 is contact info; questions 2-5 are the "four questions" the
// bridal page copy refers to.
const TOTAL_STEPS = 5;
const MAX_INSPIRATION_PHOTOS = 3;

export function ConsultationForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  const canProceedStep1 = form.guestName.trim() !== "" && form.guestEmail.trim() !== "";
  const canProceedStep2 = form.weddingDate.trim() !== "" && form.venueType.trim() !== "";
  const canProceedStep3 = form.weddingTheme.trim() !== "";
  const canProceedStep4 = form.preferredColors.trim() !== "" && form.budgetRange !== "";

  const canProceed =
    (step === 1 && canProceedStep1) ||
    (step === 2 && canProceedStep2) ||
    (step === 3 && canProceedStep3) ||
    (step === 4 && canProceedStep4) ||
    step === 5;

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="reveal is-visible max-w-lg">
        <h2 className="font-serif text-3xl mb-4">Thank you!</h2>
        <p className="text-ink/80">
          We&apos;ve received your consultation request. A stylist will send
          your first mood board to {form.guestEmail} within about four
          working days.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <LinkButton href="/bridal/sample-mood-board" variant="primary">
            View a sample mood board
          </LinkButton>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="max-w-lg">
      {/* Progress bar — dots read calmer than numbered steps for a
          "guided conversation" feel, but still show where she is. */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-rose" : "bg-taupe/20"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="reveal is-visible">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">How can we reach you?</h2>
          <p className="text-taupe mb-6">
            No account needed — your stylist will follow up directly.
          </p>
          <div className="space-y-5">
            <div>
              <Label htmlFor="guestName">Name</Label>
              <Input
                id="guestName"
                value={form.guestName}
                onChange={(e) => update("guestName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={form.guestEmail}
                onChange={(e) => update("guestEmail", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="reveal is-visible">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">When and where?</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="weddingDate">Wedding date</Label>
              <Input
                id="weddingDate"
                type="date"
                value={form.weddingDate}
                onChange={(e) => update("weddingDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="venueType">Venue type</Label>
              <Select
                id="venueType"
                value={form.venueType}
                onChange={(e) => update("venueType", e.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="Indoor hall">Indoor hall</option>
                <option value="Outdoor garden">Outdoor garden</option>
                <option value="Beach">Beach</option>
                <option value="Church / religious venue">Church / religious venue</option>
                <option value="Home / private residence">Home / private residence</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="reveal is-visible">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">What&apos;s your wedding theme?</h2>
          <p className="text-taupe mb-6">
            Describe it in your own words — romantic, modern, traditional,
            glamorous, whatever fits.
          </p>
          <Input
            id="weddingTheme"
            placeholder="e.g. Romantic garden, modern minimalist, traditional aso-ebi"
            value={form.weddingTheme}
            onChange={(e) => update("weddingTheme", e.target.value)}
            required
          />
        </div>
      )}

      {step === 4 && (
        <div className="reveal is-visible">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Colours and budget</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="preferredColors">Favourite colours</Label>
              <Input
                id="preferredColors"
                placeholder="e.g. blush, ivory, sage green"
                value={form.preferredColors}
                onChange={(e) => update("preferredColors", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="budgetRange">Fabric / outfit budget</Label>
              <Select
                id="budgetRange"
                value={form.budgetRange}
                onChange={(e) => update("budgetRange", e.target.value)}
                required
              >
                <option value="">Select one</option>
                <option value="Under ₦200,000">Under ₦200,000</option>
                <option value="₦200,000 – ₦500,000">₦200,000 – ₦500,000</option>
                <option value="₦500,000 – ₦1,000,000">₦500,000 – ₦1,000,000</option>
                <option value="Over ₦1,000,000">Over ₦1,000,000</option>
                <option value="Not sure yet">Not sure yet</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="reveal is-visible">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Extra notes or inspiration</h2>
          <p className="text-taupe mb-6">
            Optional — share anything else that would help your stylist, or
            skip straight to booking.
          </p>
          <Textarea
            id="styleInspiration"
            rows={4}
            placeholder="Tell us about the feeling you want, or anything else worth knowing..."
            value={form.styleInspiration}
            onChange={(e) => update("styleInspiration", e.target.value)}
          />

          <div className="mt-5">
            {uploadPreset ? (
              form.inspirationImagePublicIds.length >= MAX_INSPIRATION_PHOTOS ? (
                <p className="text-sm text-taupe">
                  Maximum of {MAX_INSPIRATION_PHOTOS} photos reached — remove one below to swap it out.
                </p>
              ) : (
                <>
                  <CldUploadWidget
                    uploadPreset={uploadPreset}
                    options={{
                      multiple: true,
                      maxFiles: MAX_INSPIRATION_PHOTOS - form.inspirationImagePublicIds.length,
                    }}
                    onSuccess={(result) => {
                      const info = result.info;
                      if (info && typeof info === "object" && "public_id" in info) {
                        update("inspirationImagePublicIds", [
                          ...form.inspirationImagePublicIds,
                          (info as { public_id: string }).public_id,
                        ].slice(0, MAX_INSPIRATION_PHOTOS));
                      }
                    }}
                  >
                    {({ open }) => (
                      <Button type="button" variant="ghost" onClick={() => open()}>
                        Upload inspiration photos
                      </Button>
                    )}
                  </CldUploadWidget>
                  <p className="text-xs text-taupe mt-2">Up to {MAX_INSPIRATION_PHOTOS} photos.</p>
                </>
              )
            ) : (
              <p className="text-sm text-taupe">
                Photo upload isn&apos;t configured yet — you can skip this.
              </p>
            )}

            {form.inspirationImagePublicIds.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {form.inspirationImagePublicIds.map((publicId) => (
                  <div key={publicId} className="relative w-20 h-24 border border-taupe/30">
                    <Image
                      src={cloudinaryUrl(publicId, { width: 160 })}
                      alt="Inspiration upload"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "inspirationImagePublicIds",
                          form.inspirationImagePublicIds.filter((id) => id !== publicId)
                        )
                      }
                      className="absolute top-1 right-1 bg-ink/80 text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none transition-transform duration-150 hover:scale-110 active:scale-90"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p key={error} className="animate-shake text-sm text-blush mt-4">{error}</p>}
        </div>
      )}

      <div className="flex items-center justify-between mt-10">
        {step > 1 ? (
          <Button variant="ghost" onClick={back} disabled={submitting}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < TOTAL_STEPS ? (
          <Button onClick={next} disabled={!canProceed}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Booking..." : "Book Your Consultation"}
          </Button>
        )}
      </div>
    </div>
  );
}
