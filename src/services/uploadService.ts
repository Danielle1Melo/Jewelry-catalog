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
    let message = `Upload failed (${res.status} ${res.statusText})`;
    try {
      const errorData = await res.json();
      if (errorData.error) message = errorData.error;
    } catch {
      const text = await res.text();
      if (text) message = `${message}: ${text}`;
    }
    throw new Error(message);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.images)) {
    throw new Error("Resposta inesperada do servidor");
  }
  return data.images;
}
