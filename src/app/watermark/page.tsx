"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';
import FeatureGate from '@/components/auth/FeatureGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Shield, Download } from 'lucide-react';

export default function WatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleUpload = async (uploadFiles: File[]) => {
    if (uploadFiles.length === 0) return;

    setIsLoading(true);
    
    try {
      // This would make an API call to add watermarks
      alert('Watermark feature coming soon! This is a demo of the premium feature gating system.');
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('Failed to add watermark to PDF');
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
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">PDF Watermark</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Protect your PDFs by adding custom watermarks. Add text or image watermarks to secure your documents and prevent unauthorized use.
            </p>
          </div>

          {/* Feature Gate */}
          <FeatureGate
            feature="watermark"
            requiredPlan="Pro"
            fallback={
              <div className="space-y-8">
                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>How to add watermarks to PDFs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Upload a PDF file by dragging it here or clicking to browse</li>
                      <li>Customize your watermark text, position, and transparency</li>
                      <li>Click &ldquo;Process Files&rdquo; to add the watermark</li>
                      <li>Download your watermarked PDF file</li>
                    </ol>
                  </CardContent>
                </Card>

                {/* Watermark Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Watermark Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter watermark text"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Center</option>
                          <option>Top-Left</option>
                          <option>Top-Right</option>
                          <option>Bottom-Left</option>
                          <option>Bottom-Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transparency
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>50%</option>
                          <option>25%</option>
                          <option>75%</option>
                          <option>100%</option>
                        </select>
                      </div>
                    </div>
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

                {/* Feature Benefits */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardHeader>
                    <CardTitle>Why Use PDF Watermarks?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Protect your documents from unauthorized use
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Add copyright notices and branding
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Mark documents as confidential or draft
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Support for both text and image watermarks
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        Customizable position and transparency
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            }
          >
            {/* This content is shown only for premium users */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Premium Watermark Feature</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-600 font-medium">
                    ✅ You have access to premium watermark features!
                  </p>
                </CardContent>
              </Card>
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