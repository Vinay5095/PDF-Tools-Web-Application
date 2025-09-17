import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { PaymentProvider, SubscriptionPlan } from './types';

// Stripe Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Razorpay Configuration
let razorpay: any = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const paymentProviders: PaymentProvider[] = [
  {
    name: 'stripe',
    displayName: 'Credit/Debit Card',
    supportedRegions: ['US', 'CA', 'GB', 'AU', 'EU'],
    supportedMethods: ['card', 'bank_transfer', 'wallet'],
    config: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
  },
  {
    name: 'razorpay',
    displayName: 'UPI / Razorpay',
    supportedRegions: ['IN'],
    supportedMethods: ['upi', 'card', 'netbanking', 'wallet'],
    config: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    },
  },
];

export class StripeService {
  static async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      name,
    });
  }

  static async createSubscription(
    customerId: string,
    priceId: string,
    paymentMethodId?: string
  ): Promise<Stripe.Subscription> {
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    if (paymentMethodId) {
      subscriptionParams.default_payment_method = paymentMethodId;
    }

    return await stripe.subscriptions.create(subscriptionParams);
  }

  static async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string
  ): Promise<Stripe.PaymentIntent> {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Stripe.Subscription> {
    if (cancelAtPeriodEnd) {
      return await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      return await stripe.subscriptions.cancel(subscriptionId);
    }
  }

  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  static async createPrice(
    productId: string,
    amount: number,
    currency: string = 'usd',
    interval: 'month' | 'year' = 'month'
  ): Promise<Stripe.Price> {
    return await stripe.prices.create({
      product: productId,
      unit_amount: Math.round(amount * 100),
      currency,
      recurring: {
        interval,
      },
    });
  }

  static async constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  }
}

export class RazorpayService {
  static async createCustomer(email: string, name?: string, contact?: string): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    return await razorpay.customers.create({
      email,
      name,
      contact,
    });
  }

  static async createSubscription(
    planId: string,
    customerId?: string,
    totalCount: number = 12
  ): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    const params: any = {
      plan_id: planId,
      total_count: totalCount,
      quantity: 1,
    };
    
    if (customerId) {
      params.customer_id = customerId;
    }
    
    return await razorpay.subscriptions.create(params);
  }

  static async createOrder(
    amount: number,
    currency: string = 'INR',
    receipt?: string
  ): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    return await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
    });
  }

  static async cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = true): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    // Note: Razorpay cancellation might need to be handled differently based on their API
    return await (razorpay.subscriptions as any).cancel(subscriptionId, {
      cancel_at_cycle_end: cancelAtCycleEnd ? 1 : 0,
    });
  }

  static async getSubscription(subscriptionId: string): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    return await razorpay.subscriptions.fetch(subscriptionId);
  }

  static async createPlan(
    periodType: 'weekly' | 'monthly' | 'yearly',
    amount: number,
    currency: string = 'INR',
    description?: string
  ): Promise<any> {
    if (!razorpay) throw new Error('Razorpay not configured');
    return await razorpay.plans.create({
      period: periodType,
      interval: 1,
      item: {
        name: description || 'PDF Tools Subscription',
        amount: Math.round(amount * 100),
        currency,
      },
    });
  }

  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    if (!razorpay) return false;
    try {
      // Use the correct method name for Razorpay webhook validation
      return (razorpay as any).validateWebhookSignature(payload, signature, secret);
    } catch (error) {
      console.error('Razorpay webhook verification failed:', error);
      return false;
    }
  }
}

export function getPaymentProviderForRegion(countryCode: string): PaymentProvider[] {
  return paymentProviders.filter(provider =>
    provider.supportedRegions.includes(countryCode) ||
    provider.supportedRegions.includes('*')
  );
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function calculateDiscount(monthlyPrice: number, yearlyPrice: number): number {
  const yearlyMonthly = yearlyPrice / 12;
  const savings = monthlyPrice - yearlyMonthly;
  return Math.round((savings / monthlyPrice) * 100);
}