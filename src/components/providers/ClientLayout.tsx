'use client';

import { ReactNode } from 'react';
import CookieConsent from '@/components/ads/CookieConsent';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const handleCookieAccept = () => {
    console.log('Cookies accepted');
  };

  const handleCookieDecline = () => {
    console.log('Cookies declined');
  };

  return (
    <>
      {children}
      <CookieConsent
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </>
  );
}