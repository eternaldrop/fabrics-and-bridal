"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductForm } from "@/components/admin/product-form";

export function AddProductModal({ type }: { type: "fabric" | "outfit" }) {
  const [open, setOpen] = useState(false);
  const label = type === "fabric" ? "Fabric" : "Outfit";

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        + Add {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Add a new ${label.toLowerCase()}`}>
        <ProductForm fixedType={type} onSaved={() => setOpen(false)} />
      </Modal>
    </>
  );
}
