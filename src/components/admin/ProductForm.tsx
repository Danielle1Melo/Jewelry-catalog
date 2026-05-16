"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X as XIcon, ImagePlus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { uploadImages, type UploadedImage } from "@/services/uploadService";

export interface ProductFormData {
  name: string;
  price: string;
  categoryId: string | null;
  description: string;
  sizeDetails: string;
  isNew: boolean;
}

export interface ExistingImage {
  id: string;
  url: string;
  publicId: string;
}

interface ImagePreview {
  id: string;
  file: File;
  previewUrl: string;
}

type ImageItem =
  | { type: "existing"; data: ExistingImage }
  | { type: "new"; data: ImagePreview };

function getItemKey(item: ImageItem) {
  return item.type === "existing" ? `e-${item.data.id}` : `n-${item.data.id}`;
}

function getItemSrc(item: ImageItem) {
  return item.type === "existing" ? item.data.url : item.data.previewUrl;
}

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  existingImages?: ExistingImage[];
  submitLabel: string;
  onSubmit: (data: ProductFormData, images: UploadedImage[]) => void | Promise<void>;
  onClose: () => void;
}

const emptyFormData: ProductFormData = {
  name: "",
  price: "",
  categoryId: null,
  description: "",
  sizeDetails: "",
  isNew: false,
};

export function ProductForm({
  initialData,
  existingImages = [],
  submitLabel,
  onSubmit,
  onClose,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData ?? emptyFormData
  );
  const [images, setImages] = useState<ImageItem[]>(
    existingImages.map((img) => ({ type: "existing", data: img }))
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const updateField = (
    field: keyof ProductFormData,
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const newItems: ImageItem[] = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.push(previewUrl);
        return {
          type: "new",
          data: { id: crypto.randomUUID(), file, previewUrl },
        };
      });
      setImages((prev) => [...prev, ...newItems]);
      e.target.value = "";
    },
    []
  );

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const item = prev[index];
      if (item.type === "new") URL.revokeObjectURL(item.data.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const moveImage = useCallback((index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.categoryId) {
      setError("Selecione uma categoria.");
      return;
    }

    setUploading(true);

    try {
      // Upload new files
      const newFiles = images
        .filter((item): item is ImageItem & { type: "new" } => item.type === "new")
        .map((item) => item.data);

      const uploaded =
        newFiles.length > 0
          ? await uploadImages(newFiles.map((f) => f.file))
          : [];

      // Build uploadedMap: preview id → uploaded result
      const uploadedMap = new Map<string, UploadedImage>();
      newFiles.forEach((f, i) => uploadedMap.set(f.id, uploaded[i]));

      // Build final ordered images array
      const allImages: UploadedImage[] = images.map((item) => {
        if (item.type === "existing") {
          return { url: item.data.url, publicId: item.data.publicId };
        }
        return uploadedMap.get(item.data.id)!;
      });

      await onSubmit(formData, allImages);
      images.forEach((item) => {
        if (item.type === "new") URL.revokeObjectURL(item.data.previewUrl);
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar o produto.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="product-name">Nome</Label>
        <Input
          id="product-name"
          placeholder="Nome do produto"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="product-price">Valor (R$)</Label>
          <Input
            id="product-price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select
            value={formData.categoryId ? String(formData.categoryId) : undefined}
            onValueChange={(value) => updateField("categoryId", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-description">Descrição</Label>
        <Textarea
          id="product-description"
          placeholder="Descrição do produto"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-size">Tamanho/Detalhes</Label>
        <Input
          id="product-size"
          placeholder="40cm"
          value={formData.sizeDetails}
          onChange={(e) => updateField("sizeDetails", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Imagens <span className="font-normal text-description">(primeira = capa)</span></Label>

        <div className="grid grid-cols-3 gap-2">
          {images.map((item, index) => (
            <div
              key={getItemKey(item)}
              className={`group relative aspect-square overflow-hidden rounded-md border-2 ${
                index === 0 ? "border-tiffany" : "border-gray-200"
              }`}
            >
              <img
                src={getItemSrc(item)}
                alt={index === 0 ? "Capa" : `Imagem ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {index === 0 && (
                <span className="absolute left-1 bottom-1 rounded bg-tiffany px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Capa
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              >
                <XIcon className="h-3 w-3" />
              </button>

              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    className="rounded bg-black/50 p-0.5 text-white cursor-pointer hover:bg-black/70"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    className="rounded bg-black/50 p-0.5 text-white cursor-pointer hover:bg-black/70"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-description transition-colors hover:border-tiffany hover:text-tiffany">
            <ImagePlus className="h-6 w-6" />
            <span className="mt-1 text-xs">Adicionar</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="product-is-new"
          checked={formData.isNew}
          onCheckedChange={(checked) => updateField("isNew", checked === true)}
        />
        <Label htmlFor="product-is-new" className="cursor-pointer font-normal">
          Marcar como Novidade
        </Label>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full justify-center"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
