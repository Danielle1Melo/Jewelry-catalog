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

  // Delete removed images from Cloudinary
  await Promise.all(
    removedImages.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch(() => null)
    )
  );

  const product = await prisma.$transaction(async (tx) => {
    // Delete all existing images and recreate
    await tx.productImage.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price,
        description: body.description ?? "",
        sizeDetails: body.sizeDetails ?? "",
        isNew: body.isNew ?? false,
        categoryId: body.categoryId,
        images: {
          create: newImages.map((img) => ({
            url: img.url,
            publicId: img.publicId,
          })),
        },
      },
      include: { images: true, category: true },
    });
  });

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

  // Delete images from Cloudinary
  await Promise.all(
    product.images.map((img) =>
      cloudinary.uploader.destroy(img.publicId).catch(() => null)
    )
  );

  // Cascade deletes ProductImage records
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
