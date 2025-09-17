import { PDFDocument } from 'pdf-lib';

export class PDFProcessor {
  static async mergePDFs(pdfFiles: Buffer[]): Promise<Buffer> {
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfBuffer of pdfFiles) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    return Buffer.from(await mergedPdf.save());
  }

  static async splitPDF(pdfBuffer: Buffer, ranges: number[][]): Promise<Buffer[]> {
    const pdf = await PDFDocument.load(pdfBuffer);
    const splitPdfs: Buffer[] = [];
    
    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      const [start, end] = range;
      
      for (let i = start; i <= end && i < pdf.getPageCount(); i++) {
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);
      }
      
      splitPdfs.push(Buffer.from(await newPdf.save()));
    }
    
    return splitPdfs;
  }

  static async compressPDF(pdfBuffer: Buffer): Promise<Buffer> {
    const pdf = await PDFDocument.load(pdfBuffer);
    
    // Basic compression by re-saving the PDF
    // In a real application, you might want to implement more sophisticated compression
    return Buffer.from(await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false,
    }));
  }

  static async getPDFInfo(pdfBuffer: Buffer): Promise<{
    pageCount: number;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  }> {
    const pdf = await PDFDocument.load(pdfBuffer);
    
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle(),
      author: pdf.getAuthor(),
      subject: pdf.getSubject(),
      creator: pdf.getCreator(),
      producer: pdf.getProducer(),
      creationDate: pdf.getCreationDate(),
      modificationDate: pdf.getModificationDate(),
    };
  }
}