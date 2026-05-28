import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductDetail from "./ProductDetail";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produto não encontrado | DM Pratas" };
  }

  const price = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const title = `${product.name} | DM Pratas`;
  const description = product.description || `${product.name} - ${price}`;
  const image = product.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: [{ url: image, width: 800, height: 800, alt: product.name }],
      }),
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
