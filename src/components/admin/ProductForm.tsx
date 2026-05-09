"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X as XIcon, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

// TODO: buscar da API futuramente
const CATEGORIES = [
  "Brincos",
  "Colares",
  "Pulseiras Femininas",
  "Pulseiras Masculinas",
  "Colares Masculinos",
  "Pingentes",
  "Berloques",
  "Braceletes",
  "Relógios",
  "Anéis",
  "Tornozeleiras",
];
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { uploadImages, type UploadedImage } from "@/services/uploadService";

export interface ProductFormData {
  name: string;
  price: string;
  category: string;
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

interface ProductFormProps {
  initialData?: ProductFormData;
  existingImages?: ExistingImage[];
  submitLabel: string;
  onSubmit: (data: ProductFormData, images: UploadedImage[]) => void;
  onClose: () => void;
}

const emptyFormData: ProductFormData = {
  name: "",
  price: "",
  category: "",
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
  const [kept, setKept] = useState<ExistingImage[]>(existingImages);
  const [newImages, setNewImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrlsRef = useRef<string[]>([]);

  const updateField = (
    field: keyof ProductFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const previews = files.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.push(previewUrl);
        return { id: crypto.randomUUID(), file, previewUrl };
      });
      setNewImages((prev) => [...prev, ...previews]);
      e.target.value = "";
    },
    []
  );

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const removeExisting = (id: string) => {
    setKept((prev) => prev.filter((img) => img.id !== id));
  };

  const removeNew = useCallback((id: string) => {
    setNewImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.category) {
      setError("Selecione uma categoria.");
      return;
    }

    setUploading(true);

    try {
      const uploaded =
        newImages.length > 0
          ? await uploadImages(newImages.map((img) => img.file))
          : [];

      const allImages: UploadedImage[] = [
        ...kept.map((img) => ({ url: img.url, publicId: img.publicId })),
        ...uploaded,
      ];

      onSubmit(formData, allImages);
      newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
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
            value={formData.category || undefined}
            onValueChange={(value) => updateField("category", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
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

      {/* Imagens */}
      <div className="space-y-1.5">
        <Label>Imagens</Label>

        {/* Existing images (URLs) */}
        {kept.map((img) => (
          <div
            key={img.id}
            className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2"
          >
            <p className="min-w-0 flex-1 truncate text-sm text-description">
              {img.url}
            </p>
            <button
              type="button"
              onClick={() => removeExisting(img.id)}
              className="shrink-0 rounded-md p-1 text-description transition-colors hover:bg-gray-100 hover:text-title cursor-pointer"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* New image previews */}
        <div className="grid grid-cols-3 gap-2">
          {newImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-md border border-gray-200"
            >
              <img
                src={img.previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeNew(img.id)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
              >
                <XIcon className="h-3 w-3" />
              </button>
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
