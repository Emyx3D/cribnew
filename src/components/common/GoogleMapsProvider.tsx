// src/components/common/GoogleMapsProvider.tsx
'use client';

import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Error: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in .env');
    // You might want to render an error message or a disabled state
    // return <div>Google Maps API Key is missing. Location features disabled.</div>;
    // For now, just return children, features requiring the key will fail gracefully inside
    return <>{children}</>;
  }

  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
