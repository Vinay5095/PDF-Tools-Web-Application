import { PDFDocument } from 'pdf-lib';

/**
 * PDF document information interface
 */
export interface PDFInfo {
  /** Number of pages in the document */
  pageCount: number;
  /** Document title from metadata */
  title?: string;
  /** Document author from metadata */
  author?: string;
  /** Document subject from metadata */
  subject?: string;
  /** Application that created the document */
  creator?: string;
  /** Application that produced the PDF */
  producer?: string;
  /** Date when the document was created */
  creationDate?: Date;
  /** Date when the document was last modified */
  modificationDate?: Date;
}

/**
 * PDF processing utilities for manipulating PDF documents
 * Provides methods for merging, splitting, compressing, and extracting information from PDFs
 */
export class PDFProcessor {
  /**
   * Merges multiple PDF files into a single document
   * @param pdfFiles - Array of PDF file buffers to merge
   * @returns Promise resolving to merged PDF buffer
   * @throws Error when no files provided or merge operation fails
   * @example
   * ```typescript
   * const file1 = await fs.readFile('document1.pdf');
   * const file2 = await fs.readFile('document2.pdf');
   * const merged = await PDFProcessor.mergePDFs([file1, file2]);
   * ```
   */
  static async mergePDFs(pdfFiles: Buffer[]): Promise<Buffer> {
    if (!pdfFiles || pdfFiles.length === 0) {
      throw new Error('At least one PDF file is required for merging');
    }

    const mergedPdf = await PDFDocument.create();
    
    for (const pdfBuffer of pdfFiles) {
      if (!Buffer.isBuffer(pdfBuffer)) {
        throw new Error('Invalid PDF buffer provided');
      }
      
      try {
        const pdf = await PDFDocument.load(pdfBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        throw new Error(`Failed to process PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    try {
      return Buffer.from(await mergedPdf.save());
    } catch (error) {
      throw new Error(`Failed to save merged PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Splits a PDF document into multiple files based on specified page ranges
   * @param pdfBuffer - Buffer containing the PDF file to split
   * @param ranges - Array of page ranges [startPage, endPage] (0-based indexing)
   * @returns Promise resolving to array of PDF buffers, one for each range
   * @throws Error when invalid PDF buffer or page ranges provided
   * @example
   * ```typescript
   * const pdfFile = await fs.readFile('document.pdf');
   * // Split into pages 0-2, 3-5, 6-9
   * const ranges = [[0, 2], [3, 5], [6, 9]];
   * const splitPdfs = await PDFProcessor.splitPDF(pdfFile, ranges);
   * ```
   */
  static async splitPDF(pdfBuffer: Buffer, ranges: number[][]): Promise<Buffer[]> {
    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error('Invalid PDF buffer provided');
    }

    if (!ranges || ranges.length === 0) {
      throw new Error('At least one page range is required for splitting');
    }

    let pdf: PDFDocument;
    try {
      pdf = await PDFDocument.load(pdfBuffer);
    } catch (error) {
      throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const pageCount = pdf.getPageCount();
    const splitPdfs: Buffer[] = [];
    
    for (const range of ranges) {
      if (!Array.isArray(range) || range.length !== 2) {
        throw new Error('Each range must be an array with exactly 2 elements [start, end]');
      }

      const [start, end] = range;
      
      if (start < 0 || end < 0 || start >= pageCount || end >= pageCount || start > end) {
        throw new Error(`Invalid page range [${start}, ${end}]. PDF has ${pageCount} pages (0-based indexing)`);
      }

      try {
        const newPdf = await PDFDocument.create();
        
        for (let i = start; i <= end && i < pageCount; i++) {
          const [copiedPage] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(copiedPage);
        }
        
        splitPdfs.push(Buffer.from(await newPdf.save()));
      } catch (error) {
        throw new Error(`Failed to create split PDF for range [${start}, ${end}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return splitPdfs;
  }

  /**
   * Compresses a PDF file to reduce its size
   * @param pdfBuffer - Buffer containing the PDF file to compress
   * @returns Promise resolving to compressed PDF buffer
   * @throws Error when invalid PDF buffer provided or compression fails
   * @example
   * ```typescript
   * const pdfFile = await fs.readFile('large-document.pdf');
   * const compressed = await PDFProcessor.compressPDF(pdfFile);
   * console.log(`Original: ${pdfFile.length} bytes, Compressed: ${compressed.length} bytes`);
   * ```
   */
  static async compressPDF(pdfBuffer: Buffer): Promise<Buffer> {
    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error('Invalid PDF buffer provided');
    }

    let pdf: PDFDocument;
    try {
      pdf = await PDFDocument.load(pdfBuffer);
    } catch (error) {
      throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    try {
      // Basic compression by re-saving the PDF with optimized settings
      // In a real application, you might want to implement more sophisticated compression
      return Buffer.from(await pdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      }));
    } catch (error) {
      throw new Error(`Failed to compress PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extracts information and metadata from a PDF document
   * @param pdfBuffer - Buffer containing the PDF file to analyze
   * @returns Promise resolving to PDF information object
   * @throws Error when invalid PDF buffer provided or extraction fails
   * @example
   * ```typescript
   * const pdfFile = await fs.readFile('document.pdf');
   * const info = await PDFProcessor.getPDFInfo(pdfFile);
   * console.log(`Document has ${info.pageCount} pages`);
   * console.log(`Title: ${info.title || 'No title'}`);
   * ```
   */
  static async getPDFInfo(pdfBuffer: Buffer): Promise<PDFInfo> {
    if (!Buffer.isBuffer(pdfBuffer)) {
      throw new Error('Invalid PDF buffer provided');
    }

    let pdf: PDFDocument;
    try {
      pdf = await PDFDocument.load(pdfBuffer);
    } catch (error) {
      throw new Error(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    try {
      return {
        pageCount: pdf.getPageCount(),
        title: pdf.getTitle() || undefined,
        author: pdf.getAuthor() || undefined,
        subject: pdf.getSubject() || undefined,
        creator: pdf.getCreator() || undefined,
        producer: pdf.getProducer() || undefined,
        creationDate: pdf.getCreationDate() || undefined,
        modificationDate: pdf.getModificationDate() || undefined,
      };
    } catch (error) {
      throw new Error(`Failed to extract PDF information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}