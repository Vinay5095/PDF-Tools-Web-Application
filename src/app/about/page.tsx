"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Shield, Zap, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <span className="text-blue-600 font-medium">About</span>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About PDF Tools</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your comprehensive solution for all PDF manipulation needs. Fast, secure, and free.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We believe that powerful PDF tools should be accessible to everyone. Our mission is to provide 
                a comprehensive suite of PDF manipulation tools that are fast, secure, and completely free to use. 
                Whether you&apos;re a student, professional, or business owner, our tools help you work with PDFs 
                efficiently without compromising on quality or security.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>100% Secure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All file processing happens locally in your browser. Your documents never leave your device, 
                  ensuring complete privacy and security for your sensitive information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>Lightning Fast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our optimized algorithms ensure that your PDFs are processed quickly and efficiently. 
                  Most operations complete in seconds, saving you valuable time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>User-Friendly</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Designed with simplicity in mind. No complex interfaces or confusing options - 
                  just upload your files and get the results you need.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span>Comprehensive Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  From basic operations like merge and split to advanced features like OCR and digital signatures, 
                  we provide all the tools you need for complete PDF management.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Features</CardTitle>
              <CardDescription>
                All the essential PDF tools you need, completely free
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Free Tools</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Merge multiple PDFs into one</li>
                    <li>• Split PDFs into separate files</li>
                    <li>• Compress PDFs to reduce file size</li>
                    <li>• Extract PDF information and metadata</li>
                    <li>• Convert PDFs to images</li>
                    <li>• Convert images to PDF</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Premium Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• OCR text extraction from scanned PDFs</li>
                    <li>• Add watermarks to PDFs</li>
                    <li>• Digital signature support</li>
                    <li>• Batch processing capabilities</li>
                    <li>• Priority processing</li>
                    <li>• Advanced compression algorithms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Built with Modern Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Our application is built using cutting-edge web technologies to ensure the best performance, 
                security, and user experience:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>• Next.js 15</div>
                <div>• React 19</div>
                <div>• TypeScript</div>
                <div>• Tailwind CSS</div>
                <div>• PDF-lib</div>
                <div>• NextAuth.js</div>
                <div>• Stripe & Razorpay</div>
                <div>• PostgreSQL</div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Tools */}
          <div className="text-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
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