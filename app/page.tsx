import Link from 'next/link';
import { QrCode, Camera, Upload, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdSlot from '@/components/AdSlot';


export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <QrCode className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">
          Online QR Scanner
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Scan QR codes instantly with your camera or upload images. 
          Fast, secure, and completely private - no data leaves your browser.
        </p>
        
        <Link href="/scan">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Scanning
            <QrCode className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Ad Placeholder */}
      <div className="mb-12">
        {/* Conditional ad slot: only renders when enabled or client set */}
        <AdSlot />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Camera Scanner</h3>
            <p className="text-gray-600">
              Point your camera at any QR code for instant scanning
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Image Upload</h3>
            <p className="text-gray-600">
              Drag & drop or upload QR code images from your device
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-gray-600">
              All processing happens locally in your browser
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Choose Method</h3>
            <p className="text-gray-600 text-sm">Select camera scanning or image upload</p>
          </div>
          <div>
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Scan QR Code</h3>
            <p className="text-gray-600 text-sm">Point camera or upload your QR code image</p>
          </div>
          <div>
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600 text-sm">View, copy, or open the decoded content</p>
          </div>
        </div>
      </div>
    </div>
  );
}