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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
                <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
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
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => signIn()}
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow duration-200 cursor-pointer ${tool.isPremium ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' : ''}`}>
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      tool.isPremium ? 'bg-gradient-to-br from-purple-500 to-blue-600' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-8 w-8 ${tool.isPremium ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      {tool.isPremium && (
                        <Crown className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                    {tool.isPremium && (
                      <div className="text-xs text-purple-600 font-medium">Premium Feature</div>
                    )}
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className={`w-full ${tool.isPremium ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}`}
                      onClick={() => window.location.href = tool.href}
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

      {/* Ad Banner - Middle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner
          slot="0987654321"
          format="rectangle"
          className="flex justify-center"
        />
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our PDF Tools?</h3>
            <p className="text-lg text-gray-600">Secure, fast, and completely free PDF processing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">100% Secure</h4>
              <p className="text-gray-600">Your files are processed locally and deleted after use</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileArchive className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Process your PDFs in seconds with our optimized tools</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
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