
'use client';

// TS shim for optional BarcodeDetector on Window
declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/hooks/use-toast'; // 用你现成的 toast（非必须，也可换成 console）
// 如果你的路径不同，把上面这行路径改成实际路径

type Props = {
  onDecoded: (text: string) => void;
  onError?: (msg: string) => void;
  className?: string;
};

export default function CameraScanner({ onDecoded, onError, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [usingBarcodeDetector, setUsingBarcodeDetector] = useState(false);

  // 清理
  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // 调起摄像头（优先后置）
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: 'environment' },
            // 限制分辨率，降低功耗 + 提升解码速度
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        const video = videoRef.current!;
        video.srcObject = stream;

        // iOS Safari 必须要 inline + 静音自动播放
        video.playsInline = true;
        video.setAttribute('playsinline', 'true'); // iOS Safari inline playback
        video.muted = true;

        await video.play();
        setReady(true);

        // BarcodeDetector 可用？（部分浏览器支持）
        const BD = (window as any).BarcodeDetector as any | undefined;
        let detector: any = null;

        if (BD && (await BD.getSupportedFormats()).includes('qr_code')) {
          detector = new BD({ formats: ['qr_code'] });
          setUsingBarcodeDetector(true);
        } else {
          // 动态加载 jsQR 作为兜底
          setUsingBarcodeDetector(false);
        }

        const tick = async () => {
          const v = videoRef.current!;
          const c = canvasRef.current!;
          if (!v || !c) return;

          // 同步尺寸
          if (v.videoWidth && v.videoHeight) {
            c.width = v.videoWidth;
            c.height = v.videoHeight;
          }

          const ctx = c.getContext('2d', { willReadFrequently: true });
          if (ctx && c.width && c.height) {
            ctx.drawImage(v, 0, 0, c.width, c.height);

            try {
              if (detector) {
                // BarcodeDetector 路径
                const barcodes = await detector.detect(c);
                if (barcodes?.length) {
                  const raw = barcodes[0].rawValue || '';
                  if (raw) {
                    onDecoded(raw);
                    return; // 命中一次就结束扫描
                  }
                }
              } else {
                // jsQR 路径
                const { default: jsQR } = await import('jsqr'); // 懒加载
                const imageData = ctx.getImageData(0, 0, c.width, c.height);
                const result = jsQR(imageData.data, c.width, c.height, {
                  inversionAttempts: 'dontInvert',
                });
                if (result?.data) {
                  onDecoded(result.data);
                  return;
                }
              }
            } catch (err: any) {
              onError?.(err?.message || 'Decode error');
            }
          }

          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch (err: any) {
        const msg =
          err?.name === 'NotAllowedError'
            ? '相机权限被拒绝，请在浏览器设置中允许访问摄像头。'
            : '无法打开摄像头：' + (err?.message || '');
        onError?.(msg);
        try { toast({ title: 'Camera Error', description: msg }); } catch {}
      }
    })();

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <div className="relative w-full overflow-hidden rounded-xl">
        <video
          ref={videoRef}
          className="block w-full h-auto"
          // 低端机更稳
          preload="metadata"
          // @ts-ignore
          playsInline
        />
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            正在启动相机…
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <p className="mt-2 text-xs text-muted-foreground">
        {usingBarcodeDetector ? 'Using BarcodeDetector' : 'Using jsQR fallback'}
      </p>
    </div>
  );
}