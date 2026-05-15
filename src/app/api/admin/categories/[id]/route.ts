import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Categoria não encontrada." },
      { status: 404 }
    );
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.image !== undefined && { image: body.image }),
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Categoria não encontrada." },
      { status: 404 }
    );
  }

  if (category._count.products > 0) {
    return NextResponse.json(
      { error: "Não é possível deletar categoria com produtos associados." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });

  return NextResponse.json({ success: true });
}
