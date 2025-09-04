import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import FabFeedback from '@/components/Feedback/FabFeedback';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Online QR Scanner',
  description: 'Scan QR codes with your camera or by uploading images',
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
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <FabFeedback />
      </body>
    </html>
  );
}