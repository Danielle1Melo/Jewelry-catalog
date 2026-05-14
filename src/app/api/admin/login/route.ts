import { NextResponse } from "next/server";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.password) {
    return NextResponse.json({ error: "Senha é obrigatória." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword?.trim()) {
    return NextResponse.json(
      { error: "Servidor não configurado." },
      { status: 500 }
    );
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const token = await createToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
