'use client';

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 桌面端面板（app/scan/ScannerPanel.tsx）
const ScannerPanel = dynamic(() => import('./ScannerPanel'), { ssr: false });

// 移动端面板（components/Scanner/mobile/ScannerPanelMobile.tsx）
const ScannerPanelMobile = dynamic(
  () => import('../../components/Scanner/mobile/ScannerPanelMobile'),
  { ssr: false }
);

export default function ScanClient({ isMobileDefault }: { isMobileDefault: boolean }) {
  const [isMobile, setIsMobile] = useState(isMobileDefault);

  // 客户端再确认一次 UA（首屏用服务端 UA，挂载后用浏览器 UA 纠偏）
  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const m = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
      setIsMobile(m);
    } catch {}
  }, []);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl py-12 text-center text-sm text-muted-foreground">
          Loading scanner…
        </div>
      }
    >
      {isMobile ? <ScannerPanelMobile /> : <ScannerPanel />}
    </Suspense>
  );
}