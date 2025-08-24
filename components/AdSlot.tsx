"use client";

import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  className?: string;
  size?: "banner" | "square" | "rectangle";
  /** 代码层面的开关（优先级高于环境变量） */
  enabled?: boolean;
};

// 环境变量开关（NEXT_PUBLIC 为前端可见）
const ENV_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADS === "1" ||
  process.env.NEXT_PUBLIC_ENABLE_ADS === "true";

const ADS_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT || "";
const ADS_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT || "";

export default function AdSlot({
  className,
  size = "banner",
  enabled = undefined,
}: AdSlotProps) {
  // 统一决定是否渲染广告（props 优先，然后看环境变量；开发环境一律关）
  const shouldEnable =
    (enabled ?? ENV_ENABLED) && process.env.NODE_ENV === "production";

  const id = useId();

  // hooks 必须无条件调用；在 effect 内做条件判断
  useEffect(() => {
    if (!shouldEnable) return;         // 没开广告 → 不做任何事
    if (!ADS_CLIENT || !ADS_SLOT) return; // 未配置客户端/slot → 不做任何事

    // 只注入一次 adsbygoogle 脚本
    if (!document.querySelector('script[data-adsbygoogle="true"]')) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
      s.crossOrigin = "anonymous";
      s.setAttribute("data-adsbygoogle", "true");
      document.head.appendChild(s);
    }

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 脚本还没完全 ready，忽略
    }
  }, [shouldEnable]);

  // 不开广告 / 未配置 client/slot → 完全不渲染（不占空间）
  if (!shouldEnable || !ADS_CLIENT || !ADS_SLOT) return null;

  const sizeClasses = {
    banner: "w-full",
    square: "h-64 w-64",
    rectangle: "h-48 w-80",
  };

  return (
    <div className={cn("w-full", sizeClasses[size], className)} id={id}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={ADS_SLOT}
        data-ad-format={size === "banner" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}
