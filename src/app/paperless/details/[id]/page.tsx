import DocumentDetails from "@/components/document-details";

export default function FullPageDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return <DocumentDetails id={params.id} />;
}
