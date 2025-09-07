'use client';

import React from 'react';

type QRResultProps = {
  value: string;
  action?: () => void; // 统一函数型 prop 命名为 action，避免 Next 15 警告
};

export default function QRResult({ value, action }: QRResultProps) {
  const open = () => {
    try {
      const u = new URL(value);
      window.open(u.toString(), '_blank', 'noopener,noreferrer');
    } catch {
      // 非 URL 就不打开
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="rounded-xl border p-6">
      <div className="mb-1 text-sm text-muted-foreground">Decoded Content:</div>
      <input className="w-full rounded border px-3 py-2" readOnly value={value} />

      <div className="mt-4 flex gap-3">
        <button className="rounded border px-3 py-2" onClick={copy}>
          Copy Text
        </button>
        <button className="rounded border px-3 py-2" onClick={open}>
          Open Link
        </button>
      </div>

      <div className="mt-6">
        <button className="rounded bg-black px-3 py-2 text-white" onClick={action}>
          Scan Another QR Code
        </button>
      </div>
    </div>
  );
}