"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, FileArchive } from 'lucide-react';

export default function CompressPDFPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: string;
  } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    setCompressionInfo(null);
  };

  const handleUpload = async (files: File[]) => {
    if (files.length !== 1) {
      alert('Please select exactly 1 PDF file to compress');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/pdf/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to compress PDF');
      }

      // Get compression info from headers
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
      const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || '0');
      const ratio = response.headers.get('X-Compression-Ratio') || '0%';

      setCompressionInfo({
        originalSize,
        compressedSize,
        ratio
      });

      // Download the compressed PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert(error instanceof Error ? error.message : 'Failed to compress PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <FileArchive className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compress PDF Files</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Reduce PDF file size while maintaining quality. Perfect for email attachments or saving storage space.
            </p>
          </div>

          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>How to compress PDFs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Upload a PDF file by dragging it here or clicking to browse</li>
                <li>Click &quot;Process Files&quot; to compress your PDF</li>
                <li>Download your compressed PDF file</li>
                <li>The compression ratio will be displayed after processing</li>
              </ol>
            </CardContent>
          </Card>

          {/* Compression Info */}
          {compressionInfo && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Compression Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Original Size</p>
                    <p className="text-lg font-semibold">{formatFileSize(compressionInfo.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Compressed Size</p>
                    <p className="text-lg font-semibold">{formatFileSize(compressionInfo.compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Size Reduction</p>
                    <p className="text-lg font-semibold text-green-600">{compressionInfo.ratio}</p>
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