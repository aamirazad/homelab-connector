import AudioPreview from "@/components/audio-preview";

export default function FullAudioPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="h-full w-full">
      <AudioPreview id={params.id} />
    </main>
  );
}
