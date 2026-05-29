import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const isNew = searchParams.get("new");
  const size = searchParams.get("size");

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category: { name: category } }),
      ...(isNew === "true" && { isNew: true }),
      ...(size && { sizes: { has: size } }),
    },
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
