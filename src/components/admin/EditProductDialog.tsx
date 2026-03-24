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
    id: number;
    name: string;
    price: number;
    category: string;
    description?: string;
    sizeDetails?: string;
    isNew: boolean;
    images?: ExistingImage[];
  };
}

export function EditProductDialog({ product }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);

  const initialData: ProductFormData = {
    name: product.name,
    price: String(product.price),
    category: product.category,
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
          onSubmit={(data, images) => {
            console.log("Product updated:", {
              id: product.id,
              ...data,
              price: parseFloat(data.price),
              images,
            });
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
