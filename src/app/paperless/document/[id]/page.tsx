export default function FullPageDocumentPage(props: { id: number }) {
  return (
    <embed
      src="https://pdfobject.com/pdf/sample.pdf"
      className="h-screen w-2/3"
      type="application/pdf"
      width="100%"
      height="100%"
    />
  );
}
