import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter(
      (entry): entry is File => entry instanceof File
    );

    if (!files.length) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Tipo de arquivo não suportado: ${file.type}` },
          { status: 400 }
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Arquivo muito grande: ${file.name} (max 5MB)` },
          { status: 400 }
        );
      }
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<{ url: string; publicId: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "dm-pratas/products",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  url: result!.secure_url,
                  publicId: result!.public_id,
                });
            }
          );
          uploadStream.end(buffer);
        }
      );
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({ images: results });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload das imagens" },
      { status: 500 }
    );
  }
}
