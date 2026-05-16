"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { PriceFilter } from "@/components/storefront/PriceFilter";
import { Footer } from "@/components/storefront/Footer";

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

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriaParam = searchParams.get("categoria") ?? "Todos";

  const PRICE_MIN = 0;
  const PRICE_MAX = 500;

  const activeTab = categoriaParam;
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((cats: { name: string }[]) => {
        setCategories(["Todos", ...cats.map((c) => c.name)]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const url =
      activeTab === "Todos"
        ? "/api/products"
        : `/api/products?category=${encodeURIComponent(activeTab)}`;

    setLoading(true);
    setProducts([]);
    fetch(url)
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams();
    if (tab !== "Todos") params.set("categoria", tab);
    router.replace(`/catalogo${params.toString() ? `?${params}` : ""}`);
  };

  const filtered = products.filter((p) => {
    if (p.price < minPrice) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  return (
    <main className="px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-description transition-colors hover:text-tiffany"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-title">
            {activeTab === "Todos" ? "Todos os Produtos" : activeTab}
          </h1>
          <p className="mt-1 text-sm text-description">
            {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        <div className="relative mb-6">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent" />
          <div className="flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-tiffany text-white"
                    : "bg-gray-100 text-description hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <PriceFilter
            min={PRICE_MIN}
            max={PRICE_MAX}
            minValue={minPrice}
            maxValue={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-tiffany" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-description">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CatalogoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <div className="flex-1">
        <Suspense>
          <CatalogoContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
