// pages/pdf-viewer.tsx

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { GetServerSideProps } from 'next';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string; // URL to the PDF document
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(
          new Array(numPages || 0),
          (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ),
        )}
      </Document>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch PDF URL from your API or any other source
  const res = await fetch('URL_TO_YOUR_PDF_API_ENDPOINT');
  const { pdfUrl } = await res.json();

  return {
    props: {
      pdfUrl
    }
  };
};

export default PDFViewer;
