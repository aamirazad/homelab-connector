"use client";
import { Document, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/static/js/pdf.worker.min.js"

export default function DocumentPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <Document file="https://pdfobject.com/pdf/sample.pdf" />;
}
