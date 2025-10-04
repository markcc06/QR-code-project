import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ScanQRly",
  description:
    "Learn more about ScanQRly — a free, fast, and privacy-first online QR code scanner built for everyone.",
};

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-gray-800 leading-relaxed text-left">
      <h1 className="text-3xl font-bold mb-6 text-center">About ScanQRly</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="mb-4">
          <strong>ScanQRly</strong> is an independent, privacy-focused web tool
          that allows anyone to scan and decode QR codes instantly — directly in
          their browser, without installing any apps or uploading data to external
          servers.
        </p>
        <p className="mb-4">
          Our mission is to make QR scanning faster, safer, and more accessible for
          everyone. Whether you are on desktop or mobile, ScanQRly works directly
          with your camera or image files to read QR codes in seconds.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Privacy Commitment</h2>
        <h3 className="text-xl font-medium mb-2">Local Processing</h3>
        <p className="mb-4">
          Unlike many online QR tools, ScanQRly processes your images locally.
          That means <strong>no tracking, no storage, and no third‑party access</strong> —
          your privacy stays entirely in your hands.
        </p>
        <h3 className="text-xl font-medium mb-2">No Third-Party Access</h3>
        <p className="mb-4">
          We never share, store, or upload your data to external servers. All
          actions take place within your browser for complete control and
          transparency.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>
        <p className="mb-4">
          The site is built using <strong>Next.js</strong> and{" "}
          <strong>Tailwind CSS</strong>, reflecting a commitment to clean,
          performant, and modern web standards.
        </p>
        <h3 className="text-xl font-medium mb-2">Performance & Accessibility</h3>
        <p className="mb-4">
          ScanQRly is optimized for performance and accessibility, ensuring smooth operation across devices and browsers while maintaining a lightweight footprint.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Who We Are</h2>
        <h3 className="text-xl font-medium mb-2">Independent Development</h3>
        <p className="mb-4">
          Built and maintained independently, ScanQRly reflects a passion for open web tools and user empowerment through technology.
        </p>
        <p className="mb-4">
          ScanQRly was created and maintained by an independent developer who
          believes that simple tools, when done right, can empower creators and
          users across the world.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Contact & Policies</h2>
        <h3 className="text-xl font-medium mb-2">Get in Touch</h3>
        <p>
          For privacy details, please read our{" "}
          <Link
            href="/privacy"
            title="Privacy Policy for ScanQRly"
            className="text-blue-600 hover:underline"
          >
            Privacy Policy
          </Link>
          . For questions or suggestions, feel free to{" "}
          <Link href="/about?feedback=open" className="text-blue-600 hover:underline">
            contact us
          </Link>
          .
        </p>
      </section>
    </main>
  );
}