"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileArchive, Scissors, FileImage, Download, Info, User, LogOut, Eye, Shield, Crown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import AdBanner from "@/components/ads/AdBanner";
import Link from "next/link";

const pdfTools = [
  {
    icon: FileArchive,
    title: "Merge PDF",
    description: "Combine multiple PDF files into one",
    href: "/merge",
    isPremium: false
  },
  {
    icon: Scissors,
    title: "Split PDF", 
    description: "Split a PDF into multiple files",
    href: "/split",
    isPremium: false
  },
  {
    icon: FileArchive,
    title: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress",
    isPremium: false
  },
  {
    icon: FileImage,
    title: "PDF to Images",
    description: "Convert PDF pages to images",
    href: "/pdf-to-images",
    isPremium: false
  },
  {
    icon: FileText,
    title: "Images to PDF",
    description: "Convert images to PDF",
    href: "/images-to-pdf",
    isPremium: false
  },
  {
    icon: Info,
    title: "PDF Info",
    description: "Get PDF document information",
    href: "/pdf-info",
    isPremium: false
  },
  {
    icon: Eye,
    title: "OCR Text Extraction",
    description: "Extract text from scanned PDFs",
    href: "/ocr",
    isPremium: true
  },
  {
    icon: Shield,
    title: "PDF Watermark",
    description: "Add watermarks to protect your PDFs",
    href: "/watermark",
    isPremium: true
  },
  {
    icon: Crown,
    title: "Digital Signature",
    description: "Sign PDFs with digital certificates",
    href: "/signature",
    isPremium: true
  }
];

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
            </div>
            <nav className="flex items-center space-x-4" role="navigation" aria-label="Main navigation">
              <div className="hidden md:flex space-x-8">
                <span className="text-blue-600 font-medium" aria-current="page">Home</span>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              </div>
              <div className="flex items-center space-x-2">
                {session ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Hi, {session.user?.name || session.user?.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => signOut()}
                      className="flex items-center space-x-1"
                      aria-label="Sign out of your account"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => signIn()}
                    className="flex items-center space-x-1"
                    aria-label="Sign in to your account"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Sign In</span>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Every tool you need to work with PDFs in one place
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Free, secure, and easy to use. Work with PDF files directly in your browser - 
            no downloads or installations required.
          </p>
        </div>
      </section>

      {/* Ad Banner - Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner
          slot="1234567890"
          format="horizontal"
          className="flex justify-center"
        />
      </div>

      {/* Tools Grid */}
      <section className="py-16" aria-labelledby="tools-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="tools-heading" className="sr-only">Available PDF Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${tool.isPremium ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : ''}`}
                  role="article"
                  aria-labelledby={`tool-${index}-title`}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      tool.isPremium ? 'bg-gradient-to-br from-purple-500 to-blue-600' : 'bg-blue-100'
                    }`} aria-hidden="true">
                      <Icon className={`h-8 w-8 ${tool.isPremium ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CardTitle id={`tool-${index}-title`} className="text-lg">{tool.title}</CardTitle>
                      {tool.isPremium && (
                        <Crown className="h-4 w-4 text-purple-600" aria-label="Premium feature" />
                      )}
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                    {tool.isPremium && (
                      <div className="text-xs text-purple-600 font-medium" aria-label="This is a premium feature">Premium Feature</div>
                    )}
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className={`w-full ${tool.isPremium ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}`}
                      onClick={() => window.location.href = tool.href}
                      aria-label={`${tool.isPremium ? 'Try premium feature' : 'Use'} ${tool.title}`}
                    >
                      {tool.isPremium ? 'Try Premium' : 'Select Files'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Features Highlight */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50" aria-labelledby="premium-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6" aria-hidden="true">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 id="premium-heading" className="text-3xl font-bold text-gray-900 mb-4">Unlock Premium Features</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take your PDF processing to the next level with advanced features designed for power users and professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-purple-200 bg-white">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">OCR Text Extraction</CardTitle>
                <CardDescription>Extract text from scanned PDFs and images with high accuracy</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Digital Signatures</CardTitle>
                <CardDescription>Sign PDFs with digital certificates for legal compliance</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <FileArchive className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-lg">Batch Processing</CardTitle>
                <CardDescription>Process multiple files at once with advanced automation</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/pricing">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                aria-label="View premium pricing plans"
              >
                <Crown className="h-5 w-5 mr-2" aria-hidden="true" />
                Explore Premium Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner - Middle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner
          slot="0987654321"
          format="rectangle"
          className="flex justify-center"
        />
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our PDF Tools?</h3>
            <p className="text-lg text-gray-600">Secure, fast, and completely free PDF processing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">100% Secure</h4>
              <p className="text-gray-600">Your files are processed locally and deleted after use</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <FileArchive className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Process your PDFs in seconds with our optimized tools</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Download className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">No Registration</h4>
              <p className="text-gray-600">Use all tools without creating an account</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
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