'use client';

import React, { useState, useCallback } from 'react';
import CameraScannerMobile from './CameraScannerMobile';
import ImageScannerMobile from './ImageScannerMobile';
import QRResult from '../QRResult';
import { cn } from '../../../lib/utils';
import { useToast } from '../../../hooks/use-toast';

// Mobile-only wrapper that switches between Camera / Upload
// and renders a unified result panel.
export type Mode = 'camera' | 'upload';

export interface ScannerPanelMobileProps {
  defaultMode?: Mode;             // default tab (camera)
  className?: string;             // optional container class
}

export default function ScannerPanelMobile({
  defaultMode = 'camera',
  className,
}: ScannerPanelMobileProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [value, setValue] = useState<string>('');

  const handleDecoded = useCallback((text: string) => {
    setValue(text);
  }, []);

  const handleError = useCallback((msg: string) => {
    toast({ title: 'Scan error', description: msg, variant: 'destructive' });
  }, [toast]);

  const reset = useCallback(() => setValue(''), []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('camera')}
          className={cn(
            'rounded border px-3 py-1 text-sm',
            mode === 'camera' ? 'bg-black text-white' : ''
          )}
        >
          Camera
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'rounded border px-3 py-1 text-sm',
            mode === 'upload' ? 'bg-black text-white' : ''
          )}
        >
          Upload
        </button>
      </div>

      {/* Scanner area */}
      <div className="rounded-lg border p-3">
        {mode === 'camera' ? (
          <CameraScannerMobile action={handleDecoded} onError={handleError} />
        ) : (
          <ImageScannerMobile action={handleDecoded} onError={handleError} />
        )}
      </div>

      {/* Result Block (only when we have a value) */}
      {value && (
        <QRResult value={value} action={reset} />
      )}
    </div>
  );
}