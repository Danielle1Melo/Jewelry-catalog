import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const featuredProducts: Product[] = [
  { id: 1, name: "Colar Lua Crescente", price: 89, category: "Colares", isNew: true, image: earringsImg },
  { id: 2, name: "Brincos Aria Drop", price: 65, category: "Brincos", isNew: true, image: earringsImg },
  { id: 3, name: "Pulseira Serpente", price: 120, category: "Braceletes", isNew: true, image: earringsImg },
  { id: 4, name: "Amuleto Estrela Celeste", price: 45, category: "Berloques", isNew: false, image: earringsImg },
  { id: 5, name: "Brinco Ponto de Luz", price: 48, category: "Brincos", isNew: true, image: earringsImg },
  { id: 6, name: "Colar de Pérolas", price: 135, category: "Colares", isNew: false, image: earringsImg },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.id}`} className="group">
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
    </Link>
  );
}

interface FeaturedProductsProps {
  activeTab: string;
}

export function FeaturedProducts({ activeTab }: FeaturedProductsProps) {
  const filtered =
    activeTab === "Todos"
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === activeTab);

  return (
    <section id="destaques" className="px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold tracking-widest text-tiffany uppercase">
            Selecionado para você
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-title">
            Peças em destaque
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-sm font-semibold text-tiffany transition-colors hover:text-tiffany-dark"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
