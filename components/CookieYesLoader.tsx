'use client';
import { useEffect } from 'react';

export default function CookieYesLoader() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.id = 'cookieyes-banner';
      script.src = 'https://cdn-cookieyes.com/client_data/62ed42118afa099ca8f3428f/script.js';
      script.async = true;
      script.setAttribute('data-channel', 'analysis');
      script.onload = () => console.log('✅ CookieYes loaded successfully');
      script.onerror = (e) => console.warn('⚠️ CookieYes failed to load:', e);
      document.head.appendChild(script);
    }
  }, []);
  return null;
}