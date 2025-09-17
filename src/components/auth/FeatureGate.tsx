'use client';

import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  requiredPlan?: string;
  className?: string;
}

export default function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  requiredPlan = 'Pro',
  className = '',
}: FeatureGateProps) {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkFeatureAccess = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/permissions?feature=${feature}`);
        const data = await response.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureAccess();
  }, [feature, session, status]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg h-32 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <Card className={`border-2 border-dashed border-gray-300 ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl">Premium Feature</CardTitle>
        <CardDescription>
          This feature requires a {requiredPlan} subscription to access.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What you'll get with {requiredPlan}:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center justify-center">
              <Zap className="h-4 w-4 text-yellow-500 mr-2" />
              Advanced PDF tools and features
            </li>
            <li className="flex items-center justify-center">
              <Lock className="h-4 w-4 text-green-500 mr-2" />
              No ads and unlimited usage
            </li>
            <li className="flex items-center justify-center">
              <Crown className="h-4 w-4 text-purple-500 mr-2" />
              Priority support and updates
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full">
              Upgrade to {requiredPlan}
            </Button>
          </Link>
          {!session && (
            <Link href="/auth/signin" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}