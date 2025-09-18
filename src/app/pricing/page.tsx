"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PricingCards from '@/components/payment/PricingCards';
import { SubscriptionPlan } from '@/lib/types';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<number | undefined>();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscriptions/plans');
        const data = await response.json();
        if (data.success) {
          setPlans(data.data);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();
        if (data.subscription) {
          setCurrentPlanId(data.subscription.plan_id);
        }
      } catch (error) {
        console.error('Error fetching current subscription:', error);
      }
    };

    fetchCurrentSubscription();
  }, [session]);

  const handleSelectPlan = (plan: SubscriptionPlan, billing: 'monthly' | 'yearly') => {
    console.log('Selected plan:', plan, 'Billing:', billing);
    // TODO: Implement payment flow
    alert(`You selected ${plan.name} plan with ${billing} billing. Payment integration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <span className="text-blue-600 font-medium">Pricing</span>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with our free tier and upgrade as you grow. 
              All plans include secure processing and unlimited access to basic PDF tools.
            </p>
          </div>

          {/* Pricing Cards */}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <PricingCards
              plans={plans}
              currentPlanId={currentPlanId}
              onSelectPlan={handleSelectPlan}
              loading={false}
            />
          )}

          {/* FAQ Section */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h4 className="text-lg font-semibold mb-2">Can I change my plan anytime?</h4>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. 
                  Changes take effect immediately, and you&apos;ll be charged or refunded accordingly.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Is my data secure?</h4>
                <p className="text-gray-600">
                  Absolutely. All files are processed securely and deleted immediately after processing. 
                  We never store your documents on our servers.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards via Stripe globally, 
                  and UPI/local payment methods via Razorpay for Indian users.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Do you offer refunds?</h4>
                <p className="text-gray-600">
                  Yes, we offer a 30-day money-back guarantee for all paid plans. 
                  Contact our support team if you&apos;re not satisfied.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Tools */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-semibold">PDF Tools</span>
            </div>
            <p className="text-gray-400">&copy; 2024 PDF Tools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}