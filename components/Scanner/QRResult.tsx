'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, RotateCcw, Check } from 'lucide-react';
import { ScanResult } from '@/types/scan'; // <-- 改为从 types 导入

interface QRResultProps {
  result: ScanResult;
  onScanAgain: () => void;
}

export function QRResult({ result, onScanAgain }: QRResultProps) {
  const [copied, setCopied] = useState(false);

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return text.startsWith('http://') || text.startsWith('https://');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = result.text;
      // 防止页面跳动
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
        // 最后兜底：提示用户手动复制（可根据需要替换为 UI 提示）
        console.warn('Copy to clipboard failed', _e);
      }
      document.body.removeChild(textArea);
    }
  };

  const openLink = () => {
    if (isUrl(result.text)) {
      window.open(result.text, '_blank', 'noopener,noreferrer');
    }
  };

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
              {result.timestamp.toLocaleTimeString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Decoded Content:</p>
            <p className="font-mono text-sm break-all whitespace-pre-wrap border p-3 rounded bg-white">
              {result.text}
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

            {isUrl(result.text) && (
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