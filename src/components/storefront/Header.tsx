"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Logo } from "../Logo";

const NAV_LINKS = [
  { label: "Brincos", href: "#categorias" },
  { label: "Colares", href: "#categorias" },
  { label: "Braceletes", href: "#categorias" },
  { label: "Berloques", href: "#categorias" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="text-lg font-bold tracking-wide text-title">
            DM PRATAS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Buscar"
            className="text-title transition-colors hover:text-tiffany"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-title transition-colors hover:text-tiffany"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-5 pb-4 pt-2">
          <ul className="space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium text-title transition-colors hover:text-tiffany"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
