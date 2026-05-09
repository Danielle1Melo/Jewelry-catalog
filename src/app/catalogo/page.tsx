"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { PriceFilter } from "@/components/storefront/PriceFilter";
import { Footer } from "@/components/storefront/Footer";
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

const allProducts: Product[] = [
  { id: 1, name: "Colar Lua Crescente", price: 89, category: "Colares", isNew: true, image: earringsImg },
  { id: 2, name: "Brincos Aria Drop", price: 65, category: "Brincos", isNew: true, image: earringsImg },
  { id: 3, name: "Pulseira Serpente", price: 120, category: "Braceletes", isNew: true, image: earringsImg },
  { id: 4, name: "Amuleto Estrela Celeste", price: 45, category: "Berloques", isNew: false, image: earringsImg },
  { id: 5, name: "Brinco Ponto de Luz", price: 48, category: "Brincos", isNew: true, image: earringsImg },
  { id: 6, name: "Colar de Pérolas", price: 135, category: "Colares", isNew: false, image: earringsImg },
  { id: 7, name: "Pulseira Trançada", price: 95, category: "Braceletes", isNew: false, image: earringsImg },
  { id: 8, name: "Berloque Coração", price: 55, category: "Berloques", isNew: false, image: earringsImg },
  { id: 9, name: "Colar Cascata", price: 155, category: "Colares", isNew: true, image: earringsImg },
  { id: 10, name: "Brinco Argola Infinito", price: 78, category: "Brincos", isNew: false, image: earringsImg },
  { id: 11, name: "Pulseira Ondas", price: 110, category: "Braceletes", isNew: true, image: earringsImg },
  { id: 12, name: "Berloque Borboleta", price: 42, category: "Berloques", isNew: false, image: earringsImg },
];

const TABS = ["Todos", "Brincos", "Colares", "Braceletes", "Berloques", "Pulseiras Femininas", "Pulseiras Masculinas", "Colares Masculinos", "Pingentes", "Relógios", "Anéis", "Tornozeleiras"];

function ProductCard({ product }: { product: Product }) {
  return (
    <a href="#" className="group">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-tiffany px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            New
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="truncate text-sm font-medium text-title">{product.name}</p>
        <p className="text-sm font-semibold text-title">
          {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>
    </a>
  );
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoriaParam = searchParams.get("categoria") ?? "Todos";

  const PRICE_MIN = 0;
  const PRICE_MAX = 500;

  const [activeTab, setActiveTab] = useState(categoriaParam);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams();
    if (tab !== "Todos") params.set("categoria", tab);
    router.replace(`/catalogo${params.toString() ? `?${params}` : ""}`);
  };

  const filtered = allProducts.filter((p) => {
    if (activeTab !== "Todos" && p.category !== activeTab) return false;
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
            {TABS.map((tab) => (
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
            
        {filtered.length > 0 ? (
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
    <div className="min-h-screen bg-white">
      <Header />
      <Suspense>
        <CatalogoContent />
      </Suspense>
      <Footer />
    </div>
  );
}
