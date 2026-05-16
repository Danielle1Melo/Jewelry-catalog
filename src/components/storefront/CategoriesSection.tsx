"use client";

import { useEffect, useState } from "react";

interface CategoriesSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function CategoriesSection({ activeTab, onTabChange }: CategoriesSectionProps) {
  const [tabs, setTabs] = useState<string[]>(["Todos"]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categories: { id: string; name: string }[]) => {
        setTabs(["Todos", ...categories.map((c) => c.name)]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="px-5 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold tracking-widest text-tiffany uppercase">
            Busque por
          </span>
          <h2 className="mt-1 font-heading text-2xl font-bold text-title">
            Categorias
          </h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-white to-transparent" />
          <div className="flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
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
      </div>
    </section>
  );
}
