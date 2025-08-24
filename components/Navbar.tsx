import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">QR Scanner</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/scan" className="font-medium hover:text-blue-600">Scan</Link>
          <Link href="/privacy" className="font-medium hover:text-blue-600">Privacy</Link>
        </nav>
      </div>
    </header>
  );
}