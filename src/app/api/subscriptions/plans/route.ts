import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionPlans } from '@/lib/subscription-service';

export async function GET(request: NextRequest) {
  try {
    const plans = await getSubscriptionPlans();
    
    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription plans' },
      { status: 500 }
    );
  }
}