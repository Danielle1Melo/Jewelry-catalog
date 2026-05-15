import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body?.name?.trim()) {
    return NextResponse.json(
      { error: "Nome da categoria é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.create({
      data: { name: body.name.trim() },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Categoria já existe." },
        { status: 409 }
      );
    }
    throw error;
  }
}
