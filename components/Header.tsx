'use client';

import Link from 'next/link';
import { QrCode, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-blue-600" />
            <Link href="/" className="text-xl font-bold text-gray-900">
              QR Scanner
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/scan" 
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Scan
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Privacy
            </Link>
            <a 
              href="https://github.com" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}