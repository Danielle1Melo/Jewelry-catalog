import Image from "next/image";
import { ChevronRight } from "lucide-react";
import earringsImg from "@/assets/earrings.png";

const categories = [
  { name: "Brincos", image: earringsImg },
  { name: "Colares", image: earringsImg },
  { name: "Braceletes", image: earringsImg },
  { name: "Berloques", image: earringsImg },
];

export function CategoriesSection() {
  return (
    <section id="categorias" className="px-5 py-10">
      <div className="mb-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-tiffany uppercase">
          Busque por
        </span>
        <h2 className="mt-1 font-heading text-2xl font-bold text-title">
          Categorias
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href="#"
            className="group relative overflow-hidden rounded-xl"
          >
            <div className="aspect-square">
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
          </a>
        ))}
      </div>
    </section>
  );
}
