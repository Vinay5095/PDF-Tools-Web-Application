# Contributing to PDF Tools Web Application

Thank you for your interest in contributing to PDF Tools! We welcome contributions from developers of all skill levels. This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### Local Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/PDF-Tools-Web-Application.git
   cd PDF-Tools-Web-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠 Development Workflow

### Branch Management

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow our coding standards (see below)
   - Test thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add OCR text extraction feature
fix: resolve PDF merge memory leak
docs: update API documentation
style: format code with prettier
refactor: optimize PDF compression algorithm
test: add unit tests for merge functionality
chore: update dependencies
```

## 📋 Coding Standards

### TypeScript Guidelines

- **Use TypeScript strictly** - All new code must be TypeScript
- **Enable strict mode** - Already configured in `tsconfig.json`
- **Provide proper type annotations** for all public APIs
- **Use interfaces** for object types
- **Avoid `any` type** - Use proper types or `unknown`

Example:
```typescript
// ✅ Good
interface PDFProcessingOptions {
  compression: boolean;
  quality: number;
}

async function processPDF(
  file: Buffer, 
  options: PDFProcessingOptions
): Promise<Buffer> {
  // Implementation
}

// ❌ Avoid
function processPDF(file: any, options: any): any {
  // Implementation
}
```

### React/Next.js Guidelines

- **Use functional components** with hooks
- **Prefer server components** when possible (Next.js App Router)
- **Use proper semantic HTML** for accessibility
- **Follow React best practices** for state management

Example:
```tsx
// ✅ Good
interface PDFUploaderProps {
  onUpload: (file: File) => void;
  maxSize?: number;
}

export default function PDFUploader({ onUpload, maxSize = 25 }: PDFUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <div 
      role="button"
      aria-label="Upload PDF file"
      className="upload-area"
    >
      {/* Implementation */}
    </div>
  );
}
```

### Styling Guidelines

- **Use Tailwind CSS** for styling
- **Follow mobile-first approach**
- **Use consistent spacing scale**
- **Maintain design system consistency**

Example:
```tsx
// ✅ Good
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-2xl font-bold text-gray-900 mb-4">
    PDF Tools
  </h1>
</div>

// ❌ Avoid custom CSS when Tailwind classes exist
<div style={{ maxWidth: '896px', margin: '0 auto' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
    PDF Tools
  </h1>
</div>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Write unit tests** for all PDF processing functions
- **Test edge cases** and error conditions
- **Use descriptive test names**
- **Mock external dependencies**

Example:
```typescript
// tests/pdf-processor.test.ts
import { PDFProcessor } from '../src/lib/pdf-processor';

describe('PDFProcessor', () => {
  describe('mergePDFs', () => {
    it('should merge multiple PDF files into one', async () => {
      const file1 = await fs.readFile('test-file-1.pdf');
      const file2 = await fs.readFile('test-file-2.pdf');
      
      const result = await PDFProcessor.mergePDFs([file1, file2]);
      
      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should throw error when no files provided', async () => {
      await expect(PDFProcessor.mergePDFs([])).rejects.toThrow();
    });
  });
});
```

## 📝 Documentation

### JSDoc Comments

All public functions must have JSDoc comments:

```typescript
/**
 * Merges multiple PDF files into a single document
 * @param pdfFiles - Array of PDF file buffers to merge
 * @returns Promise resolving to merged PDF buffer
 * @throws Error when no files provided or merge fails
 * @example
 * ```typescript
 * const file1 = await fs.readFile('document1.pdf');
 * const file2 = await fs.readFile('document2.pdf');
 * const merged = await PDFProcessor.mergePDFs([file1, file2]);
 * ```
 */
static async mergePDFs(pdfFiles: Buffer[]): Promise<Buffer> {
  // Implementation
}
```

### README Updates

When adding new features:
- Update the feature list in README.md
- Add usage examples if applicable
- Update screenshots if UI changes are significant

## 🚦 Code Quality

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### Pre-commit Checks

Before submitting a PR, ensure:
- [ ] All tests pass
- [ ] No linting errors
- [ ] Code is properly formatted
- [ ] TypeScript compiles without errors
- [ ] Build succeeds

```bash
npm run build
npm run lint
npm test
```

## 🔧 Adding New Features

### PDF Processing Features

1. **Add function to `src/lib/pdf-processor.ts`**
2. **Write comprehensive tests**
3. **Add API endpoint in `src/app/api/pdf/`**
4. **Create UI component in `src/app/[feature]/`**
5. **Update navigation and routing**

### UI Components

1. **Create in `src/components/`**
2. **Use TypeScript with proper interfaces**
3. **Follow accessibility guidelines**
4. **Add to Storybook if applicable**

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Browser and device information**
- **Screenshots** if applicable
- **Error messages** from console

## 💡 Feature Requests

For new feature suggestions:

- **Check existing issues** first
- **Describe the use case** clearly
- **Explain the expected benefit**
- **Consider implementation complexity**
- **Discuss in GitHub Discussions** for larger features

## 🚀 Deployment

The application is automatically deployed to Vercel when changes are merged to the main branch.

### Environment Variables

Required for production:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `RAZORPAY_KEY_SECRET`
- `DATABASE_URL`

## 🤝 Community Guidelines

- **Be respectful** and inclusive
- **Help others** learn and grow
- **Provide constructive feedback**
- **Follow the code of conduct**
- **Ask questions** when unsure

## 📞 Getting Help

- **GitHub Discussions** - For questions and community support
- **GitHub Issues** - For bug reports and feature requests
- **Documentation** - Check the README and code comments
- **Discord** - Join our community chat (link in README)

## 🏆 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- GitHub contributor statistics

Thank you for contributing to PDF Tools! 🎉