// components/FAQAccordion.tsx
// ✅ 保留服务器组件，无 'use client'
import React from 'react';

type Faq = { q: string; a: string };

const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: 'General Questions',
    items: [
      {
        q: 'Can I scan a QR code from an image?',
        a: 'Yes. Upload a photo or screenshot and decode it instantly in‑browser.',
      },
      {
        q: 'Do I need to install an app to scan QR codes?',
        a: 'No. Everything runs online — no app, no download, no registration.',
      },
      {
        q: 'Is it safe and private?',
        a: 'All decoding happens locally in your browser. Nothing is uploaded.',
      },
    ],
  },
  {
    title: 'Compatibility',
    items: [
      {
        q: 'Can I use this tool on PC, Mac, or mobile?',
        a: 'Yes. It works in any modern browser with camera or image‑upload support.',
      },
      {
        q: 'Does it support scanning barcodes as well?',
        a: 'Right now it’s optimized for QR codes; barcode support is on the roadmap.',
      },
    ],
  },
];

export default function FAQAccordion() {
  return (
    <div className="max-w-3xl mx-auto mb-12">
      {faqGroups.map(({ title, items }, groupIndex) => (
        <section key={groupIndex} className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
          {items.map(({ q, a }, i) => {
            const faqIndex = groupIndex * 100 + i; // unique key/id
            return (
              <div key={faqIndex} className="border-b">
                {/* 语义 H3 —— SEO 真正能抓到 */}
                <h3 id={`faq-${faqIndex}`} className="text-lg font-semibold">
                  {q}
                </h3>

                {/* suppressHydrationWarning 避免 details 初始状态差异 */}
                <details
                  aria-labelledby={`faq-${faqIndex}`}
                  className="group py-2 cursor-pointer hover:bg-gray-50"
                  suppressHydrationWarning
                >
                  <summary className="list-none marker:hidden flex justify-between items-center">
                    <span className="text-sm text-gray-700 group-open:hidden">
                      Show answer
                    </span>
                    <span className="text-sm text-gray-700 hidden group-open:inline">
                      Hide answer
                    </span>
                  </summary>

                  <p className="mt-2 text-gray-600">{a}</p>
                </details>
              </div>
            );
          })}
        </section>
      ))}

      <div className="text-center mt-8">
        <a
          href="/faq"
          title="View all FAQs about QR code scanning"
          aria-label="View all FAQs about QR code scanning"
          className="text-blue-600 font-medium hover:underline"
        >
          View all FAQs →
        </a>
      </div>
    </div>
  );
}