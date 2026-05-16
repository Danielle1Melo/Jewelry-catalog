"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddCategoryDialogProps {
  onSaved?: () => void;
}

export function AddCategoryDialog({ onSaved }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar categoria.");
        return;
      }

      setName("");
      setOpen(false);
      onSaved?.();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="bg-gray-800 hover:bg-gray-900">
          <Plus className="h-4 w-4" />
          Add Categoria
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogTitle>Add Categoria</DialogTitle>
        <DialogDescription className="sr-only">
          Digite o nome da nova categoria.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              placeholder="Ex: Brincos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Categoria"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
