import { NextRequest, NextResponse } from 'next/server';
import { PDFProcessor } from '@/lib/pdf-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfInfo = await PDFProcessor.getPDFInfo(buffer);

    return NextResponse.json({
      success: true,
      info: {
        ...pdfInfo,
        fileSize: buffer.length,
        fileSizeFormatted: `${(buffer.length / 1024 / 1024).toFixed(2)} MB`,
      }
    });
  } catch (error) {
    console.error('Error getting PDF info:', error);
    return NextResponse.json(
      { error: 'Failed to get PDF information' },
      { status: 500 }
    );
  }
}