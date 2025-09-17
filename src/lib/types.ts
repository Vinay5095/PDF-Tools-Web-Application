// Core types for the enhanced PDF Tools application

export interface User {
  id: number;
  email: string;
  name?: string;
  provider: 'email' | 'google' | 'github';
  providerId?: string;
  emailVerified: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly: number;
  features: Record<string, boolean>;
  limits: PlanLimits;
  isActive: boolean;
  createdAt: Date;
}

export interface PlanLimits {
  maxFileSizeMb: number;
  operationsPerMonth: number;
  maxFilesPerOperation: number;
  teamMembers?: number;
}

export interface UserSubscription {
  id: number;
  userId: number;
  planId: number;
  paymentProvider: 'stripe' | 'razorpay';
  externalSubscriptionId?: string;
  externalCustomerId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
  plan?: SubscriptionPlan;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  subscriptionId?: number;
  paymentProvider: 'stripe' | 'razorpay';
  externalPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileOperation {
  id: number;
  userId?: number;
  sessionId?: string;
  operationType: 'merge' | 'split' | 'compress' | 'info' | 'convert' | 'ocr' | 'watermark';
  fileCount: number;
  totalFileSize: number;
  processingTime?: number;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface UserUsage {
  id: number;
  userId: number;
  monthYear: Date;
  operationsCount: number;
  totalFileSize: number;
  premiumOperationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: number;
  workspaceId: number;
  userId: number;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: Record<string, boolean>;
  invitedBy?: number;
  joinedAt: Date;
}

export interface WorkflowTemplate {
  id: number;
  name: string;
  description?: string;
  workspaceId?: number;
  createdBy?: number;
  templateData: Record<string, any>;
  isPublic: boolean;
  tags: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: number;
  userId: number;
  keyHash: string;
  name: string;
  permissions: Record<string, boolean>;
  rateLimit: number;
  lastUsed?: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Webhook {
  id: number;
  userId: number;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastTriggered?: Date;
  failureCount: number;
  createdAt: Date;
}

export interface Referral {
  id: number;
  referrerId: number;
  referredId?: number;
  referralCode: string;
  status: 'pending' | 'completed' | 'paid';
  rewardAmount?: number;
  rewardCurrency: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface AnalyticsEvent {
  id: number;
  userId?: number;
  sessionId?: string;
  eventName: string;
  properties: Record<string, any>;
  pageUrl?: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Feature gating types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  requiredPlan?: string[];
  description?: string;
}

export interface UserPermissions {
  canUseAdvancedFeatures: boolean;
  canSeeAds: boolean;
  maxFileSize: number;
  maxFilesPerOperation: number;
  operationsPerMonth: number;
  canUseOCR: boolean;
  canUseWatermark: boolean;
  canUseBatchProcessing: boolean;
  canUseCollaboration: boolean;
  canUseAPI: boolean;
}

// Payment types
export interface StripeConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

export interface PaymentProvider {
  name: 'stripe' | 'razorpay';
  displayName: string;
  supportedRegions: string[];
  supportedMethods: string[];
  config: StripeConfig | RazorpayConfig;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// File processing types
export interface ProcessingOptions {
  operationType: string;
  userId?: number;
  sessionId?: string;
  isPremium: boolean;
  limits: PlanLimits;
}

export interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
  fileSize: number;
}