import { NextRequest, NextResponse } from 'next/server';
import { PDFProcessor } from '@/lib/pdf-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging' },
        { status: 400 }
      );
    }

    // Convert files to buffers
    const pdfBuffers: Buffer[] = [];
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'All files must be PDF format' },
          { status: 400 }
        );
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      pdfBuffers.push(buffer);
    }

    // Merge PDFs
    const mergedPdf = await PDFProcessor.mergePDFs(pdfBuffers);

    // Return the merged PDF
    return new NextResponse(new Uint8Array(mergedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error('Error merging PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    );
  }
}