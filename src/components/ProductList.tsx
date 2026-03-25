"use client";

import { DeleteProductDialog } from "./admin/DeleteProductDialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import Image from "next/image";
import { AddProductDialog } from "./admin/AddProductDialog";
import { EditProductDialog } from "./admin/EditProductDialog";
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
          R${product.price} · {product.category}
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

  return (
    <main className="px-5 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-title">Produtos</h2>
          <p className="text-sm text-description">
            {products.length} itens no catálogo
          </p>
        </div>

        <AddProductDialog />
      </div>

      <ScrollArea.Root className="overflow-hidden rounded-xl bg-white shadow-sm">
        <ScrollArea.Viewport className="h-full w-full">
          {products.map((product, index) => (
            <div key={product.id}>
              <ProductRow product={product} />
              {index < products.length - 1 && (
                <Separator.Root className="mx-4 h-px bg-gray-100" />
              )}
            </div>
          ))}
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
