'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CameraScannerMobile from './CameraScannerMobile';
import ImageScannerMobile from './ImageScannerMobile';
import QRResult from '../QRResult';
import { cn } from '../../../lib/utils';
import { useToast } from '../../../hooks/use-toast';

// Mobile-only wrapper that switches between Camera / Upload
// and renders a unified result panel.

// read #camera / #upload from URL hash
const hashToMode = (hash: string): Mode | null => {
  const h = hash.replace('#', '').toLowerCase();
  if (h === 'camera' || h === 'upload') return h as Mode;
  return null;
};

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

  // sync initial tab with URL hash and respond to hash changes
  useEffect(() => {
    const first = hashToMode(window.location.hash);
    if (first && first !== mode) setMode(first);

    const onHash = () => {
      const m = hashToMode(window.location.hash);
      if (m) {
        setValue(''); // switching via hash also clears last result
        setMode(m);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [mode]);

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
          onClick={() => {
            setValue('');
            setMode('camera');
            if (typeof window !== 'undefined') {
              history.replaceState(null, '', '#camera');
            }
          }}
          className={cn(
            'rounded border px-3 py-1 text-sm',
            mode === 'camera' ? 'bg-black text-white' : ''
          )}
        >
          Camera
        </button>
        <button
          type="button"
          onClick={() => {
            setValue('');
            setMode('upload');
            if (typeof window !== 'undefined') {
              history.replaceState(null, '', '#upload');
            }
          }}
          className={cn(
            'rounded border px-3 py-1 text-sm',
            mode === 'upload' ? 'bg-black text-white' : ''
          )}
        >
          Upload
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {mode === 'camera' ? 'Live scan with your camera' : 'Pick a photo from your gallery to decode'}
      </p>

      {/* Scanner area (hidden after we already have a result) */}
      {!value && (
        <div className="rounded-lg border p-3">
          {mode === 'camera' ? (
            <CameraScannerMobile action={handleDecoded} onError={handleError} />
          ) : (
            <ImageScannerMobile action={handleDecoded} onError={handleError} />
          )}
        </div>
      )}

      {/* Result Block (only when we have a value) */}
      {value && (
        <QRResult value={value} action={reset} />
      )}
    </div>
  );
}