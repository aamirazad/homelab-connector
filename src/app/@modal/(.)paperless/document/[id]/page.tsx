import DocumentViewer from "@/components/document-viewer";

export default function FullPageDocumentPage({ params }: { params: { id: number } }) {
  return <DocumentViewer id={params.id} />;
}
