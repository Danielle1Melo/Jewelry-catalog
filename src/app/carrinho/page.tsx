"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMERO } from "@/lib/constants";

export default function CarrinhoPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  const whatsappMsg = encodeURIComponent(
    `Olá! Gostaria de comprar as seguintes peças:\n\n` +
      items
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} — ${item.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })} (x${item.quantity})`
        )
        .join("\n") +
      `\n\nTotal: ${totalPrice.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${whatsappMsg}`;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 px-5 py-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/catalogo"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-description transition-colors hover:text-tiffany"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>

          <h1 className="font-heading text-2xl font-bold text-title">
            Meu Carrinho
          </h1>
          <p className="mt-1 text-sm text-description">
            {totalItems === 0
              ? "Nenhum item no carrinho"
              : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </p>

          {items.length === 0 ? (
            <div className="mt-12 text-center">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-200" />
              <p className="mt-4 text-description">
                Seu carrinho está vazio.
              </p>
              <Link
                href="/catalogo"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-tiffany transition-colors hover:text-tiffany-dark"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-6 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-4">
                    <Link
                      href={`/produto/${item.id}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/produto/${item.id}`}
                          className="text-sm font-medium text-title hover:text-tiffany"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold text-tiffany">
                          {item.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Diminuir quantidade"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-description transition-colors hover:border-tiffany hover:text-tiffany"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-title">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Aumentar quantidade"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-description transition-colors hover:border-tiffany hover:text-tiffany"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="Remover item"
                          onClick={() => removeItem(item.id)}
                          className="text-description transition-colors hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-description">Total</span>
                  <span className="text-xl font-bold text-title">
                    {totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-tiffany py-3.5 text-sm font-semibold text-white transition-colors hover:bg-tiffany-dark"
                >
                  <MessageCircle className="h-5 w-5" />
                  Comprar pelo WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
