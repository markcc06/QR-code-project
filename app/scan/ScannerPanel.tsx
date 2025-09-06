'use client';

import React, { useMemo, useState } from 'react';
import { QRResult } from '../../components/Scanner/QRResult';
import CameraScanner from '../../components/Scanner/CameraScanner';
import ImageScanner from '../../components/Scanner/ImageScanner';
import { cn } from '../../lib/utils';
import { useToast } from '../../hooks/use-toast';

type Mode = 'camera' | 'upload';

interface Props {
  defaultMode?: Mode;
  className?: string;
  /** 可选：若外层需要接收结果回调（注意仅在客户端组件向下传递） */
  onDecoded?: (text: string) => void;
}

/**
 * ScannerPanel
 * 客户端边界：统一包装 CameraScanner 与 ImageScanner，并在成功识别后只展示结果视图。
 * - 默认在移动端使用 camera 优先（可通过 defaultMode 覆盖）
 * - 成功识别后隐藏扫描 UI，显示 QRResult；点击“Scan again”恢复扫描
 */
export default function ScannerPanel({
  defaultMode,
  className,
  onDecoded,
}: Props) {
  const { toast } = useToast();

  // 简单的移动端判断，用于默认 tab
  const isMobile = useMemo(
    () =>
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
    []
  );

  const [mode, setMode] = useState<Mode>(defaultMode ?? (isMobile ? 'camera' : 'upload'));
  const [value, setValue] = useState<string>('');

  const handleDecoded = (text: string) => {
    setValue(text);
    onDecoded?.(text);
    toast({
      title: 'QR decoded',
      description: text.length > 120 ? text.slice(0, 120) + '…' : text,
    });
  };

  const handleError = (err: unknown) => {
    const message =
      (err as any)?.message ??
      (typeof err === 'string' ? err : 'Failed to scan the QR code.');
    toast({
      title: 'Scan error',
      description: message,
      variant: 'destructive',
    });
    if (mode === 'camera') setMode('upload'); // 摄像头不可用时自动切到上传
  };

  // ✅ 如果已经识别出结果，只展示结果卡片，不再显示上传/摄像头 UI
  if (value) {
    return (
      <div className={cn('w-full', className)}>
        <QRResult
          result={{ text: value } as any}
          onScanAgain={() => {
            setValue('');
            setMode('camera');
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 切换按钮 */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('camera')}
          className={cn(
            'rounded-md border px-3 py-1 text-sm',
            mode === 'camera' ? 'bg-foreground text-background' : 'bg-transparent'
          )}
        >
          Camera
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'rounded-md border px-3 py-1 text-sm',
            mode === 'upload' ? 'bg-foreground text-background' : 'bg-transparent'
          )}
        >
          Upload
        </button>
      </div>

      {/* 扫描器 */}
      <div className="relative">
        {mode === 'camera' ? (
          <CameraScanner
            {...({
              isActive: mode === 'camera',
              // 同时传递 onDecoded 与 onResult，兼容旧/新实现
              onDecoded: handleDecoded,
              onResult: handleDecoded,
              onError: handleError,
            } as any)}
          />
        ) : (
          // ImageScanner 现实现期望 onDecoded
          <ImageScanner onDecoded={handleDecoded} onError={handleError} />
        )}
      </div>
    </div>
  );
}