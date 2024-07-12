"use client";

import { useRouter } from "next/navigation";
import BodyMessage from "@/components/body-message";

export default function FullPageDocumentPage({
  params,
}: {
  params: { id: number };
}) {
  const router = useRouter();
  router.replace(`/paperless/details/${params.id}`);
  return (
    <main className="h-full w-full">
      <BodyMessage>Redirecting ...</BodyMessage>
    </main>
  );
}
