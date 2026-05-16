"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Tag, Gift, ShoppingBag, Check, Loader2 } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMERO } from "@/lib/constants";

interface ProductImage {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sizeDetails: string;
  isNew: boolean;
  soldOut: boolean;
  category: { id: string; name: string };
  images: ProductImage[];
}

export default function ProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSelectedImage(0);

    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        fetch(`/api/products?category=${encodeURIComponent(data.category.name)}`)
          .then((res) => res.json())
          .then((products: Product[]) => {
            setRelated(products.filter((p) => p.id !== productId).slice(0, 4));
          })
          .catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex flex-1 justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-tiffany" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <div className="flex-1 px-5 py-16 text-center">
          <p className="text-description">Produto não encontrado.</p>
          <Link
            href="/catalogo"
            className="mt-4 inline-flex text-sm font-medium text-tiffany hover:text-tiffany-dark"
          >
            Voltar ao catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre o produto: ${product.name} (R$ ${product.price})`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${whatsappMsg}`;

  const details = product.sizeDetails
    ? product.sizeDetails.split(",").map((d) => d.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 px-5 py-6">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-description transition-colors hover:text-tiffany"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="md:grid md:grid-cols-2 md:gap-10">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                {product.images[selectedImage] && (
                  <Image
                    src={product.images[selectedImage].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
                {product.soldOut ? (
                  <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Esgotado
                  </span>
                ) : product.isNew ? (
                  <span className="absolute left-3 top-3 rounded-full bg-tiffany px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Novo
                  </span>
                ) : null}
              </div>

              {product.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === selectedImage
                          ? "border-tiffany"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`${product.name} - imagem ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 md:mt-0">
              <span className="text-sm font-medium text-tiffany">
                {product.category.name}
              </span>
              <h1 className="mt-1 font-heading text-2xl font-bold text-title">
                {product.name}
              </h1>
              <p className="mt-2 text-2xl font-bold text-tiffany">
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-description">
                {product.description}
              </p>

              {details.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {details.map((detail, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-title"
                    >
                      {i === details.length - 1 ? (
                        <Gift className="h-4 w-4 text-tiffany" />
                      ) : (
                        <Tag className="h-4 w-4 text-tiffany" />
                      )}
                      {detail}
                    </span>
                  ))}
                </div>
              )}

              {product.soldOut ? (
                <div className="mt-6 rounded-full bg-gray-100 py-3.5 text-center text-sm font-semibold text-gray-400">
                  Produto esgotado
                </div>
              ) : (
                <div className="mt-6 flex gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-tiffany py-3.5 text-sm font-semibold text-white transition-colors hover:bg-tiffany-dark"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Gostei
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images[0]?.url ?? "",
                      });
                      setAdded(true);
                      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
                      addedTimerRef.current = setTimeout(() => setAdded(false), 2000);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full border-2 py-3.5 text-sm font-semibold transition-colors ${
                      added
                        ? "border-tiffany bg-tiffany text-white"
                        : "border-tiffany bg-white text-tiffany hover:bg-tiffany-light"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-5 w-5" />
                        Adicionado!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        Adicionar ao carrinho
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 font-heading text-xl font-bold text-title">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {related.map((p) => (
                  <Link key={p.id} href={`/produto/${p.id}`} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                      {p.images[0] && (
                        <Image
                          src={p.images[0].url}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {p.soldOut ? (
                        <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Esgotado
                        </span>
                      ) : p.isNew ? (
                        <span className="absolute left-2 top-2 rounded-full bg-tiffany px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Novo
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2">
                      <p className="truncate text-sm font-medium text-title">
                        {p.name}
                      </p>
                      <p className="text-sm font-semibold text-tiffany">
                        {p.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
