'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export type CameraScannerMobileProps = {
  /** 进入时是否自动启动相机（默认 true） */
  autoStart?: boolean;
  className?: string;
  /** 解码成功回调（与桌面端统一命名） */
  action?: (text: string) => void;
  /** 兼容旧版命名（如外层仍在用 onDecoded） */
  onDecoded?: (text: string) => void;
  /** 错误回调（可选） */
  onError?: (msg: string) => void;
};

const hasBarcodeDetector =
  typeof window !== 'undefined' && typeof (window as any).BarcodeDetector !== 'undefined';

export default function CameraScannerMobile({
  autoStart = true,
  className,
  action,
  onDecoded,
  onError,
}: CameraScannerMobileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [starting, setStarting] = useState(false);

  const stop = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const decodeLoop = useCallback(async () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const tick = async () => {
      if (!videoRef.current) return;

      const W = (canvas.width = video.videoWidth || 640);
      const H = (canvas.height = video.videoHeight || 480);

      try {
        ctx.drawImage(video, 0, 0, W, H);

        if (hasBarcodeDetector) {
          const Detector = (window as any).BarcodeDetector;
          const detector = new Detector({ formats: ['qr_code'] });
          const bits = await detector.detect(canvas);
          if (bits?.length) {
            const raw = bits[0].rawValue || bits[0].raw || '';
            if (raw) {
              (action ?? onDecoded)?.(raw);
              // 成功后停止摄像头，等待用户“再次扫描”再重启
              stop();
              return;
            }
          }
        } else {
          const imageData = ctx.getImageData(0, 0, W, H);
          const code = jsQR(imageData.data, W, H, { inversionAttempts: 'dontInvert' });
          if (code?.data) {
            (action ?? onDecoded)?.(code.data);
            stop();
            return;
          }
        }
      } catch (e) {
        // 解码失败不抛错，继续下一帧
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  }, [action, onDecoded, stop]);

  const start = useCallback(async () => {
    if (starting || streamRef.current) return;
    setStarting(true);

    try {
      const isMobile =
        typeof navigator !== 'undefined' &&
        /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent || '');

      const constraints: MediaStreamConstraints = {
        video: isMobile
          ? { facingMode: { ideal: 'environment' } }
          : { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;
      (video as any).playsInline = true; // iOS Safari
      video.muted = true;
      await video.play();

      await decodeLoop();
    } catch (e) {
      onError?.(
        e instanceof Error ? e.message : 'Failed to start camera, please try again.'
      );
      stop();
    } finally {
      setStarting(false);
    }
  }, [decodeLoop, onError, starting, stop]);

  useEffect(() => {
    if (autoStart) start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className={className}>
      <div className="rounded-lg overflow-hidden border bg-black/60 aspect-video max-w-4xl">
        <video ref={videoRef} className="w-full h-full object-contain" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {hasBarcodeDetector ? 'Using BarcodeDetector' : 'Using jsQR fallback'}
        {starting ? ' · starting…' : ''}
      </div>
    </div>
  );
}