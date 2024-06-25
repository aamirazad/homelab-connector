import { Modal } from "./modal";

export default function DocumentModal(props: { id: number }) {
  return (
    <Modal>
      <DocumentViewer url="https://pdfobject.com/pdf/sample.pdf"></DocumentViewer>
    </Modal>
  );
}
