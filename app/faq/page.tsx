'use client';

import React from 'react';
import Script from 'next/script';

export default function FAQPage() {
  const groupedFaqs = [
    {
      title: 'General',
      qas: [
        {
          question: 'Can I scan a QR code from an image?',
          answer:
            'Yes. With our free online QR decoder, you can upload a photo or screenshot and instantly scan QR from image in your browser.',
        },
        {
          question: 'Do I need to install an app to scan QR codes?',
          answer:
            'No. This QR code scanner works entirely online — no app, no download, no registration required.',
        },
        {
          question: 'Is it safe and private?',
          answer:
            'Yes. All QR decoding happens locally in your browser. No data is uploaded or stored.',
        },
      ],
    },
    {
      title: 'Compatibility',
      qas: [
        {
          question: 'Can I use this tool on PC, Mac, or mobile?',
          answer:
            'Yes. It works on any device with a modern browser and a camera or image upload support.',
        },
        {
          question: 'Does it support scanning barcodes as well?',
          answer:
            'Currently the tool is optimized for QR codes. Barcode support may be added in the future.',
        },
      ],
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groupedFaqs.flatMap(group =>
      group.qas.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h1>

      {groupedFaqs.map((group, groupIndex) => (
        <section key={groupIndex} className="mb-12">
          <h2 id={`faq-group-${groupIndex}`} className="text-2xl font-semibold mb-6">
            {group.title}
          </h2>
          {group.qas.map((faq, index) => (
            <section
              key={index}
              className="mb-8 border-b pb-6"
              aria-labelledby={`faq-${groupIndex}-${index}`}
            >
              <h3 id={`faq-${groupIndex}-${index}`} className="text-lg font-semibold">
                {faq.question}
              </h3>
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            </section>
          ))}
        </section>
      ))}

      <Script
        id="faq-json-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}