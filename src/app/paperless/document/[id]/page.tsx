import DocumentPreview from "@/components/document-preview";

export default function FullPageDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return (
    <main className="h-full w-full">
      <DocumentPreview id={params.id} />
    </main>
  );
}
