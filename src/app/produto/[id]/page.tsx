"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Tag, Gift, ShoppingBag, Check } from "lucide-react";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { useCart } from "@/context/CartContext";
import earringsImg from "@/assets/earrings.png";

import type { StaticImageData } from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  details: string[];
  isNew: boolean;
  images: StaticImageData[];
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "Colar Lua Crescente",
    price: 89,
    category: "Colares",
    description:
      "Um colar delicado com pingente de lua crescente em prata 925. Perfeito para o uso diário, trazendo elegância e sofisticação ao seu visual.",
    details: ["45cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg, earringsImg],
  },
  {
    id: 2,
    name: "Brincos Aria Drop",
    price: 65,
    category: "Brincos",
    description:
      "Brincos pendentes com design moderno e acabamento polido em prata 925. Leves e confortáveis para uso prolongado.",
    details: ["3cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg],
  },
  {
    id: 3,
    name: "Pulseira Serpente",
    price: 120,
    category: "Braceletes",
    description:
      "Pulseira com design de serpente em prata 925 com acabamento oxidado. Uma peça marcante que combina ousadia e elegância.",
    details: ["18cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg],
  },
  {
    id: 4,
    name: "Amuleto Estrela Celeste",
    price: 45,
    category: "Berloques",
    description:
      "Berloque em formato de estrela com detalhes em zircônia. Compatível com pulseiras de berloque padrão.",
    details: ["1.5cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
  {
    id: 5,
    name: "Brinco Ponto de Luz",
    price: 48,
    category: "Brincos",
    description:
      "Brinco solitário com zircônia cravejada em prata 925. Discreto e brilhante, ideal para qualquer ocasião.",
    details: ["0.5cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg],
  },
  {
    id: 6,
    name: "Colar de Pérolas",
    price: 135,
    category: "Colares",
    description:
      "Colar com pérolas de água doce e corrente em prata 925. Uma peça clássica e atemporal que eleva qualquer produção.",
    details: ["50cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
  {
    id: 7,
    name: "Pulseira Trançada",
    price: 95,
    category: "Braceletes",
    description:
      "Pulseira trançada em prata 925 com fecho de segurança. Design artesanal que combina tradição e modernidade.",
    details: ["19cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
  {
    id: 8,
    name: "Berloque Coração",
    price: 55,
    category: "Berloques",
    description:
      "Berloque em formato de coração com acabamento polido em prata 925. Presente perfeito para quem você ama.",
    details: ["1.2cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
  {
    id: 9,
    name: "Colar Cascata",
    price: 155,
    category: "Colares",
    description:
      "Um colar deslumbrante de várias camadas, com três correntes delicadas de comprimentos diferentes, cada uma adornada com pingentes de prata exclusivos. Esta peça marcante elimina a necessidade de usar vários colares em camadas.",
    details: ["60cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg, earringsImg],
  },
  {
    id: 10,
    name: "Brinco Argola Infinito",
    price: 78,
    category: "Brincos",
    description:
      "Brinco de argola com detalhe de símbolo do infinito em prata 925. Elegante e versátil para o dia a dia.",
    details: ["2.5cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
  {
    id: 11,
    name: "Pulseira Ondas",
    price: 110,
    category: "Braceletes",
    description:
      "Pulseira com design de ondas em prata 925. Inspirada no mar, traz movimento e leveza ao seu pulso.",
    details: ["18cm", "Prata 925", "Caixa de presente incluída"],
    isNew: true,
    images: [earringsImg, earringsImg],
  },
  {
    id: 12,
    name: "Berloque Borboleta",
    price: 42,
    category: "Berloques",
    description:
      "Berloque delicado em formato de borboleta com detalhes em zircônia. Simboliza transformação e liberdade.",
    details: ["1.3cm", "Prata 925", "Caixa de presente incluída"],
    isNew: false,
    images: [earringsImg, earringsImg],
  },
];

import { WHATSAPP_NUMERO } from "@/lib/constants";

export default function ProdutoPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = allProducts.find((p) => p.id === productId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const { addItem } = useCart();

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="px-5 py-16 text-center">
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

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-5 py-6">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/catalogo"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-description transition-colors hover:text-tiffany"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="md:grid md:grid-cols-2 md:gap-10">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-tiffany px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Novo
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === selectedImage
                          ? "border-tiffany"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={img}
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
                {product.category}
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

              <div className="mt-5 flex flex-wrap gap-2">
                {product.details.map((detail, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm text-title"
                  >
                    {i === product.details.length - 1 ? (
                      <Gift className="h-4 w-4 text-tiffany" />
                    ) : (
                      <Tag className="h-4 w-4 text-tiffany" />
                    )}
                    {detail}
                  </span>
                ))}
              </div>

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
                      image: product.images[0],
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
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {p.isNew && (
                        <span className="absolute left-2 top-2 rounded-full bg-tiffany px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Novo
                        </span>
                      )}
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
