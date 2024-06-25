import DocumentViewer from "@/components/DocumentViewer";

export default function FullPageDocumentPage(props: { id: number }) {
  return (
    <DocumentViewer id={props.id} />
  );
}
