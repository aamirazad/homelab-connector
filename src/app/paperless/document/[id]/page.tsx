import DocumentViewer from "@/components/document-viewer";

export default function FullPageDocumentPage(props: { id: number }) {
  return (
    <DocumentViewer id={props.id} />
  );
}
