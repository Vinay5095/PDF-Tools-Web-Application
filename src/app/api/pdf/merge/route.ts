import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PDFProcessor } from '@/lib/pdf-processor';
import { checkUsageLimits, getUserPermissions } from '@/lib/subscription-service';
import { incrementUserUsage, logFileOperation } from '@/lib/user-service';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? parseInt(session.user.id) : null;
  const sessionId = request.headers.get('x-session-id') || null;
  
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging' },
        { status: 400 }
      );
    }

    // Calculate total file size
    let totalFileSize = 0;
    const pdfBuffers: Buffer[] = [];
    
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'All files must be PDF format' },
          { status: 400 }
        );
      }
      
      totalFileSize += file.size;
      const buffer = Buffer.from(await file.arrayBuffer());
      pdfBuffers.push(buffer);
    }

    // Check usage limits for authenticated users
    if (userId) {
      const limitCheck = await checkUsageLimits(userId, 'merge', files.length, totalFileSize);
      if (!limitCheck.allowed) {
        await logFileOperation(
          userId,
          sessionId,
          'merge',
          files.length,
          totalFileSize,
          Date.now() - startTime,
          false,
          limitCheck.reason,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
          request.headers.get('user-agent') || ''
        );
        
        return NextResponse.json(
          { error: limitCheck.reason },
          { status: 429 }
        );
      }
    } else {
      // Basic limits for anonymous users
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (totalFileSize > maxFileSize) {
        return NextResponse.json(
          { error: 'File size limit exceeded. Sign up for higher limits.' },
          { status: 429 }
        );
      }
      
      if (files.length > 5) {
        return NextResponse.json(
          { error: 'Maximum 5 files allowed for anonymous users.' },
          { status: 429 }
        );
      }
    }

    // Merge PDFs
    const mergedPdf = await PDFProcessor.mergePDFs(pdfBuffers);
    const processingTime = Date.now() - startTime;

    // Log successful operation and update usage
    if (userId) {
      await incrementUserUsage(userId, 'merge', totalFileSize, false);
    }
    
    await logFileOperation(
      userId,
      sessionId,
      'merge',
      files.length,
      totalFileSize,
      processingTime,
      true,
      undefined,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      request.headers.get('user-agent') || ''
    );

    // Return the merged PDF
    return new NextResponse(new Uint8Array(mergedPdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Error merging PDFs:', error);
    
    // Log failed operation
    await logFileOperation(
      userId,
      sessionId,
      'merge',
      0,
      0,
      processingTime,
      false,
      error instanceof Error ? error.message : 'Unknown error',
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      request.headers.get('user-agent') || ''
    );
    
    return NextResponse.json(
      { error: 'Failed to merge PDFs' },
      { status: 500 }
    );
  }
}