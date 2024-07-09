import DocumentViewer from "@/components/document-viewer";
import { Modal } from "../../../../../components/modal";

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
