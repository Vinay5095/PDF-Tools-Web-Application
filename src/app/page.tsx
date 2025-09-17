"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileArchive, Scissors, FileImage, Download, Info } from "lucide-react";

const pdfTools = [
  {
    icon: FileArchive,
    title: "Merge PDF",
    description: "Combine multiple PDF files into one",
    href: "/merge"
  },
  {
    icon: Scissors,
    title: "Split PDF", 
    description: "Split a PDF into multiple files",
    href: "/split"
  },
  {
    icon: FileArchive,
    title: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/compress"
  },
  {
    icon: FileImage,
    title: "PDF to Images",
    description: "Convert PDF pages to images",
    href: "/pdf-to-images"
  },
  {
    icon: FileText,
    title: "Images to PDF",
    description: "Convert images to PDF",
    href: "/images-to-pdf"
  },
  {
    icon: Info,
    title: "PDF Info",
    description: "Get PDF document information",
    href: "/pdf-info"
  }
];

export default function Home() {
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
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
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

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className="w-full" 
                      onClick={() => window.location.href = tool.href}
                    >
                      Select Files
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

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