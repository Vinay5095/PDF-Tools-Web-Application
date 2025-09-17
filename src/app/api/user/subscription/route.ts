import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserSubscription } from '@/lib/user-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { hasActiveSubscription: false, plan: null },
        { status: 200 }
      );
    }

    const subscription = await getUserSubscription(parseInt(session.user.id));
    
    return NextResponse.json({
      hasActiveSubscription: subscription?.status === 'active',
      subscription,
      plan: subscription?.plan || null,
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}