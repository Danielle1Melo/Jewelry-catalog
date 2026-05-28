import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  if (!body.name || body.price == null || !body.categoryId) {
    return NextResponse.json(
      { error: "Campos obrigatórios: name, price, categoryId." },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Produto não encontrado." },
      { status: 404 }
    );
  }

  // Find images that were removed
  const newImages: { url: string; publicId: string }[] = body.images ?? [];
  const newPublicIds = new Set(newImages.map((img) => img.publicId));
  const removedImages = existing.images.filter(
    (img) => !newPublicIds.has(img.publicId)
  );

  const product = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description ?? "",
        sizeDetails: body.sizeDetails ?? "",
        isNew: body.isNew ?? false,
        soldOut: body.soldOut ?? false,
        sizes: body.sizes ?? [],
        categoryId: body.categoryId,
        images: {
          create: newImages.map((img, index) => ({
            url: img.url,
            publicId: img.publicId,
            order: index,
          })),
        },
      },
      include: { images: true, category: true },
    });
  });

  // Delete removed images from Cloudinary only after DB success
  await Promise.all(
    removedImages.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch(() => null)
    )
  );

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Produto não encontrado." },
      { status: 404 }
    );
  }

  // Cascade deletes ProductImage records
  await prisma.product.delete({ where: { id } });

  // Delete images from Cloudinary only after DB success
  await Promise.all(
    product.images.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch(() => null)
    )
  );

  return NextResponse.json({ success: true });
}
