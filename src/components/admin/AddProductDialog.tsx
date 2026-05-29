"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ProductForm } from "./ProductForm";

interface AddProductDialogProps {
  onSaved?: () => void;
}

export function AddProductDialog({ onSaved }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">
          <Plus className="h-4 w-4" />
          Add Produto
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Add Produto</DialogTitle>
        <DialogDescription className="sr-only">
          Preencha os dados para adicionar um novo produto ao catálogo.
        </DialogDescription>

        <ProductForm
          submitLabel="Add Produto"
          onSubmit={async (data, images) => {
            const res = await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                sizeDetails: data.sizeDetails,
                isNew: data.isNew,
                soldOut: data.soldOut,
                sizes: data.sizes,
                categoryId: data.categoryId,
                images,
              }),
            });

            if (!res.ok) {
              const err = await res.json().catch(() => null);
              throw new Error(err?.error || "Erro ao criar produto.");
            }

            onSaved?.();
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
