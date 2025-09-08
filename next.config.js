const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep existing setting
  outputFileTracingRoot: path.join(__dirname),

  // Add HTTP headers for correct WASM serving + strong caching
  async headers() {
    return [
      // Global security headers required by some WASM decoders using SharedArrayBuffer
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
      // Ensure .wasm is served with the correct MIME type and long cache
      {
        source: '/:path*.wasm',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache-static assets aggressively
      {
        source: '/:all*(js|css|png|jpg|jpeg|webp|gif|svg|ico|txt)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
