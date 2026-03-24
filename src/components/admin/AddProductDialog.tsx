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

export function AddProductDialog() {
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
          onSubmit={(data, images) => {
            console.log("Product ready to save:", {
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
