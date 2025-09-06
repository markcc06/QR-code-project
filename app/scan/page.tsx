'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import CameraScanner from '@/components/Scanner/CameraScanner';
import ImageScanner from '@/components/Scanner/ImageScanner';
import { QRResult } from '@/components/Scanner/QRResult';
import { Camera, Upload } from 'lucide-react';
import { ScanResult } from '@/types/scan'; // <-- 改为从 types 导入

export default function ScanPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  const handleResult = (text: string) => {
    setResult({ text, timestamp: new Date() });
  };

  const handleScanAgain = () => {
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Scanner</h1>
        <p className="text-gray-600">
          Choose your preferred scanning method below
        </p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          {result ? (
            <QRResult result={result} onScanAgain={handleScanAgain} />
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'camera' | 'upload')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="camera" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="camera" className="space-y-4">
                  {activeTab === 'camera' && (
                    <CameraScanner onDecoded={handleResult} onError={(m) => console.warn(m)} />
                  )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <ImageScanner {...({ onDecoded: handleResult } as any)} />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          🔒 All QR code processing is done locally in your browser for privacy
        </p>
      </div>
    </div>
  );
}