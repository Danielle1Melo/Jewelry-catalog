"use client";

import { useEffect, useState, useCallback } from "react";
import { DeleteProductDialog } from "./admin/DeleteProductDialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import Image from "next/image";
import { AddProductDialog } from "./admin/AddProductDialog";
import { AddCategoryDialog } from "./admin/AddCategoryDialog";
import { EditProductDialog } from "./admin/EditProductDialog";
import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface ProductImage {
  id: string;
  url: string;
  publicId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sizeDetails: string;
  isNew: boolean;
  soldOut: boolean;
  category: { id: string; name: string };
  images: ProductImage[];
}

function ProductRow({
  product,
  onMutate,
}: {
  product: Product;
  onMutate: () => void;
}) {
  const firstImage = product.images[0]?.url;

  return (
    <div className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4">
      <div className="h-11 w-11 rounded-md shrink-0 overflow-hidden bg-gray-200 sm:h-14 sm:w-14">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            width={56}
            height={56}
            sizes="(max-width: 640px) 44px, 56px"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-title">{product.name}</p>
        <p className="text-xs text-description">
          {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · {product.category.name}
          {product.isNew && " · Novidade"}
          {product.soldOut && <span className="text-red-500"> · Esgotado</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <EditProductDialog product={product} onSaved={onMutate} />
        <DeleteProductDialog product={product} onDeleted={onMutate} />
      </div>
    </div>
  );
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [categories, setCategories] = useState<string[]>(["Todas"]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        setProducts(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((cats: { name: string }[]) => {
        setCategories(["Todas", ...cats.map((c) => c.name)]);
      })
      .catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    if (categoryFilter !== "Todas" && p.category.name !== categoryFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="px-5 py-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-title">Produtos</h2>
          <p className="text-sm text-description">
            {filtered.length} de {products.length} itens
          </p>
        </div>

        <div className="flex gap-2">
          <AddProductDialog onSaved={fetchProducts} />
          <AddCategoryDialog />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-description" />
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-tiffany" />
        </div>
      ) : (
        <ScrollArea.Root className="max-h-[calc(100vh-16rem)] overflow-hidden rounded-xl bg-white shadow-sm">
          <ScrollArea.Viewport className="h-full w-full">
            {filtered.length > 0 ? (
              filtered.map((product, index) => (
                <div key={product.id}>
                  <ProductRow product={product} onMutate={fetchProducts} />
                  {index < filtered.length - 1 && (
                    <Separator.Root className="mx-4 h-px bg-gray-100" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-description">Nenhum produto encontrado.</p>
              </div>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none bg-transparent p-0.5 transition-colors data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-300 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}
    </main>
  );
}
