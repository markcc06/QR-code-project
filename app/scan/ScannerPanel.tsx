'use client';

import React, { useEffect, useState } from 'react';
import CameraScanner from '@/components/Scanner/CameraScanner';
import ImageScanner from '@/components/Scanner/ImageScanner';
import QRResult from '@/components/Scanner/QRResult';
import { useToast } from '@/hooks/use-toast';

export default function ScannerPanel() {
  const { toast } =
    // 没配 toast 也不报错
    (typeof window !== 'undefined' ? (require('@/hooks/use-toast') as any) : null)?.useToast?.() ??
    { toast: (m: any) => console.log(m) };

  const [tab, setTab] = useState<'camera' | 'upload'>('camera');
  const [value, setValue] = useState<string | null>(null);

  // ImageScanner 内部通过 window 派发错误事件，这里统一提示
  useEffect(() => {
    const handler = (e: Event) => {
      const msg = (e as CustomEvent<string>).detail || 'Failed to decode';
      toast({ variant: 'destructive', description: msg });
    };
    window.addEventListener('qr-scan-error', handler as EventListener);
    return () => window.removeEventListener('qr-scan-error', handler as EventListener);
  }, [toast]);

  const handleDecoded = (text: string) => {
    setValue(text);
  };

  const reset = () => setValue(null);

  return (
    <div className="mx-auto max-w-5xl px-4">
      {!value ? (
        <>
          {/* 切换按钮 */}
          <div className="mb-3 flex gap-3">
            <button
              onClick={() => setTab('camera')}
              className={`rounded border px-3 py-1 ${tab === 'camera' ? 'bg-black text-white' : ''}`}
            >
              Camera
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`rounded border px-3 py-1 ${tab === 'upload' ? 'bg-black text-white' : ''}`}
            >
              Upload
            </button>
          </div>

          {/* 主体 */}
          {tab === 'camera' ? (
            <CameraScanner action={handleDecoded} />
          ) : (
            <ImageScanner action={handleDecoded} />
          )}
        </>
      ) : (
        <QRResult value={value} action={reset} />
      )}
    </div>
  );
}