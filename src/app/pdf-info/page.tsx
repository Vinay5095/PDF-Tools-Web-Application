"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Info } from 'lucide-react';

interface PDFInfo {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  fileSize: number;
  fileSizeFormatted: string;
}

export default function PDFInfoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setPdfInfo(null);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length !== 1) {
      alert('Please select exactly 1 PDF file to analyze');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/pdf/info', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get PDF information');
      }

      const result = await response.json();
      setPdfInfo(result.info);
      
    } catch (error) {
      console.error('Error getting PDF info:', error);
      alert(error instanceof Error ? error.message : 'Failed to get PDF information');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
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
              <Info className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">PDF Information</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get detailed information about your PDF document including metadata, page count, and file properties.
            </p>
          </div>

          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>How to get PDF information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Upload a PDF file by dragging it here or clicking to browse</li>
                <li>Click &quot;Process Files&quot; to analyze your PDF</li>
                <li>View the detailed information about your document</li>
              </ol>
            </CardContent>
          </Card>

          {/* PDF Info Display */}
          {pdfInfo && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>PDF Document Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">File Size</label>
                      <p className="text-lg">{pdfInfo.fileSizeFormatted}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Page Count</label>
                      <p className="text-lg">{pdfInfo.pageCount} pages</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Title</label>
                      <p className="text-lg">{pdfInfo.title || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Author</label>
                      <p className="text-lg">{pdfInfo.author || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subject</label>
                      <p className="text-lg">{pdfInfo.subject || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Creator</label>
                      <p className="text-lg">{pdfInfo.creator || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Producer</label>
                      <p className="text-lg">{pdfInfo.producer || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Creation Date</label>
                      <p className="text-lg">{formatDate(pdfInfo.creationDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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