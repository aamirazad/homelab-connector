import PdfViewer from "@/components/PdfViewer";

export default function DocumentPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
   <PdfViewer url="test" />
  );
}
