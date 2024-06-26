import DocumentViewer from "@/components/document-viewer";

export default function FullPageDocumentPage({ params }: { params: { id: number } }) {
  console.log("FULLL PAPGJPIGHEGPIUSHEGPIUWEGHPIWUEGH: " + params.id);
  return <DocumentViewer id={params.id} />;
}
