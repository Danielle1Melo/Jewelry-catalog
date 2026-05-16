"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { getCroppedImageBlob, type PixelCrop } from "@/lib/cropImage";

interface ImageCropDialogProps {
  imageSrc: string | null;
  onCropComplete: (croppedBlob: Blob) => void;
  onClose: () => void;
}

export function ImageCropDialog({
  imageSrc,
  onCropComplete,
  onClose,
}: ImageCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onCropComplete(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog
      open={!!imageSrc}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogTitle>Ajustar Imagem</DialogTitle>
        <DialogDescription>
          Arraste para reposicionar. Use o zoom para ajustar.
        </DialogDescription>

        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-3 px-1">
          <span className="text-xs text-description">-</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-tiffany"
          />
          <span className="text-xs text-description">+</span>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 justify-center border border-gray-200"
            onClick={onClose}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1 justify-center"
            onClick={handleConfirm}
            disabled={processing}
          >
            {processing ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
