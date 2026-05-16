import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.price || !body?.categoryId) {
    return NextResponse.json(
      { error: "Campos obrigatórios: name, price, categoryId." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description ?? "",
      sizeDetails: body.sizeDetails ?? "",
      isNew: body.isNew ?? false,
      soldOut: body.soldOut ?? false,
      categoryId: body.categoryId,
      images: {
        create: (body.images ?? []).map(
          (img: { url: string; publicId: string }) => ({
            url: img.url,
            publicId: img.publicId,
          })
        ),
      },
    },
    include: { images: true, category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
