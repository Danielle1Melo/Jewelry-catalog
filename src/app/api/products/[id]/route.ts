import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, category: true },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Produto não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
