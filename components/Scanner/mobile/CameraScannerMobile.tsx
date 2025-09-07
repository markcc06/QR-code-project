'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import type { CameraScannerMobileProps } from '../../../types/scan';

const hasBarcodeDetector =
  typeof window !== 'undefined' && typeof (window as any).BarcodeDetector !== 'undefined';

export default function CameraScannerMobile({
  autoStart = true,
  className,
  action,
  onDecoded,
  onError,
  preferBackCamera = true,
  isActive = true,
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
      const constraints: MediaStreamConstraints = {
        video: preferBackCamera
          ? { facingMode: { ideal: 'environment' } }
          : { facingMode: { ideal: 'user' } },
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
  }, [decodeLoop, onError, starting, stop, preferBackCamera]);

  useEffect(() => {
    if (autoStart && isActive) {
      start();
    } else if (!isActive) {
      stop();
    }
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, isActive]);

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