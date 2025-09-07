'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { decodeOnce } from '@/lib/qr/decode';

/**
 * Client-only camera scanner component.
 *
 * NOTE on props for Next.js App Router:
 *  - To satisfy "serializable props" check for client entry files, we keep
 *    callback props typed as `unknown` at the boundary, and then narrow them
 *    at runtime and store into refs. This avoids the yellow warnings while
 *    keeping a stable render tree.
 *  - We also support a legacy `action` prop for backward compatibility with
 *    existing callers (it behaves the same as `onDecoded`).
 */

type Props = {
  onDecoded?: unknown;          // (text: string) => void
  action?: unknown;             // legacy alias for onDecoded
  onError?: unknown;            // (msg: string) => void
  className?: string;
};

export default function CameraScanner({ onDecoded, action, onError, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [usingBD, setUsingBD] = useState<boolean>(false);

  // Hold callbacks in refs to avoid re-renders and satisfy Next.js prop constraints
  const onDecodedRef = useRef<((text: string) => void) | null>(null);
  const onErrorRef = useRef<((msg: string) => void) | null>(null);

  useEffect(() => {
    // prefer new onDecoded, fall back to legacy action
    const decodedCb = typeof onDecoded === 'function' ? (onDecoded as (t: string) => void)
                    : typeof action === 'function' ? (action as (t: string) => void)
                    : null;
    onDecodedRef.current = decodedCb;
    onErrorRef.current = typeof onError === 'function' ? (onError as (m: string) => void) : null;
  }, [onDecoded, action, onError]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const v = videoRef.current;
    const stream = v?.srcObject as MediaStream | null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (v) {
      try { v.pause(); } catch {}
      v.srcObject = null;
    }
    setRunning(false);
  }, []);

  // Start camera and run a decode loop via requestAnimationFrame
  const start = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera is not supported in this browser.');
      }
      // iOS/Android try rear camera; desktop use user/front
      const isMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? { ideal: 'environment' } : { ideal: 'user' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      const v = videoRef.current!;
      v.srcObject = stream;
      v.muted = true;
      (v as any).playsInline = true; // iOS safari
      await v.play();

      setRunning(true);
      setUsingBD('BarcodeDetector' in window);

      const loop = async () => {
        if (!v.videoWidth || !v.videoHeight) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        try {
          const text = await decodeOnce(v);
          if (text) {
            stop();
            onDecodedRef.current?.(text);
            return;
          }
        } catch (err: any) {
          // Non-fatal; continue scanning
          if (onErrorRef.current) onErrorRef.current(err?.message || 'Decode failed');
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e: any) {
      onErrorRef.current?.(e?.message || 'Failed to start camera');
      setRunning(false);
    }
  }, [stop]);

  // When component unmounts, ensure camera is closed
  useEffect(() => stop, [stop]);

  // Try to auto-start on first mount; if blocked by autoplay policy,
  // user can click the button to start.
  useEffect(() => {
    start().catch(() => {});
  }, [start]);

  return (
    <div className={['space-y-2', className].filter(Boolean).join(' ')}>
      <div className="rounded-lg overflow-hidden bg-black/80">
        <video ref={videoRef} className="w-full h-auto block" />
      </div>

      <div className="text-xs text-muted-foreground">
        {usingBD ? 'Using BarcodeDetector · ' : 'Using jsQR fallback · '}
        {running ? '' : 'Click “Start camera” if the browser blocked autoplay.'}
      </div>

      {!running && (
        <button
          onClick={start}
          className="inline-flex items-center rounded-md bg-black text-white px-3 py-2 text-sm"
        >
          Start camera
        </button>
      )}
      {running && (
        <button
          onClick={stop}
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
        >
          Stop
        </button>
      )}
    </div>
  );
}