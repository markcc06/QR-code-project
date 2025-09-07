'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 两个面板都是 client 组件，禁用 SSR
const ScannerPanel = dynamic(() => import('./ScannerPanel'), { ssr: false });
const ScannerPanelMobile = dynamic(() => import('./ScannerPanel'), { ssr: false });

export default function ScanPage() {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const compute = () => {
      // 宽度 + 触点 + UA 三重判断，尽量避免桌面被误判为移动
      const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
      const narrow = typeof window !== 'undefined' ? window.innerWidth < 768 : false; // md 断点
      const coarse = typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(pointer: coarse)').matches
        : false;
      const mobileUA = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);

      setIsMobile((mobileUA || coarse) && narrow);
      setReady(true);
    };

    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('orientationchange', compute);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('orientationchange', compute);
    };
  }, []);

  if (!ready || isMobile === null) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-sm text-muted-foreground">
        Loading scanner…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {isMobile ? <ScannerPanelMobile /> : <ScannerPanel />}
    </div>
  );
}