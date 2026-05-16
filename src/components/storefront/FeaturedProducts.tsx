"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  isNew: boolean;
  soldOut: boolean;
  category: { id: string; name: string };
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
        {product.soldOut ? (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Esgotado
          </span>
        ) : product.isNew ? (
          <span className="absolute left-2 top-2 rounded-full bg-tiffany px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Novo
          </span>
        ) : null}
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

  const isAll = activeTab === "Todos";

  useEffect(() => {
    const params = new URLSearchParams();
    if (isAll) {
      params.set("new", "true");
    } else {
      params.set("category", activeTab);
    }

    setLoading(true);
    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        if (!isAll) {
          // Sort: novidades first
          data.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        }
        setProducts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const displayProducts = isAll ? products : products.slice(0, 4);

  return (
    <section className="px-5 pb-10">
      <div className="mx-auto max-w-7xl">
        {isAll && (
          <div className="mb-6 text-center">
            <span className="text-xs font-semibold tracking-widest text-title uppercase">
              Selecionado para você
            </span>
            <h2 className="mt-1 font-heading text-2xl font-bold text-title">
              Novidades
            </h2>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-tiffany" />
          </div>
        ) : displayProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {!isAll && (
              <div className="mt-6 text-center">
                <Link
                  href={`/catalogo?categoria=${encodeURIComponent(activeTab)}`}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-tiffany px-6 py-2.5 text-sm font-semibold text-tiffany transition-colors hover:bg-tiffany hover:text-white"
                >
                  Ver todos os produtos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-description">
              {isAll
                ? "Nenhuma novidade no momento."
                : "Nenhum produto nesta categoria."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
