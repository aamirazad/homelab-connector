import { Modal } from "@/components/modal";
import AudioPreview from "@/components/audio-preview";

export default function ModalAudioPreview({
  params,
}: {
  params: { name: string };
}) {
  return (
    <Modal>
      <AudioPreview name={params.name} />
    </Modal>
  );
}
