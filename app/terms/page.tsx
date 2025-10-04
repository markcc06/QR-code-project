import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ScanQRly",
  description:
    "Review the Terms of Service for ScanQRly — outlining user rights, responsibilities, and data protection practices when using our QR scanning tools.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-6 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <p className="mb-6">
        Welcome to <strong>ScanQRly</strong>. These Terms of Service ((&ldquo;Terms&rdquo;))
        govern your access to and use of our website, tools, and services. By
        accessing or using ScanQRly, you agree to be bound by these Terms. If
        you do not agree, please discontinue use immediately.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">1. Use of Service</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Acceptable Usage</h3>
      <p className="mb-6">
        ScanQRly provides online QR code scanning and decoding utilities for
        personal and professional use. You agree not to misuse the service,
        interfere with its operation, or attempt to access it using automated or
        unauthorized methods. You may only use the service in compliance with
        all applicable local, national, and international laws.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">2. Privacy & Data</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Data Handling & Privacy Practices</h3>
      <p className="mb-6">
        We value your privacy. ScanQRly processes all QR scans directly in your
        browser — we do not store or transmit your uploaded images or scan
        results to any server. No tracking or analytics data are collected from
        QR interactions. Please review our{" "}
        <Link
          href="/privacy"
          title="Privacy Policy for ScanQRly"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </Link>{" "}
        to understand how we protect your information.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">3. Intellectual Property</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Ownership & Restrictions</h3>
      <p className="mb-6">
        The ScanQRly name, logo, interface design, and all related intellectual
        property are the exclusive property of ScanQRly. You may not copy,
        distribute, modify, or reuse any part of our website or source code
        without written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">4. Service Availability</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Service Reliability</h3>
      <p className="mb-6">
        We strive to maintain a reliable and secure experience, but ScanQRly is
        provided “as is” and “as available.” We make no warranties regarding
        uptime, accuracy, or suitability for specific use cases. We may modify,
        suspend, or discontinue features at any time without prior notice.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">5. Limitation of Liability</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability Scope</h3>
      <p className="mb-6">
        To the fullest extent permitted by law, ScanQRly and its contributors
        shall not be liable for any damages — direct, indirect, incidental, or
        consequential — arising from your use or inability to use the service.
        Your sole and exclusive remedy is to discontinue use of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">6. Updates to These Terms</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Policy Updates</h3>
      <p className="mb-6">
        We may update these Terms periodically to reflect operational or legal
        changes. The latest version will always be available on this page, with
        an updated “Last Modified” date. Continued use after updates constitutes
        acceptance of the revised Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">7. Contact Us</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Feedback & Contact Information</h3>
      <p>
        For questions, feedback, or concerns regarding these Terms, please{" "}
        <Link href="/about?feedback=open" className="text-blue-600 hover:underline">
          contact us
        </Link>
        . We aim to respond promptly and transparently to all legitimate
        inquiries.
      </p>
    </main>
  );
}