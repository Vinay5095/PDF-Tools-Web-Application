'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  className?: string;
}

export default function CookieConsent({ onAccept, onDecline, className = '' }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    advertising: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
      functional: true,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(fullConsent));
    setIsVisible(false);
    onAccept();
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
    onAccept();
  };

  const handleDeclineAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
      functional: false,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg ${className}`}>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              We value your privacy
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeclineAll}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            We use cookies and similar technologies to provide the best experience on our website. 
            Some are necessary for the site to function, while others help us analyze usage and show you relevant ads.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Strictly Necessary</h4>
                <p className="text-xs text-gray-500">Required for basic site functionality</p>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-500 ml-1">Always active</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Analytics</h4>
                <p className="text-xs text-gray-500">Help us understand how you use our site</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Advertising</h4>
                <p className="text-xs text-gray-500">Used to show relevant ads and measure their effectiveness</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.advertising}
                onChange={(e) => setPreferences(prev => ({ ...prev, advertising: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Functional</h4>
                <p className="text-xs text-gray-500">Remember your preferences and settings</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                className="rounded border-gray-300"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleAcceptAll} className="flex-1">
              Accept All Cookies
            </Button>
            <Button onClick={handleAcceptSelected} variant="outline" className="flex-1">
              Accept Selected
            </Button>
            <Button onClick={handleDeclineAll} variant="ghost" className="flex-1">
              Decline All
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Learn more in our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/cookies" className="text-blue-600 hover:underline">
              Cookie Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}