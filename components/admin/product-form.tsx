"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Label, Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { FABRIC_CATEGORIES, FABRIC_MATERIALS, OUTFIT_CATEGORIES, OUTFIT_SIZES } from "@/lib/taxonomy";

type ProductType = "fabric" | "outfit";

function PhotoSlot({
  label,
  optional,
  value,
  onChange,
  uploadPreset,
}: {
  label: string;
  optional?: boolean;
  value: string | null;
  onChange: (id: string | null) => void;
  uploadPreset?: string;
}) {
  return (
    <div>
      {/* Fluid sizing throughout (no fixed px widths) — this sits in a
          3-column grid that can get quite narrow on small phones, and a
          fixed-width box there would overflow its column and push the
          page into horizontal scroll. */}
      <p className="text-xs text-taupe mb-2">
        {label}
        {optional && <span className="text-taupe/70"> (optional)</span>}
      </p>
      {value ? (
        <div className="relative w-full aspect-[4/5] border border-taupe/30 overflow-hidden">
          <Image
            src={cloudinaryUrl(value, { width: 200 })}
            alt={label}
            fill
            sizes="(min-width: 768px) 120px, 30vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 bg-ink/80 text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none transition-transform duration-150 hover:scale-110 active:scale-90"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            ×
          </button>
        </div>
      ) : uploadPreset ? (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{ multiple: false, maxFiles: 1 }}
          onSuccess={(result) => {
            const info = result.info;
            if (info && typeof info === "object" && "public_id" in info) {
              onChange((info as { public_id: string }).public_id);
            }
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="w-full aspect-[4/5] border border-dashed border-taupe/40 rounded-brand flex items-center justify-center text-xs text-taupe transition-colors duration-150 hover:border-ink hover:text-ink"
            >
              Upload
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <p className="text-xs text-blush">
          Cloudinary preset not configured.
        </p>
      )}
    </div>
  );
}

export function ProductForm({ fixedType }: { fixedType?: ProductType } = {}) {
  const router = useRouter();
  const [type, setType] = useState<ProductType>(fixedType ?? "fabric");
  // Every product uses three fixed photo slots — the item itself, plus up
  // to two optional style shots — so the gallery on its detail page always
  // has exactly 3 images to work with. Position 0 in productImages is
  // always the main photo, so the submitted `images` array is built as
  // [main, style1, style2].
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [styleImage1, setStyleImage1] = useState<string | null>(null);
  const [styleImage2, setStyleImage2] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submittedImages = [mainImage, styleImage1, styleImage2].filter(
    (id): id is string => Boolean(id)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (submittedImages.length === 0) {
      setError(
        type === "fabric"
          ? "Upload a main fabric photo before saving."
          : "Upload a main photo before saving."
      );
      return;
    }

    const form = new FormData(e.currentTarget);
    const sizes = form.getAll("sizes").map(String);
    const colorVariants = String(form.get("colorVariants") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      type,
      name: form.get("name"),
      description: form.get("description") || undefined,
      category: form.get("category") || undefined,
      material: form.get("material") || undefined,
      color: form.get("color") || undefined,
      occasion: form.get("occasion") || undefined,
      width: type === "fabric" ? form.get("width") || undefined : undefined,
      careInstructions: type === "fabric" ? form.get("careInstructions") || undefined : undefined,
      price: form.get("price"),
      isCustomOrderable: form.get("isCustomOrderable") === "on",
      stockQuantity: form.get("stockQuantity") || undefined,
      tags,
      images: submittedImages,
      sizes: type === "outfit" ? sizes : [],
      colorVariants,
    };

    setSubmitting(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Couldn't save this item. Please try again.");
      return;
    }

    setSuccess(true);
    setMainImage(null);
    setStyleImage1(null);
    setStyleImage2(null);
    e.currentTarget.reset();
    router.refresh();
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-taupe/30 rounded-brand p-6">
      {!fixedType && (
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
            <input
              type="radio"
              name="type-select"
              checked={type === "fabric"}
              onChange={() => setType("fabric")}
              className="accent-ink transition-transform duration-150 active:scale-90"
            />
            Fabric
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
            <input
              type="radio"
              name="type-select"
              checked={type === "outfit"}
              onChange={() => setType("outfit")}
              className="accent-ink transition-transform duration-150 active:scale-90"
            />
            Outfit
          </label>
        </div>
      )}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue="" required>
            <option value="" disabled>
              Choose a category
            </option>
            {(type === "fabric" ? FABRIC_CATEGORIES : OUTFIT_CATEGORIES).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" />
        </div>
      </div>

      {type === "fabric" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="material">Material</Label>
            <Select id="material" name="material" defaultValue="" required>
              <option value="" disabled>
                Choose a material
              </option>
              {FABRIC_MATERIALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price per yard</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" required />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="material">Material</Label>
            <Input id="material" name="material" placeholder="e.g. Silk satin, Ankara cotton" />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" required />
          </div>
        </div>
      )}

      {type === "outfit" && (
        <div>
          <Label>Available sizes</Label>
          <div className="flex flex-wrap gap-4">
            {OUTFIT_SIZES.map((size) => (
              <label key={size} className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
                <input type="checkbox" name="sizes" value={size} className="accent-ink transition-transform duration-150 active:scale-90" />
                {size}
              </label>
            ))}
          </div>
        </div>
      )}

      {type === "fabric" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width">Width</Label>
            <Input id="width" name="width" placeholder="e.g. 58 inches" />
          </div>
          <div>
            <Label htmlFor="careInstructions">Care instructions</Label>
            <Input id="careInstructions" name="careInstructions" placeholder="e.g. Dry clean only" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="occasion">Occasion</Label>
          <Input id="occasion" name="occasion" placeholder="Wedding, everyday, party..." />
        </div>
        <div>
          <Label htmlFor="stockQuantity">
            Stock quantity <span className="text-taupe">(leave blank if made-to-order)</span>
          </Label>
          <Input id="stockQuantity" name="stockQuantity" type="number" min="0" />
        </div>
      </div>

      <div>
        <Label htmlFor="colorVariants">Other color options (comma-separated)</Label>
        <Input id="colorVariants" name="colorVariants" placeholder="Wine, ivory, gold" />
      </div>

      <div>
        <Label htmlFor="tags">Search tags (comma-separated)</Label>
        <Input id="tags" name="tags" placeholder="lace, bridal, floral" />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer transition-colors duration-150 hover:text-blush">
        <input type="checkbox" name="isCustomOrderable" className="accent-ink transition-transform duration-150 active:scale-90" />
        Available for custom / made-to-order requests
      </label>

      <div>
        <Label>Photos</Label>
        <p className="text-sm text-taupe mb-3">
          One main photo, plus up to two optional style shots — these are
          the exact 3 images customers see in the gallery on its detail
          page.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <PhotoSlot
            label={type === "fabric" ? "Main fabric photo" : "Main photo"}
            value={mainImage}
            onChange={setMainImage}
            uploadPreset={uploadPreset}
          />
          <PhotoSlot
            label="Style photo 1"
            optional
            value={styleImage1}
            onChange={setStyleImage1}
            uploadPreset={uploadPreset}
          />
          <PhotoSlot
            label="Style photo 2"
            optional
            value={styleImage2}
            onChange={setStyleImage2}
            uploadPreset={uploadPreset}
          />
        </div>
        {!uploadPreset && (
          <p className="text-sm text-blush mt-3">
            Cloudinary upload preset isn&apos;t configured yet — add
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local.
          </p>
        )}
      </div>

      {error && <p key={error} className="animate-shake text-sm text-blush">{error}</p>}
      {success && (
        <p className="animate-bounce-pop text-sm text-ink">Saved. It now appears in the catalog.</p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save item"}
      </Button>
    </form>
  );
}
