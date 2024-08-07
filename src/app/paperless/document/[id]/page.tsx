"use client";

import DocumentPreview from "@/components/document-preview";

export default function FullPageDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  return (
    <main className="flex h-full w-full min-w-0 justify-center">
      <div className="flex h-fit flex-col rounded-xl bg-slate-600/50 md:w-1/2">
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
          <DocumentPreview id={params.id} />
        </div>
      </div>
    </main>
  );
}
