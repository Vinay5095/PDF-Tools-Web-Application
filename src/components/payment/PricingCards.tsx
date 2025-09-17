'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Users } from 'lucide-react';
import { SubscriptionPlan } from '@/lib/types';
import { formatCurrency, calculateDiscount } from '@/lib/payment-service';

interface PricingCardsProps {
  plans: SubscriptionPlan[];
  currentPlanId?: number;
  onSelectPlan: (plan: SubscriptionPlan, billing: 'monthly' | 'yearly') => void;
  loading?: boolean;
}

export default function PricingCards({
  plans,
  currentPlanId,
  onSelectPlan,
  loading = false,
}: PricingCardsProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Zap className="h-6 w-6 text-blue-600" />;
      case 'pro':
        return <Crown className="h-6 w-6 text-purple-600" />;
      case 'business':
        return <Users className="h-6 w-6 text-green-600" />;
      default:
        return <Zap className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly / 12;
  };

  const getDisplayPrice = (plan: SubscriptionPlan) => {
    if (plan.priceMonthly === 0) return 'Free';
    
    const price = getPrice(plan);
    const currency = 'USD'; // You can make this dynamic based on user location
    
    return formatCurrency(price, currency);
  };

  const getDiscount = (plan: SubscriptionPlan) => {
    if (plan.priceMonthly === 0 || plan.priceYearly === 0) return 0;
    return calculateDiscount(plan.priceMonthly, plan.priceYearly);
  };

  const getFeatureList = (features: Record<string, boolean>) => {
    const featureMap: Record<string, string> = {
      basic_tools: 'Basic PDF tools',
      advanced_tools: 'Advanced PDF features',
      ocr: 'OCR text extraction',
      watermark: 'PDF watermarking',
      batch_processing: 'Batch processing',
      collaboration: 'Team collaboration',
      api_access: 'API access',
      priority_support: 'Priority support',
      all_features: 'All premium features',
    };

    return Object.entries(features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => featureMap[feature] || feature);
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save up to 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.id;
          const isPro = plan.name.toLowerCase() === 'pro';
          const features = getFeatureList(plan.features);
          const discount = billingCycle === 'yearly' ? getDiscount(plan) : 0;

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isPro
                  ? 'border-2 border-purple-200 shadow-lg scale-105'
                  : isCurrentPlan
                  ? 'border-2 border-green-200'
                  : ''
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">
                    {getDisplayPrice(plan)}
                    {plan.priceMonthly > 0 && (
                      <span className="text-lg font-normal text-gray-500">/month</span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.priceYearly > 0 && discount > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {discount}% with yearly billing
                    </div>
                  )}
                  {billingCycle === 'yearly' && plan.priceYearly > 0 && (
                    <div className="text-sm text-gray-500">
                      {formatCurrency(plan.priceYearly)} billed annually
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onSelectPlan(plan, billingCycle)}
                      disabled={loading}
                      className={`w-full ${
                        isPro
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : plan.name.toLowerCase() === 'free'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {loading ? 'Processing...' : 
                       plan.priceMonthly === 0 ? 'Get Started' : 'Upgrade Now'}
                    </Button>
                  )}
                </div>

                {plan.limits && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Max file size: {plan.limits.maxFileSizeMb}MB</div>
                      <div>Operations/month: {plan.limits.operationsPerMonth}</div>
                      <div>Files per operation: {plan.limits.maxFilesPerOperation}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>All plans include secure file processing and 24/7 uptime.</p>
        <p>You can cancel or change your plan anytime.</p>
      </div>
    </div>
  );
}