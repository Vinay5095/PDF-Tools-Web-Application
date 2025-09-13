import { NextRequest, NextResponse } from 'next/server';
import { PDFProcessor } from '@/lib/pdf-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const rangesStr = formData.get('ranges') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be PDF format' },
        { status: 400 }
      );
    }

    // Parse ranges - format: "1-3,4-5,6-10"
    let ranges: number[][];
    if (rangesStr) {
      ranges = rangesStr.split(',').map(range => {
        const [start, end] = range.split('-').map(num => parseInt(num) - 1); // Convert to 0-based
        return [start, end || start];
      });
    } else {
      // If no ranges specified, split each page into separate PDF
      const buffer = Buffer.from(await file.arrayBuffer());
      const info = await PDFProcessor.getPDFInfo(buffer);
      ranges = Array.from({ length: info.pageCount }, (_, i) => [i, i]);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const splitPdfs = await PDFProcessor.splitPDF(buffer, ranges);

    if (splitPdfs.length === 1) {
      // Return single PDF
      return new NextResponse(new Uint8Array(splitPdfs[0]), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="split_1.pdf"',
        },
      });
    } else {
      // Return multiple PDFs as ZIP
      const JSZip = require('jszip');
      const zip = new JSZip();
      
      splitPdfs.forEach((pdf, index) => {
        zip.file(`split_${index + 1}.pdf`, pdf);
      });
      
      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      
      return new NextResponse(new Uint8Array(zipBuffer), {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="split_pdfs.zip"',
        },
      });
    }
  } catch (error) {
    console.error('Error splitting PDF:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF' },
      { status: 500 }
    );
  }
}