import { Modal } from "@/components/modal";
import AudioPreview from "@/components/audio-preview";

export default function ModalAudioPreview({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Modal>
      <AudioPreview id={params.id} />
    </Modal>
  );
}
