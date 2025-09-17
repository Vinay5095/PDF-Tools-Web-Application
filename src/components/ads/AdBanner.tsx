'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  const { data: session } = useSession();
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Check if user has an active subscription
    const checkSubscriptionStatus = async () => {
      if (!session?.user?.id) {
        setShouldShowAd(true);
        return;
      }

      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();
        
        // Show ads only if user doesn't have an active subscription
        setShouldShowAd(!data.hasActiveSubscription);
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setShouldShowAd(true); // Show ads on error as fallback
      }
    };

    checkSubscriptionStatus();
  }, [session]);

  useEffect(() => {
    if (shouldShowAd && !adLoaded) {
      try {
        // Load AdSense script if not already loaded
        if (!window.adsbygoogle) {
          const script = document.createElement('script');
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + 
                      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
          
          script.onload = () => {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            setAdLoaded(true);
          };
        } else {
          // Push new ad
          window.adsbygoogle.push({});
          setAdLoaded(true);
        }
      } catch (error) {
        console.error('Error loading ads:', error);
      }
    }
  }, [shouldShowAd, adLoaded]);

  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`ad-banner ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
      {!adLoaded && (
        <div className="ad-placeholder bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">Advertisement</p>
        </div>
      )}
    </div>
  );
}