'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { decodeImageFile } from '@/lib/qr/decode';
import { Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

interface ImageScannerProps {
  onResult: (text: string) => void;
}

export function ImageScanner({ onResult }: ImageScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError('');

    try {
      const result = await decodeImageFile(file);
      if (result) {
        onResult(result);
      } else {
        // 可选：展示提示或调用 onError 回调
        // setError('No QR code found in the image.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode QR code from image';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      setError('Please drop a valid image file (JPG, PNG, WebP)');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isProcessing) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Processing Image</h3>
        <p className="text-gray-600">
          Scanning your image for QR codes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto">
            <ImageIcon className="w-12 h-12 text-gray-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Upload QR Code Image</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop an image file here, or click to select
            </p>
          </div>

          <Button onClick={handleButtonClick} variant="outline" size="lg">
            <Upload className="mr-2 w-5 h-5" />
            Choose File
          </Button>

          <p className="text-sm text-gray-500">
            Supports JPG, PNG, and WebP formats
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Tip: For best results, use clear, high-contrast images with the QR code clearly visible
        </p>
      </div>
    </div>
  );
}