import { UserPermissions, UserSubscription, SubscriptionPlan, PlanLimits } from './types';
import { getUserSubscription, getUserUsage } from './user-service';
import pool from './db';

export async function getUserPermissions(userId: number): Promise<UserPermissions> {
  try {
    const subscription = await getUserSubscription(userId);
    const usage = await getUserUsage(userId);

    // Default free tier permissions
    let permissions: UserPermissions = {
      canUseAdvancedFeatures: false,
      canSeeAds: true,
      maxFileSize: 10, // 10MB
      maxFilesPerOperation: 5,
      operationsPerMonth: 50,
      canUseOCR: false,
      canUseWatermark: false,
      canUseBatchProcessing: false,
      canUseCollaboration: false,
      canUseAPI: false,
    };

    if (subscription && subscription.status === 'active') {
      const planFeatures = subscription.plan?.features || {};
      const planLimits = subscription.plan?.limits as PlanLimits || {};

      permissions = {
        canUseAdvancedFeatures: planFeatures.advanced_tools || planFeatures.all_features || false,
        canSeeAds: planFeatures.ads !== false,
        maxFileSize: planLimits.maxFileSizeMb || 10,
        maxFilesPerOperation: planLimits.maxFilesPerOperation || 5,
        operationsPerMonth: planLimits.operationsPerMonth || 50,
        canUseOCR: planFeatures.ocr || planFeatures.all_features || false,
        canUseWatermark: planFeatures.watermark || planFeatures.all_features || false,
        canUseBatchProcessing: planFeatures.batch_processing || planFeatures.all_features || false,
        canUseCollaboration: planFeatures.collaboration || planFeatures.all_features || false,
        canUseAPI: planFeatures.api_access || planFeatures.all_features || false,
      };
    }

    return permissions;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    // Return default free tier permissions on error
    return {
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
    };
  }
}

export async function checkUsageLimits(
  userId: number,
  operationType: string,
  fileCount: number,
  totalFileSize: number
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const permissions = await getUserPermissions(userId);
    const usage = await getUserUsage(userId);
    const currentUsage = usage?.operationsCount || 0;

    // Check monthly operation limit
    if (currentUsage >= permissions.operationsPerMonth) {
      return {
        allowed: false,
        reason: `Monthly operation limit of ${permissions.operationsPerMonth} reached. Upgrade to continue.`,
      };
    }

    // Check file count limit
    if (fileCount > permissions.maxFilesPerOperation) {
      return {
        allowed: false,
        reason: `Maximum ${permissions.maxFilesPerOperation} files per operation allowed. Upgrade for higher limits.`,
      };
    }

    // Check file size limit (in bytes)
    const maxFileSizeBytes = permissions.maxFileSize * 1024 * 1024;
    if (totalFileSize > maxFileSizeBytes) {
      return {
        allowed: false,
        reason: `File size exceeds ${permissions.maxFileSize}MB limit. Upgrade for larger file support.`,
      };
    }

    // Check premium features
    const premiumOperations = ['ocr', 'watermark', 'signature', 'redact'];
    if (premiumOperations.includes(operationType) && !permissions.canUseAdvancedFeatures) {
      return {
        allowed: false,
        reason: `${operationType.toUpperCase()} is a premium feature. Upgrade to access advanced tools.`,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return {
      allowed: false,
      reason: 'Error checking usage limits. Please try again.',
    };
  }
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM subscription_plans WHERE is_active = true ORDER BY price_monthly ASC'
    );
    return result.rows;
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return [];
  }
}

export async function createSubscription(
  userId: number,
  planId: number,
  paymentProvider: 'stripe' | 'razorpay',
  externalSubscriptionId: string,
  externalCustomerId: string
): Promise<UserSubscription | null> {
  try {
    const result = await pool.query(
      `INSERT INTO user_subscriptions 
       (user_id, plan_id, payment_provider, external_subscription_id, external_customer_id, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [userId, planId, paymentProvider, externalSubscriptionId, externalCustomerId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
}

export async function updateSubscriptionStatus(
  externalSubscriptionId: string,
  status: string,
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
): Promise<void> {
  try {
    await pool.query(
      `UPDATE user_subscriptions 
       SET status = $1, current_period_start = $2, current_period_end = $3, updated_at = CURRENT_TIMESTAMP
       WHERE external_subscription_id = $4`,
      [status, currentPeriodStart, currentPeriodEnd, externalSubscriptionId]
    );
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
}

export async function cancelSubscription(
  userId: number,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  try {
    await pool.query(
      `UPDATE user_subscriptions 
       SET cancel_at_period_end = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND status = 'active'`,
      [cancelAtPeriodEnd, userId]
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);
  }
}

export function isPremiumFeature(feature: string): boolean {
  const premiumFeatures = [
    'ocr',
    'watermark',
    'signature',
    'redact',
    'batch_processing',
    'pdf_to_word',
    'pdf_to_excel',
    'advanced_compression',
    'form_fill',
    'page_reorder',
  ];
  
  return premiumFeatures.includes(feature);
}

export function getFeatureDisplayName(feature: string): string {
  const featureNames: Record<string, string> = {
    ocr: 'OCR Text Extraction',
    watermark: 'PDF Watermarking',
    signature: 'Digital Signatures',
    redact: 'PDF Redaction',
    batch_processing: 'Batch Processing',
    pdf_to_word: 'PDF to Word',
    pdf_to_excel: 'PDF to Excel',
    advanced_compression: 'Advanced Compression',
    form_fill: 'Form Field Filling',
    page_reorder: 'Page Reordering',
  };
  
  return featureNames[feature] || feature;
}