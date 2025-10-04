import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" title="Free Online QR Scanner Home">
          <Image
            src="/image.png"
            alt="ScanQRly logo"
            width={32}
            height={32}
            priority
            className="inline-block"
          />
          <span className="text-lg font-semibold">QR Scanner</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/blog" className="font-medium hover:text-blue-600" title="QR Scanner Blog and Guides">Blog</Link>
          <Link href="/scan" className="font-medium hover:text-blue-600" title="Online QR Code Scanner Tool">Scan</Link>
          <Link href="/about" className="font-medium hover:text-blue-600" title="About ScanQRly">About</Link>
          <Link href="/terms" className="font-medium hover:text-blue-600" title="Terms of Service">Terms</Link>
          <Link href="/privacy" className="font-medium hover:text-blue-600" title="Privacy Policy for ScanQRly">Privacy</Link>
        </nav>
      </div>
    </header>
  );
}