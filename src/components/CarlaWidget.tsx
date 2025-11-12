'use client';

import { useEffect } from 'react';

const SCRIPT_SRC = 'https://storage.googleapis.com/multisync/interworky/production/interworky.js';
const API_KEY = process.env.NEXT_PUBLIC_CARLA_API_KEY;

export default function CarlaWidget() {
  useEffect(() => {
    if (!API_KEY) {
      console.warn('Carla: NEXT_PUBLIC_CARLA_API_KEY not found in environment variables');
      return;
    }

    const timeoutId = setTimeout(() => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.dataset.apiKey = API_KEY;
      script.dataset.position = 'bottom-50 right-50';
      script.async = true;
      script.defer = true;

      script.onerror = (e: any) => {
        console.error('Carla Plugin failed to load', e);
      };

      document.body.appendChild(script);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      document.querySelectorAll('script[data-api-key]').forEach(s => s.remove());
    };
  }, []);

  return null;
}
