"use client";

import { useRouter } from "next/navigation";

export default function FullPageDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  const router = useRouter();
  router.replace(`/paperless/details/${params.id}`);
  return (
    <main className="h-full w-full">
      <h1>Redirecting ...</h1>
    </main>
  );
}
