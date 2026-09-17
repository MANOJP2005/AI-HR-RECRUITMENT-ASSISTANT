import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Use unpkg or cdn worker matching the installed pdfjs-dist version or standard worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch {
    // Fallback: workerless mode if worker configuration fails
  }
}

export async function extractTextFromPDFFile(file: File): Promise<string> {
  // If user dropped a txt or markdown file, read directly
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
    return await file.text();
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }

    const cleaned = fullText.trim();
    if (!cleaned) {
      throw new Error('No readable text layer was found in this PDF file. It might be a scanned image without OCR.');
    }
    return cleaned;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('PDF parsing encountered an issue:', errorMsg);
    throw new Error(`Failed to extract text from "${file.name}": ${errorMsg}`);
  }
}
