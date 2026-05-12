"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Logo } from "../Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Cuidados", href: "/cuidados" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

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
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="relative text-title transition-colors hover:text-tiffany"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-tiffany text-[10px] font-bold text-white">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
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
