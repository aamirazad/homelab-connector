import AudioPreview from "@/components/audio-preview";

export default async function FullAudioPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <main className="h-full w-full">
      <AudioPreview id={params.id} />
    </main>
  );
}
