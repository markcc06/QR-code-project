# Online QR Scanner

A privacy-first QR code scanner built with Next.js 15 (canary) that works entirely in your browser. No server uploads, complete client-side processing.

## Features

- 📷 **Camera Scanning**: Real-time QR code scanning using device camera
- 🖼️ **Image Upload**: Drag & drop or file upload for QR code images  
- 🔒 **Privacy-First**: All processing happens locally in browser
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- ⚡ **Fast**: Instant scanning with no server round-trips
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Tech Stack

- Next.js 15 (canary) with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for component library
- @zxing/browser for camera QR scanning
- jsqr for image QR decoding

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd qr-scanner
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The app is configured for static export and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Adding AdSense

To replace the ad placeholders with real Google AdSense ads:

1. Get approved for Google AdSense
2. Create ad units in your AdSense dashboard
3. Replace the `AdSlot` component content with your AdSense code:

```jsx
// components/AdSlot.tsx
export function AdSlot({ className, size = 'banner' }: AdSlotProps) {
  return (
    <div className={cn('ad-container', className)}>
      {/* Replace with your AdSense code */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX"
              crossorigin="anonymous"></script>
      <ins className="adsbygoogle"
           style={{display: 'block'}}
           data-ad-client="ca-pub-XXXXXXXXX"
           data-ad-slot="XXXXXXXXX"
           data-ad-format="auto"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
  );
}
```

4. Add the AdSense script to your `app/layout.tsx`:

```jsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

## Privacy

This QR scanner is designed with privacy as a core principle:

- **No server uploads**: All QR code processing happens in your browser
- **No data collection**: We don't store or analyze your QR codes
- **Local camera access**: Camera stream never leaves your device
- **No tracking**: No analytics or user tracking implemented

## Browser Compatibility

- Chrome/Chromium 63+
- Firefox 63+
- Safari 11.1+
- Edge 79+

Camera scanning requires HTTPS in production environments.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`  
5. Submit a pull request

## License

MIT License - see LICENSE file for details.