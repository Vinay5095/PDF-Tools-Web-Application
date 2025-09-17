"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import FeatureGate from '@/components/auth/FeatureGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Eye, Download } from 'lucide-react';

export default function OCRPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setExtractedText('');
  };

  const handleUpload = async (uploadFiles: File[]) => {
    if (uploadFiles.length === 0) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/pdf/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from PDF');
      }

      const data = await response.json();
      setExtractedText(data.text);
      
    } catch (error) {
      console.error('Error extracting text:', error);
      alert(error instanceof Error ? error.message : 'Failed to extract text from PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadText = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDF Tools</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Eye className="h-10 w-10 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">OCR Text Extraction</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Extract text from scanned PDFs and images using advanced OCR technology. 
              Convert images to searchable and editable text.
            </p>
          </div>

          {/* Feature Gate */}
          <FeatureGate
            feature="ocr"
            requiredPlan="Pro"
            fallback={
              <div className="space-y-8">
                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>How to extract text from PDFs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Upload a PDF file by dragging it here or clicking to browse</li>
                      <li>Our OCR engine will analyze the document and extract all text</li>
                      <li>Click &ldquo;Process Files&rdquo; to start text extraction</li>
                      <li>Download the extracted text as a .txt file</li>
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

                {/* Extracted Text Display */}
                {extractedText && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Extracted Text</span>
                        <Button onClick={downloadText} size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800">
                          {extractedText}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Feature Benefits */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle>Why Use OCR Text Extraction?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        Convert scanned documents into editable text
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        Extract text from images and photos
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        Make documents searchable and accessible
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        Support for multiple languages
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        High accuracy with advanced AI technology
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            }
          >
            <div className="space-y-8">
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>How to extract text from PDFs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Upload a PDF file by dragging it here or clicking to browse</li>
                    <li>Our OCR engine will analyze the document and extract all text</li>
                    <li>Click &ldquo;Process Files&rdquo; to start text extraction</li>
                    <li>Download the extracted text as a .txt file</li>
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

              {/* Extracted Text Display */}
              {extractedText && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Extracted Text</span>
                      <Button onClick={downloadText} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {extractedText}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </FeatureGate>

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