'use client';

import React, { useCallback, useRef, useState } from 'react';
import { decodeOnce } from '@/lib/qr/decode';

export type ImageScannerProps = {
  /** success callback; kept as `action` to avoid Next 15 client-entry warnings */
  action?: (text: string) => void;
  className?: string;
};

export default function ImageScanner({ action, className }: ImageScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const emitError = (message: string) => {
    try {
      window.dispatchEvent(
        new CustomEvent('qr-scan-error', {
          detail: { from: 'ImageScanner', message },
        })
      );
    } catch {}
    // eslint-disable-next-line no-console
    console.error(message);
  };

  const emitInfo = (message: string) => {
    try {
      window.dispatchEvent(
        new CustomEvent('qr-scan-info', {
          detail: { from: 'ImageScanner', message },
        })
      );
    } catch {}
  };

  const pick = () => inputRef.current?.click();

  const fileToSource = async (file: File): Promise<HTMLImageElement | ImageBitmap> => {
    // Some Safari versions fail createImageBitmap for HEIC/large images; fallback to HTMLImageElement
    const blob = new Blob([await file.arrayBuffer()]);
    try {
      // Fast path where supported
      const bmp = await createImageBitmap(blob);
      return bmp;
    } catch {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image.'));
        img.src = URL.createObjectURL(blob);
      });
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const f = files[0];

      // basic guardrails
      if (f.size > 15 * 1024 * 1024) {
        emitError('Image is too large (max 15MB).');
        return;
      }
      if (!/^image\//i.test(f.type)) {
        emitError('Please select an image file.');
        return;
      }

      setBusy(true);
      emitInfo('Decoding image…');
      try {
        const src = await fileToSource(f);
        const text = await decodeOnce(src as any);
        if (text) {
          action?.(text);
        } else {
          emitError('No QR code detected in this image.');
        }
      } catch (e: any) {
        emitError(e?.message || 'Failed to decode image');
      } finally {
        setBusy(false);
      }
    },
    [action]
  );

  const onPaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      try {
        const items = e.clipboardData?.items || [];
        for (const it of items as any) {
          if (it.kind === 'file') {
            const file = it.getAsFile?.();
            if (file) {
              e.preventDefault();
              await handleFiles({ 0: file, length: 1, item: (i: number) => (i === 0 ? file : null) } as any);
              return;
            }
          }
        }
      } catch {}
    },
    [handleFiles]
  );

  return (
    <div className={['space-y-3', className].filter(Boolean).join(' ')} onPaste={onPaste}>
      <div
        className={`rounded-lg border border-dashed p-10 text-center ${dragOver ? 'bg-muted/40' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={pick}
        role="button"
        tabIndex={0}
      >
        <p className="text-sm text-muted-foreground mb-3">
          Drag &amp; drop an image here, click to select, or paste an image (⌘/Ctrl+V)
        </p>
        <button className="rounded-md border px-3 py-2 text-sm" disabled={busy}>
          {busy ? 'Decoding…' : 'Choose File'}
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Supports JPG, PNG, WebP. On mobile, you can take a photo.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.currentTarget.files)}
      />
    </div>
  );
}