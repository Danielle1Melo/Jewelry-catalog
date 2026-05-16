"use client";

import { useMemo, useState } from "react";
import { DeleteProductDialog } from "./admin/DeleteProductDialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import Image from "next/image";
import { AddProductDialog } from "./admin/AddProductDialog";
import { EditProductDialog } from "./admin/EditProductDialog";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import earringsImg from "@/assets/earrings.png";

import type { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  isNew: boolean;
  image: StaticImageData;
}

const mockProducts: Product[] = [
  { id: 1, name: "Colar Meia Lua", price: 89, category: "Colares", isNew: true, image: earringsImg },
  { id: 2, name: "Brinco Gota", price: 65, category: "Brincos", isNew: true, image: earringsImg },
  { id: 3, name: "Bracelete Serpente", price: 120, category: "Braceletes", isNew: false, image: earringsImg },
  { id: 4, name: "Berloque Estrela", price: 45, category: "Berloques", isNew: true, image: earringsImg },
  { id: 5, name: "Brinco Argola Infinito", price: 78, category: "Brincos", isNew: false, image: earringsImg },
  { id: 6, name: "Colar de Pérolas", price: 135, category: "Colares", isNew: true, image: earringsImg },
  { id: 7, name: "Pulseira Trançada", price: 95, category: "Pulseiras Femininas", isNew: false, image: earringsImg },
  { id: 8, name: "Berloque Coração", price: 55, category: "Berloques", isNew: false, image: earringsImg },
  { id: 9, name: "Colar Cascata", price: 155, category: "Colares", isNew: true, image: earringsImg },
  { id: 10, name: "Brinco Ponto de Luz", price: 48, category: "Brincos", isNew: false, image: earringsImg },
  { id: 11, name: "Pulseira Ondas", price: 110, category: "Pulseiras Femininas", isNew: true, image: earringsImg },
  { id: 12, name: "Berloque Borboleta", price: 42, category: "Berloques", isNew: false, image: earringsImg },
];

function ProductRow({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-14 w-14 rounded-md shrink-0 overflow-hidden bg-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-title">{product.name}</p>
        <p className="text-xs text-description">
          {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · {product.category}
          {product.isNew && " · Novidade"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <EditProductDialog product={product} />
        <DeleteProductDialog product={product} />
      </div>
    </div>
  );
}

export function ProductList() {
  const products = mockProducts;
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))].sort();
    return ["Todas", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "Todas" && p.category !== categoryFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  return (
    <main className="px-5 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-title">Produtos</h2>
          <p className="text-sm text-description">
            {filtered.length} de {products.length} itens
          </p>
        </div>

        <AddProductDialog />
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

      <ScrollArea.Root className="max-h-[calc(100vh-16rem)] overflow-hidden rounded-xl bg-white shadow-sm">
        <ScrollArea.Viewport className="h-full w-full">
          {filtered.length > 0 ? (
            filtered.map((product, index) => (
              <div key={product.id}>
                <ProductRow product={product} />
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
    </main>
  );
}
