import DocumentViewer from "@/components/document-viewer";

export default function ModalDocumentPage({ params }: { params: { id: number } }) {
  return <DocumentViewer id={params.id} />;
}
