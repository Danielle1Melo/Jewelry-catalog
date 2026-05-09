import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import earringsImg from "@/assets/earrings.png";

const categories = [
  { name: "Brincos", image: earringsImg },
  { name: "Colares", image: earringsImg },
  { name: "Braceletes", image: earringsImg },
  { name: "Berloques", image: earringsImg },
];

const TABS = ["Todos", "Brincos", "Colares", "Braceletes", "Berloques", "Pulseiras Femininas", "Pulseiras Masculinas", "Colares Masculinos", "Pingentes", "Relógios", "Anéis", "Tornozeleiras"];

interface CategoriesSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CategoriesSection({ activeTab, onTabChange }: CategoriesSectionProps) {
  return (
    <section id="categorias" className="px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold tracking-widest text-tiffany uppercase">
            Busque por
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-title">
            Categorias
          </h2>
        </div>

        <div className="relative mb-6">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent" />
          <div className="flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalogo?categoria=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-[4/3]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <span className="inline-flex items-center gap-0.5 text-xs text-tiffany">
                  Explorar
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
