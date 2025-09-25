import type { Metadata } from "next";
import { Shield, Lock, Eye, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Privacy Policy - QR Scanner",
  description: "Learn how our QR scanner keeps your data safe. Local decoding, no uploads, zero storage, and full privacy guaranteed."
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Shield className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your privacy is our priority. Learn how our QR scanner protects your data.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Privacy Principles</h2>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-blue-600" />
              Local Processing Only
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All QR code decoding is done entirely in your browser. No images or data 
              are ever uploaded to our servers or any third-party services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-green-600" />
              No Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We don&apos;t collect, store, or analyze any of your QR code content, 
              camera images, or personal information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Server className="w-6 h-6 text-purple-600" />
              Zero Server Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our application runs entirely in your browser. No server-side 
              processing or storage of your scanned content occurs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-600" />
              Camera Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Camera access is only used for QR scanning. The camera stream 
              stays local and is automatically stopped when you leave the page.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Privacy Guarantee
          </h2>
          <p className="text-gray-700 mb-4">
            Our QR scanner is designed with privacy-first principles. Everything happens 
            locally in your browser using JavaScript and WebRTC technologies.
          </p>
          <p className="text-sm text-gray-600">
            <strong>What this means for you:</strong> Your QR codes, images, and any 
            decoded content never leave your device. We cannot see, access, or store 
            any of your data because it never reaches our servers.
          </p>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Questions about Privacy?
        </h3>
        <p className="text-gray-600">
          If you have any questions about how we protect your privacy, 
          feel free to review our open-source code or contact us.
        </p>
      </div>
    </div>
  );
}