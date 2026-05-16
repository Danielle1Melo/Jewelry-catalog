"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteProductDialogProps {
  product: {
    id: string;
    name: string;
  };
  onDeleted?: () => void;
}

export function DeleteProductDialog({ product, onDeleted }: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Erro ao excluir produto.");
      }

      setOpen(false);
      onDeleted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao excluir produto.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" title="Excluir" aria-label="Excluir">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogTitle>Excluir Produto</DialogTitle>
        <DialogDescription className="mt-2">
          Tem certeza que deseja excluir{" "}
          <span className="font-medium text-title">{product.name}</span>? Essa
          ação não pode ser desfeita.
        </DialogDescription>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-4 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 justify-center border border-gray-200"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1 justify-center bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
