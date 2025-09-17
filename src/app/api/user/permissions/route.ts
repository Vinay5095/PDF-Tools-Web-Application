import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserPermissions } from '@/lib/subscription-service';
import { isPremiumFeature } from '@/lib/subscription-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature');
    
    if (!session?.user?.id) {
      // Anonymous users only have access to basic features
      const hasAccess = !feature || !isPremiumFeature(feature);
      return NextResponse.json({
        hasAccess,
        permissions: {
          canUseAdvancedFeatures: false,
          canSeeAds: true,
          maxFileSize: 10,
          maxFilesPerOperation: 5,
          operationsPerMonth: 50,
          canUseOCR: false,
          canUseWatermark: false,
          canUseBatchProcessing: false,
          canUseCollaboration: false,
          canUseAPI: false,
        },
      });
    }

    const permissions = await getUserPermissions(parseInt(session.user.id));
    
    let hasAccess = true;
    if (feature) {
      switch (feature) {
        case 'ocr':
          hasAccess = permissions.canUseOCR;
          break;
        case 'watermark':
          hasAccess = permissions.canUseWatermark;
          break;
        case 'batch_processing':
          hasAccess = permissions.canUseBatchProcessing;
          break;
        case 'collaboration':
          hasAccess = permissions.canUseCollaboration;
          break;
        case 'api':
          hasAccess = permissions.canUseAPI;
          break;
        default:
          hasAccess = !isPremiumFeature(feature) || permissions.canUseAdvancedFeatures;
      }
    }
    
    return NextResponse.json({
      hasAccess,
      permissions,
    });
  } catch (error) {
    console.error('Error getting permissions:', error);
    return NextResponse.json(
      { error: 'Failed to get permissions' },
      { status: 500 }
    );
  }
}