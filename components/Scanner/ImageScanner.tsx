'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as qr from '@/lib/qr/decode';

// Minimal shims so TS doesn't complain when BarcodeDetector isn't present
declare const BarcodeDetector: any | undefined;

type ImageScannerProps = {
  onDecoded: (text: string) => void;
  onError?: (err: unknown) => void;
  className?: string;
};

// Helper: turn File → HTMLImageElement (fallback path when createImageBitmap is missing)
async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // Delay revoke to give the browser time to read
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export default function ImageScanner({ onDecoded, onError, className }: ImageScannerProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const decodeWithLib = async (source: any): Promise<string | undefined> => {
    // Try a few likely exported helpers from lib/qr/decode to最大程度兼容
    const anyQr = qr as any;
    if (anyQr) {
      if (typeof anyQr.decodeImageBitmap === 'function') return anyQr.decodeImageBitmap(source);
      if (typeof anyQr.decodeImage === 'function') return anyQr.decodeImage(source);
      if (typeof anyQr.decode === 'function') return anyQr.decode(source);
      if (typeof anyQr.decodeFromImage === 'function') return anyQr.decodeFromImage(source);
      if (typeof anyQr.decodeFromCanvas === 'function') return anyQr.decodeFromCanvas(source);
    }
    return undefined;
  };

  const decodeWithBarcodeDetector = async (source: any): Promise<string | undefined> => {
    try {
      if (typeof BarcodeDetector === 'undefined') return undefined;
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const results = await detector.detect(source as any);
      if (results && results.length > 0) {
        return results[0].rawValue as string;
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setLoading(true);
    try {
      // Prefer ImageBitmap when available
      let decoded: string | undefined;
      if ('createImageBitmap' in window) {
        const bitmap = await createImageBitmap(file);
        decoded = await decodeWithLib(bitmap);
        if (!decoded) decoded = await decodeWithBarcodeDetector(bitmap);
      } else {
        // Fallback: use HTMLImageElement (works on older Safari)
        const img = await fileToImage(file);
        decoded = await decodeWithLib(img);
        if (!decoded) decoded = await decodeWithBarcodeDetector(img);
      }

      if (!decoded) {
        throw new Error('No QR code found in the image.');
      }

      onDecoded(decoded); // ✅ 把结果抛给父组件，父组件切到 <QRResult/>
    } catch (e) {
      onError?.(e);
    } finally {
      setLoading(false);
      // 允许用户选择同一张图片再次上传
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [onDecoded, onError]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleFiles(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className={className}>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="rounded-lg border border-dashed p-8 text-center"
      >
        <p className="mb-4 text-sm text-muted-foreground">
          Drag & drop an image here, or click to select
        </p>

        <label className="inline-block cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"  // hint: mobile can open rear camera
            className="hidden"
            onChange={onInputChange}
          />
          <span className="rounded-md border px-4 py-2 text-sm">
            {loading ? 'Decoding…' : 'Choose File'}
          </span>
        </label>

        <p className="mt-3 text-xs text-muted-foreground">
          Supports JPG, PNG, WebP
        </p>
      </div>
    </div>
  );
}