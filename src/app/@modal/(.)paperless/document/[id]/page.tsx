import { Modal } from "./modal";
import DocumentViewer from "@/components/DocumentViewer";

export default function DocumentModal(props: { id: number }) {
  return (
    <Modal>
      <DocumentViewer id={props.id}></DocumentViewer>
    </Modal>
  );
}
