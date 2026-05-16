"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ProductForm, type ProductFormData, type ExistingImage } from "./ProductForm";

interface EditProductDialogProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: { id: string; name: string };
    description?: string;
    sizeDetails?: string;
    isNew: boolean;
    images?: ExistingImage[];
  };
  onSaved?: () => void;
}

export function EditProductDialog({ product, onSaved }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);

  const initialData: ProductFormData = {
    name: product.name,
    price: String(product.price),
    categoryId: product.category.id,
    description: product.description ?? "",
    sizeDetails: product.sizeDetails ?? "",
    isNew: product.isNew,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" title="Editar">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription className="sr-only">
          Edite os dados do produto.
        </DialogDescription>

        <ProductForm
          initialData={initialData}
          existingImages={product.images}
          submitLabel="Atualizar Produto"
          onSubmit={async (data, images) => {
            const res = await fetch(`/api/admin/products/${product.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: data.name,
                price: parseFloat(data.price),
                description: data.description,
                sizeDetails: data.sizeDetails,
                isNew: data.isNew,
                categoryId: data.categoryId,
                images,
              }),
            });

            if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Erro ao atualizar produto.");
            }

            onSaved?.();
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
