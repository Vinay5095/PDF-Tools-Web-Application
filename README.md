# PDF Tools Web Application

A full-stack web application for PDF manipulation, built with Next.js, SHADCN UI, and PostgreSQL. Similar to ilovePDF.com, this application provides essential PDF tools in a clean, modern interface.

![PDF Tools Homepage](https://github.com/user-attachments/assets/c4b199a6-6c77-435a-9c71-09fe5247b736)

## Features

- **PDF Merge**: Combine multiple PDF files into a single document
- **PDF Split**: Split a PDF into individual pages or custom ranges
- **PDF Compress**: Reduce PDF file size while maintaining quality
- **PDF Info**: Extract metadata and document information from PDFs
- **Drag & Drop Upload**: Easy file upload with visual feedback
- **Responsive Design**: Works on desktop and mobile devices
- **No Registration Required**: Use all tools without creating an account
- **100% Secure**: Files are processed locally and not stored

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: SHADCN UI, Tailwind CSS, Lucide Icons
- **PDF Processing**: pdf-lib, jszip
- **File Upload**: react-dropzone
- **Database**: PostgreSQL (ready for future features)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Vinay5095/PDF-Tools-Web-Application.git
cd PDF-Tools-Web-Application
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

- `POST /api/pdf/merge` - Merge multiple PDF files
- `POST /api/pdf/split` - Split PDF into separate files
- `POST /api/pdf/compress` - Compress PDF file size
- `POST /api/pdf/info` - Get PDF metadata and information

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/pdf/           # API routes for PDF operations
│   ├── compress/          # PDF compression page
│   ├── merge/             # PDF merge page
│   ├── split/             # PDF split page
│   ├── pdf-info/          # PDF info page
│   └── page.tsx           # Homepage
├── components/            # Reusable React components
│   ├── ui/               # SHADCN UI components
│   └── FileUpload.tsx    # File upload component
└── lib/                  # Utility functions
    ├── pdf-processor.ts  # PDF processing logic
    ├── db.ts            # Database connection
    └── utils.ts         # General utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by ilovePDF.com
- Built with [Next.js](https://nextjs.org/)
- UI components from [SHADCN UI](https://ui.shadcn.com/)
- PDF processing powered by [pdf-lib](https://pdf-lib.js.org/)

## Future Enhancements

- [ ] PDF to Image conversion
- [ ] Image to PDF conversion
- [ ] User authentication and file history
- [ ] Advanced PDF editing features
- [ ] PDF watermarking
- [ ] OCR text extraction
- [ ] Batch processing capabilities