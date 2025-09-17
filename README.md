# PDF Tools Web Application - Revenue & Enhancement Model

A comprehensive full-stack web application for PDF manipulation with integrated revenue model, premium features, and scalable architecture. Built with Next.js, featuring dual payment integration (Stripe & Razorpay), ad-supported free tier, and extensible premium features.

![PDF Tools Homepage](https://github.com/user-attachments/assets/888f7626-36ef-408f-a9da-fef14838c31f)

## 🚀 New Features Overview

### Revenue Model
- **Ad-Supported Free Tier**: Google AdSense integration with cookie consent
- **Premium Subscriptions**: Stripe (global) + Razorpay (India/UPI) payment support
- **Feature Gating**: Smart component-based premium feature restrictions
- **Usage Tracking**: Comprehensive analytics and usage limits

### Premium Features
- **OCR Text Extraction**: Extract text from scanned PDFs
- **PDF Watermarking**: Add custom watermarks for document protection
- **Digital Signatures**: Sign PDFs with digital certificates
- **Advanced Processing**: Higher file size limits and batch operations
- **Priority Support**: Enhanced customer service for premium users

### Architecture Enhancements
- **NextAuth.js Integration**: Secure authentication with multiple providers
- **Database Schema**: Comprehensive user, subscription, and analytics tracking
- **Type Safety**: Full TypeScript implementation with strict types
- **Modular Components**: Reusable UI components for ads, payments, and feature gating

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: SHADCN UI, Tailwind CSS, Lucide Icons
- **Authentication**: NextAuth.js with Google OAuth
- **Payment Processing**: Stripe (global), Razorpay (India/UPI)
- **PDF Processing**: pdf-lib, jszip, tesseract.js (for OCR)
- **Database**: PostgreSQL with comprehensive schema
- **Deployment**: Vercel-ready with environment configuration

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Stripe account (for global payments)
- Razorpay account (for India/UPI payments)
- Google AdSense account (for ads)
- Google OAuth app (for authentication)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Vinay5095/PDF-Tools-Web-Application.git
cd PDF-Tools-Web-Application
npm install
```

### 2. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

### 3. Database Setup

Initialize your PostgreSQL database with the provided schema:

```bash
psql -U your_username -d your_database -f sql/init.sql
```

### 4. Configure Environment Variables

Edit `.env.local` with your actual credentials:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pdf_tools"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Stripe Payment Integration (Global)
STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# Razorpay Payment Integration (India/UPI)
RAZORPAY_KEY_ID="rzp_test_your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID="ca-pub-your-adsense-client-id"
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗 Architecture

### Core Components

```
src/
├── app/                           # Next.js app router
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth.js authentication
│   │   ├── pdf/                  # PDF processing endpoints
│   │   │   ├── merge/            # Basic PDF merge
│   │   │   ├── split/            # Basic PDF split
│   │   │   ├── compress/         # Basic PDF compression
│   │   │   └── ocr/              # Premium OCR processing
│   │   ├── subscriptions/        # Subscription management
│   │   └── user/                 # User data and permissions
│   ├── pricing/                  # Subscription plans page
│   ├── ocr/                      # Premium OCR feature
│   ├── watermark/                # Premium watermark feature
│   └── [existing-pages]/         # Original PDF tools
├── components/                    # Reusable React components
│   ├── ads/                      # Advertisement components
│   │   ├── AdBanner.tsx          # Google AdSense integration
│   │   └── CookieConsent.tsx     # GDPR compliance
│   ├── auth/                     # Authentication components
│   │   └── FeatureGate.tsx       # Premium feature gating
│   ├── payment/                  # Payment and pricing
│   │   └── PricingCards.tsx      # Subscription plans UI
│   ├── providers/                # Context providers
│   └── ui/                       # Base UI components
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth.js configuration
│   ├── payment-service.ts        # Stripe & Razorpay integration
│   ├── subscription-service.ts   # Subscription logic
│   ├── user-service.ts          # User management
│   ├── types.ts                 # TypeScript definitions
│   └── db.ts                    # Database connection
└── sql/                         # Database schema
    └── init.sql                 # Complete database setup
```

### Key Features Implementation

#### 1. Feature Gating System
The `FeatureGate` component automatically checks user permissions and subscription status:

```tsx
<FeatureGate feature="ocr" requiredPlan="Pro">
  {/* Premium content - only shown to subscribers */}
  <AdvancedOCRInterface />
</FeatureGate>
```

#### 2. Payment Provider Selection
Users can choose between Stripe (global) and Razorpay (India) based on their location:

```tsx
<PricingCards
  plans={subscriptionPlans}
  onSelectPlan={(plan, billing) => handlePayment(plan, billing)}
/>
```

#### 3. Usage Tracking & Limits
Every PDF operation is tracked with configurable limits:

```typescript
// Check if user can perform operation
const limitCheck = await checkUsageLimits(userId, 'ocr', fileCount, totalSize);
if (!limitCheck.allowed) {
  return NextResponse.json({ error: limitCheck.reason }, { status: 429 });
}
```

#### 4. Ad Integration
Ads are conditionally displayed based on subscription status:

```tsx
<AdBanner
  slot="your-ad-slot-id"
  format="rectangle"
  // Automatically hidden for premium users
/>
```

## 🎯 Subscription Plans

### Free Tier
- Basic PDF tools (merge, split, compress, info)
- 10MB file size limit
- 50 operations per month
- 5 files per operation
- Ad-supported experience

### Pro Plan ($9.99/month)
- All basic features
- Advanced tools (OCR, watermarking, signatures)
- 100MB file size limit
- 1,000 operations per month
- 50 files per operation
- Ad-free experience
- Priority support

### Business Plan ($29.99/month)
- All Pro features
- Team collaboration
- API access
- 500MB file size limit
- 10,000 operations per month
- 200 files per operation
- Advanced analytics
- White-label options

## 🔧 API Endpoints

### Authentication
- `GET|POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `GET /api/user/subscription` - Get user subscription status
- `GET /api/user/permissions` - Check feature permissions

### PDF Processing
- `POST /api/pdf/merge` - Merge multiple PDFs (free)
- `POST /api/pdf/split` - Split PDF into pages (free)
- `POST /api/pdf/compress` - Compress PDF file (free)
- `POST /api/pdf/info` - Get PDF information (free)
- `POST /api/pdf/ocr` - Extract text with OCR (premium)

### Subscription Management
- `GET /api/subscriptions/plans` - Get available plans
- `POST /api/subscriptions/create` - Create new subscription
- `PUT /api/subscriptions/cancel` - Cancel subscription

## 🚦 Usage Limits & Quotas

The application implements comprehensive usage tracking:

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| File Size | 10MB | 100MB | 500MB |
| Operations/Month | 50 | 1,000 | 10,000 |
| Files/Operation | 5 | 50 | 200 |
| OCR | ❌ | ✅ | ✅ |
| Watermarks | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Team Features | ❌ | ❌ | ✅ |

## 🔐 Security Features

- **Secure File Processing**: Files are processed in memory and never stored
- **Authentication**: NextAuth.js with secure session management
- **Payment Security**: PCI-compliant payment processing via Stripe/Razorpay
- **Data Protection**: GDPR-compliant cookie consent and data handling
- **Rate Limiting**: Configurable limits to prevent abuse

## 🌐 Internationalization

The application is prepared for multiple languages and regions:

- **Payment Localization**: Automatic currency detection
- **UI Components**: Ready for i18n integration
- **Regional Features**: Different payment methods by region

## 📊 Analytics & Monitoring

### User Analytics
- File processing operations
- Feature usage patterns
- Subscription conversion rates
- Geographic usage distribution

### System Monitoring
- API response times
- Error rates and logging
- Resource usage tracking
- Payment processing metrics

## 🔄 Development Workflow

### Adding New Premium Features

1. **Create Feature Component**:
   ```tsx
   // src/app/new-feature/page.tsx
   export default function NewFeaturePage() {
     return (
       <FeatureGate feature="new-feature" requiredPlan="Pro">
         <YourFeatureComponent />
       </FeatureGate>
     );
   }
   ```

2. **Add API Route**:
   ```typescript
   // src/app/api/pdf/new-feature/route.ts
   export async function POST(request: NextRequest) {
     // Check permissions and process
   }
   ```

3. **Update Subscription Service**:
   ```typescript
   // Add to isPremiumFeature function
   const premiumFeatures = [...existing, 'new-feature'];
   ```

### Testing Payments

1. **Stripe Test Mode**: Use test card `4242 4242 4242 4242`
2. **Razorpay Test Mode**: Use test credentials from dashboard
3. **Webhook Testing**: Use ngrok for local webhook testing

## 🚀 Deployment

### Environment Configuration

1. **Production Environment Variables**: Set all required variables in your hosting platform
2. **Database Migration**: Run the SQL schema on your production database
3. **Payment Webhooks**: Configure webhook URLs in Stripe and Razorpay dashboards
4. **Domain Configuration**: Update NEXTAUTH_URL for production

### Vercel Deployment

The application is optimized for Vercel deployment:

```bash
npm run build
npm run start
```

### Docker Support

```dockerfile
# Dockerfile included for containerized deployment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow TypeScript conventions**: Ensure type safety
4. **Test thoroughly**: Include both unit and integration tests
5. **Submit Pull Request**: Include comprehensive description

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Extended configuration for Next.js
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Stripe & Razorpay**: For robust payment processing
- **SHADCN UI**: For beautiful, accessible components
- **pdf-lib**: For powerful PDF manipulation capabilities

## 🛣 Roadmap

### Phase 1 (Current)
- [x] Basic revenue model implementation
- [x] Premium feature gating
- [x] Dual payment integration
- [x] Usage tracking and limits

### Phase 2 (Next)
- [ ] Advanced PDF features (signatures, forms)
- [ ] Team collaboration and workspaces
- [ ] API for third-party integrations
- [ ] Mobile app development

### Phase 3 (Future)
- [ ] AI-powered PDF processing
- [ ] Enterprise SSO integration
- [ ] White-label solutions
- [ ] Advanced analytics dashboard

## 📞 Support

For support and questions:

- **Email**: support@pdftools.com
- **Documentation**: [docs.pdftools.com](https://docs.pdftools.com)
- **Community**: [GitHub Discussions](https://github.com/Vinay5095/PDF-Tools-Web-Application/discussions)

---

**Built with ❤️ by the PDF Tools team**