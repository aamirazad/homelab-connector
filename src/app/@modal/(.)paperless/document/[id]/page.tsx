import DocumentModal from "@/components/document-modal";

export default function ModalDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return <DocumentModal params={params} />;
}
