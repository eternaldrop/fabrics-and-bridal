"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Label, Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

interface FormState {
  consultationType: "live" | "async" | "";
  preferredDate: string;
  weddingDate: string;
  venueType: string;
  season: string;
  budgetRange: string;
  styleInspiration: string;
  preferredColors: string;
  inspirationImagePublicIds: string[];
}

const initialState: FormState = {
  consultationType: "",
  preferredDate: "",
  weddingDate: "",
  venueType: "",
  season: "",
  budgetRange: "",
  styleInspiration: "",
  preferredColors: "",
  inspirationImagePublicIds: [],
};

const TOTAL_STEPS = 6;

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

  const canProceedStep1 = form.consultationType !== "";

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
      <div className="max-w-lg">
        <h2 className="font-serif text-3xl mb-4">You&apos;re booked in.</h2>
        <p className="text-ink/80">
          We&apos;ve received your consultation request. Your stylist will
          reach out{" "}
          {form.consultationType === "live"
            ? "to confirm your call time"
            : "with your written consultation"}
          , and your mood board will appear in your account once it&apos;s
          ready.
        </p>
        <Button className="mt-8" onClick={() => router.push("/")}>
          Back to home
        </Button>
        <p className="text-xs text-taupe mt-3">
          Order history and booking status in your account are coming in a
          later phase — for now, your stylist will reach you by email.
        </p>
      </div>
    );
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="max-w-lg">
      {/* Progress dots — not numbered steps per the design brief, since this
          is a genuine step sequence it's the one place numbers would be
          fine, but dots read calmer for a "guided conversation" feel. */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-rose" : "bg-taupe/20"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-2">
            How would you like your consultation?
          </h2>
          <p className="text-taupe mb-6">Both options lead to the same personal mood board.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => update("consultationType", "live")}
              className={`text-left border rounded-brand p-5 transition-colors ${
                form.consultationType === "live" ? "border-ink bg-rose/10" : "border-taupe/30 hover:border-ink"
              }`}
            >
              <p className="font-serif text-lg">Live consultation</p>
              <p className="text-sm text-taupe mt-1">
                A scheduled call with a stylist to talk through your wedding.
              </p>
            </button>
            <button
              type="button"
              onClick={() => update("consultationType", "async")}
              className={`text-left border rounded-brand p-5 transition-colors ${
                form.consultationType === "async" ? "border-ink bg-rose/10" : "border-taupe/30 hover:border-ink"
              }`}
            >
              <p className="font-serif text-lg">Written consultation</p>
              <p className="text-sm text-taupe mt-1">
                Answer a few questions here and get your mood board without a call.
              </p>
            </button>
          </div>
          {form.consultationType === "live" && (
            <div className="mt-6">
              <Label htmlFor="preferredDate">Preferred date/time for your call</Label>
              <Input
                id="preferredDate"
                type="datetime-local"
                value={form.preferredDate}
                onChange={(e) => update("preferredDate", e.target.value)}
              />
              <p className="text-xs text-taupe mt-2">
                Calendar scheduling is coming soon — for now your stylist will
                confirm a time close to this by email.
              </p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-6">When and where?</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="weddingDate">Wedding date</Label>
              <Input
                id="weddingDate"
                type="date"
                value={form.weddingDate}
                onChange={(e) => update("weddingDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="venueType">Venue type</Label>
              <Select id="venueType" value={form.venueType} onChange={(e) => update("venueType", e.target.value)}>
                <option value="">Select one</option>
                <option value="Indoor hall">Indoor hall</option>
                <option value="Outdoor garden">Outdoor garden</option>
                <option value="Beach">Beach</option>
                <option value="Church / religious venue">Church / religious venue</option>
                <option value="Home / private residence">Home / private residence</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="season">Season</Label>
              <Select id="season" value={form.season} onChange={(e) => update("season", e.target.value)}>
                <option value="">Select one</option>
                <option value="Dry season">Dry season</option>
                <option value="Rainy season">Rainy season</option>
                <option value="Harmattan">Harmattan</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Tell us about your style</h2>
          <div className="space-y-5">
            <div>
              <Label htmlFor="preferredColors">Preferred colors</Label>
              <Input
                id="preferredColors"
                placeholder="e.g. blush, ivory, sage green"
                value={form.preferredColors}
                onChange={(e) => update("preferredColors", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="styleInspiration">Style inspiration</Label>
              <Textarea
                id="styleInspiration"
                rows={5}
                placeholder="Tell us about the feeling you want — romantic, modern, traditional, glamorous..."
                value={form.styleInspiration}
                onChange={(e) => update("styleInspiration", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-6">What&apos;s your budget range?</h2>
          <Select id="budgetRange" value={form.budgetRange} onChange={(e) => update("budgetRange", e.target.value)}>
            <option value="">Select one</option>
            <option value="Under ₦200,000">Under ₦200,000</option>
            <option value="₦200,000 – ₦500,000">₦200,000 – ₦500,000</option>
            <option value="₦500,000 – ₦1,000,000">₦500,000 – ₦1,000,000</option>
            <option value="Over ₦1,000,000">Over ₦1,000,000</option>
            <option value="Not sure yet">Not sure yet</option>
          </Select>
        </div>
      )}

      {step === 5 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-2">Any inspiration photos?</h2>
          <p className="text-taupe mb-6">Optional — skip this if you don&apos;t have any yet.</p>
          {uploadPreset ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{ multiple: true, maxFiles: 6 }}
              onSuccess={(result) => {
                const info = result.info;
                if (info && typeof info === "object" && "public_id" in info) {
                  update("inspirationImagePublicIds", [
                    ...form.inspirationImagePublicIds,
                    (info as { public_id: string }).public_id,
                  ]);
                }
              }}
            >
              {({ open }) => (
                <Button type="button" variant="ghost" onClick={() => open()}>
                  Upload photos
                </Button>
              )}
            </CldUploadWidget>
          ) : (
            <p className="text-sm text-taupe">
              Photo upload isn&apos;t configured yet — you can skip this step.
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 6 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Review your consultation</h2>
          <dl className="space-y-3 text-sm border-t border-taupe/20 pt-6">
            <Row label="Type" value={form.consultationType === "live" ? "Live consultation" : "Written consultation"} />
            {form.weddingDate && <Row label="Wedding date" value={form.weddingDate} />}
            {form.venueType && <Row label="Venue" value={form.venueType} />}
            {form.season && <Row label="Season" value={form.season} />}
            {form.preferredColors && <Row label="Colors" value={form.preferredColors} />}
            {form.styleInspiration && <Row label="Inspiration" value={form.styleInspiration} />}
            {form.budgetRange && <Row label="Budget" value={form.budgetRange} />}
            {form.inspirationImagePublicIds.length > 0 && (
              <Row label="Photos" value={`${form.inspirationImagePublicIds.length} uploaded`} />
            )}
          </dl>
          {error && <p className="text-sm text-blush mt-4">{error}</p>}
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
          <Button onClick={next} disabled={step === 1 && !canProceedStep1}>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="text-taupe w-24 shrink-0">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
