"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Label, Input, Textarea, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cloudinaryUrl } from "@/lib/cloudinary-url";
import { FABRIC_CATEGORIES, FABRIC_MATERIALS } from "@/lib/taxonomy";

type ProductType = "fabric" | "outfit";

export function ProductForm() {
  const router = useRouter();
  const [type, setType] = useState<ProductType>("fabric");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (images.length === 0) {
      setError("Upload at least one photo before saving.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const sizes = String(form.get("sizes") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
      material: type === "fabric" ? form.get("material") || undefined : undefined,
      color: form.get("color") || undefined,
      occasion: form.get("occasion") || undefined,
      price: form.get("price"),
      isCustomOrderable: form.get("isCustomOrderable") === "on",
      stockQuantity: form.get("stockQuantity") || undefined,
      tags,
      images,
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
    setImages([]);
    e.currentTarget.reset();
    router.refresh();
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-taupe/30 rounded-brand p-6">
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="type-select"
            checked={type === "fabric"}
            onChange={() => setType("fabric")}
          />
          Fabric
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="type-select"
            checked={type === "outfit"}
            onChange={() => setType("outfit")}
          />
          Outfit
        </label>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          {type === "fabric" ? (
            <Select id="category" name="category" defaultValue="" required>
              <option value="" disabled>
                Choose a category
              </option>
              {FABRIC_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          ) : (
            <Input id="category" name="category" placeholder="e.g. bridal, aso-ebi, casual" />
          )}
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" />
        </div>
      </div>

      {type === "fabric" ? (
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
            <Input id="sizes" name="sizes" placeholder="S, M, L, XL" />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" min="0" required />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isCustomOrderable" />
        Available for custom / made-to-order requests
      </label>

      <div>
        <Label>Photos</Label>
        {uploadPreset ? (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            options={{ multiple: true, maxFiles: 6 }}
            onSuccess={(result) => {
              const info = result.info;
              if (info && typeof info === "object" && "public_id" in info) {
                setImages((prev) => [...prev, (info as { public_id: string }).public_id]);
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
          <p className="text-sm text-blush">
            Cloudinary upload preset isn&apos;t configured yet — add
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local.
          </p>
        )}

        {images.length > 0 && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {images.map((publicId) => (
              <div key={publicId} className="relative w-20 h-24 border border-taupe/30">
                <Image
                  src={cloudinaryUrl(publicId, { width: 160 })}
                  alt="Uploaded preview"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-blush">{error}</p>}
      {success && <p className="text-sm text-ink">Saved. It now appears in the catalog.</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save item"}
      </Button>
    </form>
  );
}
