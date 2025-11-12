'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SCRIPT_SRC =
  'https://storage.googleapis.com/multisync/interworky/production/interworky.js';
const API_KEY =
  'M2Q2MjkyMmItYzUzOS00YzdiLTlkNjgtN2Q1NjkwYzM3YWJhJCRhc3N0X3I2UGl5b1haSnl2SFptRjl5dVg2R2tEVQ';

declare global {
  interface Window {
    Interworky?: {
      init?: () => void;
      remove?: () => void;
    };
  }
}

export default function InterworkyWidget() {
  const pathname = usePathname();

  useEffect(() => {
    // Delay script loading to prioritize core content rendering
    const timeoutId = setTimeout(() => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.dataset.apiKey = API_KEY;
      script.dataset.position = 'bottom-50 right-50';
      script.async = true;
      script.defer = true; // Add defer attribute

      script.onload = () => {
        // Initialize after a small delay to not interfere with main thread during initial render
        setTimeout(() => {
          window.Interworky?.init?.();
        }, 100);
      };

      script.onerror = (e) => {
        console.error('Interworky Plugin failed to load', e);
      };

      document.body.appendChild(script); // Append to body instead of head for better performance
    }, 1500); // Delay loading until after critical content is rendered

    return () => {
      clearTimeout(timeoutId);
      window.Interworky?.remove?.();
      document
        .querySelectorAll('script[data-api-key]')
        .forEach((s) => s.remove());
    };
  }, [pathname]);

  return null;
}
