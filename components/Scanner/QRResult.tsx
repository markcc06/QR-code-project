'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, RotateCcw, Check } from 'lucide-react';

// 轻量本地类型，避免强依赖外部 types
export type ScanResultLike = {
  text: string;
  timestamp?: Date | string;
};

interface QRResultProps {
  /** 新推荐：传对象 { text, timestamp } */
  result?: ScanResultLike;
  /** 兼容旧用法：直接传字符串 */
  value?: string;
  onScanAgain: () => void;
}

export function QRResult({ result, value, onScanAgain }: QRResultProps) {
  const [copied, setCopied] = useState(false);

  const text = (result?.text ?? value ?? '').trim();
  const tsRaw = result?.timestamp;
  const ts = tsRaw ? new Date(tsRaw) : new Date();

  const isUrl = (input: string) => {
    const s = input.trim();
    if (!s) return false;
    try {
      new URL(s);
      return true;
    } catch {
      return s.startsWith('http://') || s.startsWith('https://');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older浏览器
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (_e) {
        console.warn('Copy to clipboard failed', _e);
      }
      document.body.removeChild(textArea);
    }
  };

  const openLink = () => {
    if (isUrl(text)) {
      window.open(text, '_blank', 'noopener,noreferrer');
    }
  };

  if (!text) return null;

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          QR code successfully scanned!
        </AlertDescription>
      </Alert>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scan Result</span>
            <span className="text-sm font-normal text-gray-500">
              {ts.toLocaleTimeString?.() ?? ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Decoded Content:</p>
            <p className="font-mono text-sm break-all whitespace-pre-wrap border p-3 rounded bg-white">
              {text}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Check className="mr-2 w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 w-4 h-4" />
                  Copy Text
                </>
              )}
            </Button>

            {isUrl(text) && (
              <Button onClick={openLink} className="flex-1">
                <ExternalLink className="mr-2 w-4 h-4" />
                Open Link
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onScanAgain} variant="outline" size="lg">
          <RotateCcw className="mr-2 w-4 h-4" />
          Scan Another QR Code
        </Button>
      </div>
    </div>
  );
}