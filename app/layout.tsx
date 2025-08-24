import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import FabFeedback from '@/components/Feedback/FabFeedback';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Online QR Scanner',
  description: 'Scan QR codes with your camera or by uploading images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 既然是给外国人用，将语言设置为 "en"
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <FabFeedback />
      </body>
    </html>
  );
}

// QR decoding logic should be placed in the relevant component or utility file, not in the layout.