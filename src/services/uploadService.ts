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
    const raw = await res.text();
    if (raw) {
      try {
        const errorData = JSON.parse(raw) as { error?: string };
        if (errorData.error) message = errorData.error;
      } catch {
        message = `${message}: ${raw}`;
      }
    }
    throw new Error(message);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.images)) {
    throw new Error("Resposta inesperada do servidor");
  }
  return data.images;
}
