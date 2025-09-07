

import { useEffect, useMemo, useState } from 'react';

/**
 * SSR-safe mobile detection helpers
 */
const MOBILE_UA_RE = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i;

export function isMobileByUA(ua: string | undefined | null): boolean {
  if (!ua) return false;
  return MOBILE_UA_RE.test(ua);
}

/**
 * useIsMobile()
 * - 仅在客户端判定，避免 SSR 报错
 * - 综合 UA 与指针能力（coarse/no-hover）
 */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  // 初始值：SSR 阶段为 false；客户端首帧以 UA 提升准确性
  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const uaMobile = isMobileByUA(ua);
      const coarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      const noHover = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches;
      setMobile(Boolean(uaMobile || (coarse && noHover)));
    } catch {
      setMobile(false);
    }
  }, []);

  return mobile;
}

/**
 * useClientHasTouch: 有些场景仅需知道是否触摸为主
 */
export function useClientHasTouch(): boolean {
  const hasTouch = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
  return hasTouch;
}