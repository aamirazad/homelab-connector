import DocumentViewer from "@/components/document-viewer";

export default function ModalDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return (
    <main className="h-full w-full">
      <DocumentViewer id={params.id} />
    </main>
  );
}
