'use client';

import { useEffect } from 'react';

const SCRIPT_SRC = 'https://storage.googleapis.com/multisync/interworky/production/interworky.js';
const API_KEY =
  'ZWU4MjUyMjYtY2NkMS00ODM3LThjMTUtNGY2ZGYwZjIzMTI2JCRhc3N0X3dIcnJRRzBFcThUbmtEN1FlOTEzVkc5cg==';

declare global {
  interface Window {
    Interworky?: {
      init?: () => void;
      remove?: () => void;
    };
  }
}

export default function InterworkyWidget() {
  useEffect(() => {
    let removed = false;

    // Avoid injecting duplicate scripts across re-renders or route transitions
    const alreadyLoaded = document.querySelector(`script[src="${SCRIPT_SRC}"]`) !== null;

    const timeoutId = setTimeout(() => {
      if (alreadyLoaded) {
        // If script is already present, just ensure it's initialized
        window.Interworky?.init?.();
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      (script as any).dataset.apiKey = API_KEY;
      (script as any).dataset.position = 'bottom-50 right-50';
      script.async = true;
      (script as any).defer = true;

      script.onload = () => {
        setTimeout(() => {
          if (!removed) {
            window.Interworky?.init?.();
          }
        }, 100);
      };

      script.onerror = e => {
        console.error('Interworky Plugin failed to load', e);
      };

      document.body.appendChild(script);
    }, 1500);

    return () => {
      removed = true;
      clearTimeout(timeoutId);
      window.Interworky?.remove?.();
    };
  }, []); // Run once on mount to prevent re-initialization loops

  return null;
}
