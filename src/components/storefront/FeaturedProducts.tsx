"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  isNew: boolean;
  category: { id: number; name: string };
  images: { url: string }[];
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images[0]?.url;

  return (
    <Link href={`/produto/${product.id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-tiffany px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Novo
        </span>
      </div>
      <div className="mt-2">
        <p className="truncate text-sm font-medium text-title">{product.name}</p>
        <p className="text-sm font-semibold text-title">
          {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>
    </Link>
  );
}

interface FeaturedProductsProps {
  activeTab: string;
}

export function FeaturedProducts({ activeTab }: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("new", "true");
    if (activeTab !== "Todos") params.set("category", activeTab);

    setLoading(true);
    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <section className="px-5 pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold tracking-widest text-tiffany uppercase">
            Selecionado para você
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-title">
            Novidades
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-tiffany" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-description">Nenhuma novidade nesta categoria.</p>
          </div>
        )}

      </div>
    </section>
  );
}
