declare global {
  interface Window {
    cookieyes?: unknown;
  }
}
import React, { Suspense } from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import FabFeedback from '@/components/Feedback/FabFeedback';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.scanqrly.xyz'),
  title: {
    default: 'Free Online QR Scanner — Scan QR from Image or Camera',
    template: '%s | ScanQRly'
  },
  description: 'Free online QR code scanner to decode codes from camera or image upload. 100% free, private, and secure. Works on PC, Mac, and mobile browsers — no app required.',
  // removed keywords: deprecated for SEO
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Free Online QR Scanner — Scan QR from Image or Camera',
    description: 'Scan QR codes instantly using your camera or upload images. All processing happens locally in your browser — privacy-first, no data leaves your device.',
    url: 'https://www.scanqrly.xyz',
    siteName: 'ScanQRly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ScanQRly — Free Online QR Scanner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@scanqrly',
    creator: '@scanqrly',
    title: 'Free Online QR Scanner — Scan QR from Image or Camera',
    description: 'Free, fast, and privacy-first online QR code reader. Works with camera or image upload, directly in your browser.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    // language set to English for international audience
    <html lang="en">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            {/* Load GA4 gtag script after the page is interactive */}
            <Script
              id="gtag-js"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.scanqrly.xyz",
              "name": "ScanQRly",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <Navbar />
          {children}
          <FabFeedback />
        </Suspense>

        {/* ✅ CookieYes Banner Script */}
        <Script
          id="cookieyes-banner"
          strategy="afterInteractive"
          src="https://cdn-cookieyes.com/client_data/62ed42118afa099ca8f3428f/script.js"
        />
      </body>
    </html>
  );
}