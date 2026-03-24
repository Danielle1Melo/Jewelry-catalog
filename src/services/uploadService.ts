export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro no upload");
  }

  const data = await res.json();
  return data.images;
}
