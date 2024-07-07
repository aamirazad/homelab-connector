import AudioPreview from "@/components/audio-preview";

export default function FullAudioPage({
  params,
}: {
  params: { name: string };
}) {
  return (
    <main className="h-full w-full">
      <AudioPreview name={params.name} />
    </main>
  );
}
