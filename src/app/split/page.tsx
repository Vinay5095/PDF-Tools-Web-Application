"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Scissors } from 'lucide-react';

export default function SplitPDFPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length !== 1) {
      alert('Please select exactly 1 PDF file to split');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      // Default: split each page into separate PDF
      formData.append('ranges', '');

      const response = await fetch('/api/pdf/split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to split PDF');
      }

      // Download the split PDFs
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Check if it's a ZIP file or single PDF
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/zip')) {
        a.download = 'split_pdfs.zip';
      } else {
        a.download = 'split.pdf';
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to split PDF');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-5 w-5" />
                <FileText className="h-8 w-8" />
                <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
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
              <Scissors className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Split PDF Files</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Split a PDF into multiple documents. Each page will be extracted into a separate PDF file.
            </p>
          </div>

          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>How to split PDFs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Upload a PDF file by dragging it here or clicking to browse</li>
                <li>The PDF will be split with each page as a separate file</li>
                <li>Click &quot;Process Files&quot; to split your PDF</li>
                <li>Download the ZIP file containing all split PDF pages</li>
              </ol>
            </CardContent>
          </Card>

          {/* File Upload */}
          <FileUpload
            accept=".pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            onUpload={handleUpload}
            isLoading={isLoading}
          />

          {/* Back to Tools */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}