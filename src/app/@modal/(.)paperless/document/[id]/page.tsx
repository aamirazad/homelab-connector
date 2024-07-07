import DocumentViewer from "@/components/document-viewer";
import { Modal } from "./modal";

export default function ModalDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return (
    <Modal>
      <DocumentViewer id={params.id} />
    </Modal>
  );
}
