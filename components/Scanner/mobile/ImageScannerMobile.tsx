'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useRef, useState } from 'react';
import type { ImageScannerMobileProps } from '../../../types/scan';

/**
 * ImageScannerMobile
 * - 移动端上传/拍照识别二维码；不影响桌面端逻辑。
 * - 使用 `<input accept="image/*" capture="environment">` 允许直接拍照。
 * - 解码优先走 Canvas + jsQR（懒加载），失败给出友好错误。
 */
export default function ImageScannerMobile({ action, onError, className }: ImageScannerMobileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const emitError = React.useCallback((msg: string) => {
    try { onError?.(msg); } catch {}
    // eslint-disable-next-line no-console
    console.error('[ImageScannerMobile]', msg);
  }, [onError]);

  const pick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const revokePreview = React.useCallback(() => {
    if (previewUrl) {
      try { URL.revokeObjectURL(previewUrl); } catch {}
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleFiles = useCallback(async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      // 预览（可选）
      revokePreview();
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const text = await decodeFileToQrText(file, canvasRef.current!);
      if (text) {
        action?.(text);
      } else {
        throw new Error('没有在图片中识别到二维码，请更换更清晰的图片或拉远对焦。');
      }
    } catch (e: any) {
      emitError(e?.message || '识别失败');
    } finally {
      setBusy(false);
    }
  }, [action, emitError, revokePreview]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleFiles(file);
    // 重置 input 以便选择同一文件也能再次触发
    e.currentTarget.value = '';
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        <button
          type="button"
          onClick={pick}
          disabled={busy}
          className="w-full rounded-md border px-4 py-2 text-sm"
        >
          {busy ? '正在识别…' : '拍照/选择图片 识别二维码'}
        </button>

        {previewUrl && (
          <div className="overflow-hidden rounded-md border">
            {/* 仅作预览，不参与解码 */}
            <img src={previewUrl} alt="preview" className="block w-full h-auto" />
          </div>
        )}
      </div>

      {/* 隐藏画布：用于解码 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 隐藏文件选择器：允许直接拍照 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}

/** 将图片文件解码成二维码文本（返回 null 表示未识别到） */
async function decodeFileToQrText(file: File, canvas: HTMLCanvasElement): Promise<string | null> {
  // 尝试使用 createImageBitmap 加速
  let bitmap: ImageBitmap | null = null;
  try {
    // 一些浏览器不支持 HEIC 的解码；若失败会抛错，下面会用 <img> 兜底
    bitmap = await createImageBitmap(file);
  } catch {
    // 退回到 Image
  }

  if (!bitmap) {
    const dataUrl = await readFileAsDataURL(file);
    const img = await loadImage(dataUrl);
    return drawAndDecode(img, canvas);
  } else {
    const res = await drawAndDecode(bitmap, canvas);
    bitmap.close?.();
    return res;
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('图片读取失败'));
    fr.onload = () => resolve(String(fr.result));
    fr.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}

async function drawAndDecode(image: { width: number; height: number }, canvas: HTMLCanvasElement): Promise<string | null> {
  // 将图片按最大边 1600px 等比缩放，提速 + 降内存
  const maxSide = 1600;
  const ratio = Math.min(1, maxSide / Math.max(image.width, image.height));
  const w = Math.max(1, Math.round(image.width * ratio));
  const h = Math.max(1, Math.round(image.height * ratio));

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  // @ts-ignore - createImageBitmap/HTMLImageElement 都能被 drawImage
  ctx.drawImage(image as any, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const { default: jsQR } = await import('jsqr');
  const result = jsQR(imgData.data, imgData.width, imgData.height, {
    inversionAttempts: 'dontInvert',
  });

  return result?.data || null;
}