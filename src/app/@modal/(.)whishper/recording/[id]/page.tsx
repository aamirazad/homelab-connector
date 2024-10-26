import { Modal } from "@/components/modal";
import AudioPreview from "@/components/audio-preview";

export default async function ModalAudioPreview(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <Modal>
      <AudioPreview id={params.id} />
    </Modal>
  );
}
