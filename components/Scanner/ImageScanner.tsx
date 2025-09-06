'use client';

import React, { useCallback, useRef, useState } from 'react';
import * as qr from '@/lib/qr/decode';

// 一些库在老环境里可能没有类型
declare const BarcodeDetector: any | undefined;

type ImageScannerProps = {
  onDecoded: (text: string) => void;
  onError?: (err: unknown) => void;
  className?: string;
};

/** File -> HTMLImageElement（带 decode/onload 双保险，避免 iOS 上 decode 不可用） */
async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;

    // Safari 上有时没有 decode，用 onload 兜底
    if ('decode' in img) {
      try {
        // @ts-ignore
        await img.decode();
      } catch {
        await new Promise<void>((res, rej) => {
          const _img = img as HTMLImageElement;
          const cleanup = () => {
            _img.onload = null;
            _img.onerror = null;
          };
          _img.onload = () => {
            cleanup();
            res();
          };
          _img.onerror = () => {
            cleanup();
            rej(new Error('Image load failed'));
          };
        });
      }
    } else {
      await new Promise<void>((res, rej) => {
        const _img = img as HTMLImageElement;
        const cleanup = () => {
          _img.onload = null;
          _img.onerror = null;
        };
        _img.onload = () => {
          cleanup();
          res();
        };
        _img.onerror = () => {
          cleanup();
          rej(new Error('Image load failed'));
        };
      });
    }
    return img;
  } finally {
    // 让浏览器有时间读取，再释放 URL
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

/** 把图片画到 Canvas，兼容性最好（iOS/Android/桌面） */
async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = await fileToImage(file);
  const canvas = document.createElement('canvas');
  const w = (img as any).naturalWidth || img.width;
  const h = (img as any).naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/** 尝试调用你库里可能暴露的各种解码方法（哪个能用就用哪个） */
async function decodeWithLib(source: any): Promise<string | undefined> {
  const anyQr = qr as any;
  if (!anyQr) return undefined;
  if (typeof anyQr.decodeImageBitmap === 'function') return anyQr.decodeImageBitmap(source);
  if (typeof anyQr.decodeFromCanvas === 'function') return anyQr.decodeFromCanvas(source);
  if (typeof anyQr.decodeImage === 'function') return anyQr.decodeImage(source);
  if (typeof anyQr.decodeFromImage === 'function') return anyQr.decodeFromImage(source);
  if (typeof anyQr.decode === 'function') return anyQr.decode(source);
  return undefined;
}

/** 用原生 BarcodeDetector 兜底（部分 iOS/Android/桌面可用） */
async function decodeWithBarcodeDetector(source: any): Promise<string | undefined> {
  try {
    if (typeof BarcodeDetector === 'undefined') return undefined;
    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    const results = await detector.detect(source as any);
    if (results && results.length) return String(results[0].rawValue ?? '');
  } catch {
    /* ignore */
  }
  return undefined;
}

export default function ImageScanner({ onDecoded, onError, className }: ImageScannerProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setLoading(true);

      try {
        let decoded: string | undefined;

        // 1) 优先走 ImageBitmap（新浏览器快）
        if ('createImageBitmap' in window) {
          try {
            const bitmap = await createImageBitmap(file);
            decoded =
              (await decodeWithLib(bitmap)) ||
              (await decodeWithBarcodeDetector(bitmap));
          } catch {
            // iOS 等可能不支持，忽略错误，走 canvas 路径
          }
        }

        // 2) 再走 Canvas 路径（iOS/Android/桌面通吃、最稳）
        if (!decoded) {
          const canvas = await fileToCanvas(file);
          decoded =
            (await decodeWithLib(canvas)) ||
            (await decodeWithBarcodeDetector(canvas));
        }

        if (!decoded) throw new Error('No QR code found in the image.');

        onDecoded(decoded); // 交给父组件，父组件会切换到结果视图
      } catch (e) {
        onError?.(e);
      } finally {
        setLoading(false);
        // 允许再次选择相同文件
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onDecoded, onError]
  );

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
          Drag &amp; drop an image here, or click to select
        </p>

        {/* 用 label 触发隐藏 input，保持桌面/移动一致的 UI */}
        <label className="inline-block cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            // 关键：不再带 capture，避免移动端强制走拍照；相册/文件/拍照交给系统原生选择器
            className="hidden"
            onChange={onInputChange}
          />
          <span className="rounded-md border px-4 py-2 text-sm">
            {loading ? 'Decoding…' : 'Choose File'}
          </span>
        </label>

        <p className="mt-3 text-xs text-muted-foreground">Supports JPG, PNG, WebP</p>
      </div>
    </div>
  );
}