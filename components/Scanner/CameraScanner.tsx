'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CameraScannerProps {
  onResult: (text: string) => void;
  isActive?: boolean;
}

export function CameraScanner({ onResult, isActive = false }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<any>(null);

  const [started, setStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
  }, []);

  // Stop camera when tab becomes inactive or component unmounts / isActive false
  useEffect(() => {
    if (!isActive) {
      stopCamera();
      setStarted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    // If user navigates away, stop
    const onVisibility = () => {
      if (document.hidden) {
        stopCamera();
        setStarted(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported in this browser.');
      return;
    }

    try {
      // Request environment-facing camera where available
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure playsInline + muted to allow autoplay
        videoRef.current.muted = true;
        await videoRef.current.play().catch((e) => {
          // play can be blocked until user gesture; ignore here
          console.warn('video.play() blocked', e);
        });
      }

      // Initialize BarcodeDetector if supported
      if ((window as any).BarcodeDetector) {
        try {
          detectorRef.current = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        } catch (_e) {
          detectorRef.current = null;
        }
      } else {
        detectorRef.current = null;
      }

      setStarted(true);
      scanLoop();
    } catch (err: any) {
      console.error('getUserMedia error', err);
      setError(err?.message || String(err));
      setStarted(false);
    }
  }

  function stopCamera() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        // @ts-ignore
        videoRef.current.srcObject = null;
      } catch (e) {
        // ignore
      }
    }
    setStarted(false);
  }

  async function scanLoop() {
    // Capture refs into local non-null vars to satisfy TypeScript across awaits
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const v = video as HTMLVideoElement;
    const c = canvas as HTMLCanvasElement;
    // 明确告诉 TypeScript 这里的 ctx 非空
    const ctx = c.getContext('2d')! as CanvasRenderingContext2D;
    if (!ctx) return;

    async function frame() {
      try {
        const w = v.videoWidth;
        const h = v.videoHeight;
        if (w && h) {
          c.width = w;
          c.height = h;
          ctx.drawImage(v, 0, 0, w, h);

          if (detectorRef.current) {
            try {
              // use the captured non-null canvas
              const bitmap = await createImageBitmap(c);
              const barcodes = await detectorRef.current.detect(bitmap);
              bitmap.close();
              if (barcodes && barcodes.length > 0) {
                const value = (barcodes[0] as any).rawValue || '';
                if (value) {
                  onResult(value);
                  stopCamera();
                  return;
                }
              }
            } catch (e) {
              console.error('BarcodeDetector detect error', e);
            }
          } else {
            // No native detector: we do not bundle jsQR by default.
            // If you want a JS fallback, install jsqr and decode here.
          }
        }
      } catch (e) {
        console.error('scanLoop error', e);
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    frame();
  }

  // Expose a console-friendly indicator to help debugging user-gesture issues
  useEffect(() => {
    if (isActive && !started) {
      // show UI to ask user to click start; do not auto-call startCamera to avoid autoplay block
      console.info('Camera tab active. Click "Start Camera" to enable camera (user gesture required in some browsers).');
    }
  }, [isActive, started]);

  return (
    <div className="space-y-3">
      <div className="relative rounded bg-black overflow-hidden" style={{ height: 360 }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                console.log('Start Camera clicked');
                startCamera();
              }}
              className="bg-white/90 text-gray-800 px-4 py-2 rounded-md shadow"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {started && (
          <button
            onClick={() => {
              stopCamera();
            }}
            className="px-3 py-1 bg-red-50 text-red-700 rounded"
          >
            Stop Camera
          </button>
        )}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!error && !started && <div className="text-sm text-gray-600">Click &quot;Start&quot; to begin</div>}
      </div>
    </div>
  );
}