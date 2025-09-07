// lib/qr/decode.ts
// 统一的兜底解码：优先 BarcodeDetector，失败回退 jsQR（仅在客户端执行）
import jsQR from 'jsqr';

type DecodeSource = HTMLVideoElement | HTMLImageElement | ImageBitmap | ImageData | HTMLCanvasElement;

const detector =
  typeof window !== 'undefined' && 'BarcodeDetector' in window
    ? new (window as any).BarcodeDetector({ formats: ['qr_code'] })
    : null;

export async function decodeOnce(src: DecodeSource): Promise<string | null> {
  // 先试 BarcodeDetector（它可以直接喂 video / canvas / image）
  if (detector) {
    try {
      const codes = await detector.detect(src as any);
      if (codes && codes.length > 0) {
        const v = (codes[0] as any).rawValue || (codes[0] as any).rawValue?.toString?.();
        if (v) return v as string;
      }
    } catch {
      // ignore, fallback to jsQR
    }
  }

  // 回退：把任何来源画到 canvas，再用 jsQR
  const { canvas, ctx, w, h } = toCanvas(src);
  if (!w || !h) return null;

  // 为了性能，缩到 800px 边长以内
  const scale = Math.min(1, 800 / Math.max(w, h));
  let sw = Math.max(1, Math.floor(w * scale));
  let sh = Math.max(1, Math.floor(h * scale));
  if (scale !== 1) {
    const tmp = document.createElement('canvas');
    tmp.width = sw;
    tmp.height = sh;
    tmp.getContext('2d')!.drawImage(canvas, 0, 0, w, h, 0, 0, sw, sh);
    const data = tmp.getContext('2d')!.getImageData(0, 0, sw, sh);
    const code = jsQR(data.data, sw, sh, { inversionAttempts: 'dontInvert' });
    return code?.data ?? null;
  } else {
    const data = ctx.getImageData(0, 0, w, h);
    const code = jsQR(data.data, w, h, { inversionAttempts: 'dontInvert' });
    return code?.data ?? null;
  }
}

function toCanvas(src: DecodeSource) {
  if (src instanceof HTMLCanvasElement) {
    return { canvas: src, ctx: src.getContext('2d')!, w: src.width, h: src.height };
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0;

  if (src instanceof HTMLVideoElement) {
    w = src.videoWidth; h = src.videoHeight;
    if (!w || !h) return { canvas, ctx, w: 0, h: 0 };
    canvas.width = w; canvas.height = h;
    ctx.drawImage(src, 0, 0, w, h);
    return { canvas, ctx, w, h };
  }
  if (src instanceof ImageBitmap) {
    w = src.width; h = src.height;
    canvas.width = w; canvas.height = h;
    ctx.drawImage(src, 0, 0);
    return { canvas, ctx, w, h };
  }
  if (src instanceof ImageData) {
    w = src.width; h = src.height;
    canvas.width = w; canvas.height = h;
    ctx.putImageData(src, 0, 0);
    return { canvas, ctx, w, h };
  }
  if (src instanceof HTMLImageElement) {
    w = src.naturalWidth; h = src.naturalHeight;
    if (!w || !h) return { canvas, ctx, w: 0, h: 0 };
    canvas.width = w; canvas.height = h;
    ctx.drawImage(src, 0, 0);
    return { canvas, ctx, w, h };
  }
  return { canvas, ctx, w: 0, h: 0 };
}