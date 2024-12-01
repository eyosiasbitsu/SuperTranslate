const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');
const fs = require('fs').promises;

async function splitPdfIntoPages(pdfPath) {
  try {
    const existingPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const pagesText = [];
    for (let i = 0; i < totalPages; i++) {
      try {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const textContent = await page.extractTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        pagesText.push(pageText);
      } catch (pageError) {
        console.error(`Error processing page ${i + 1}: ${pageError.message}`);
        pagesText.push(`[Error on page ${i + 1}]`);
      }
    }
    return pagesText;
  } catch (error) {
    throw new Error(`Error splitting PDF: ${error.message}`);
  }
}

async function splitDocxIntoPages(docxPath) {
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    const docxText = result.value;
    
    // Split by page breaks (form feed character)
    const pages = docxText.split(/\f/);
    
    // Trim whitespace and filter out empty pages
    return pages.map(page => page.trim()).filter(page => page.length > 0);
  } catch (error) {
    throw new Error(`Error splitting DOCX: ${error.message}`);
  }
}

module.exports = { 
    splitPdfIntoPages, 
    splitDocxIntoPages 
};
