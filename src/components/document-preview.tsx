"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { AdviceAPIType } from "@/types";
import OpenInternalLink from "./internal-link";
import type { UsersTableType } from "@/server/db/schema";
import { Button } from "./ui/button";

const queryClient = new QueryClient();

async function getPaperlessDocument(
  documentId: number,
  userData: UsersTableType,
): Promise<string | null> {
  try {
    const url = `${userData.paperlessURL}/api/documents/${documentId}/download/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${userData.paperlessToken}`,
      },
    });
    if (response.ok) {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      return objectUrl;
    } else {
      console.error("Failed to fetch PDF");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
}

function SkeletonLoader() {
  const { data: advice, isLoading } = useQuery({
    queryKey: ["advice"],
    queryFn: async () => {
      const response = await fetch("https://api.adviceslip.com/advice");
      return (await response.json()) as AdviceAPIType;
    },
  });

  return (
    <div className="m-4 flex h-full flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
      {/* PDF Skeleton */}
      <div className="relative flex h-full flex-shrink flex-grow items-center justify-center rounded-lg">
        {/* Pulsing Background */}
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-400" />
        {/* Text Overlay */}
        <div className="z-10 flex items-center justify-center">
          <div className="text-center text-black">
            {isLoading
              ? "Loading advice..."
              : advice?.slip.advice === null
                ? "Unable to fetch advice"
                : advice?.slip.advice}
          </div>
        </div>
      </div>
      {/* Button Skeleton */}
      <div className="flex flex-shrink-0 animate-pulse flex-col gap-8">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="h-10 w-24 rounded-md bg-gray-400" />
        ))}
      </div>
    </div>
  );
}

const fetchUserData = async (): Promise<UsersTableType> => {
  const response = await fetch(`/api/getUserData`);
  if (!response.ok) {
    throw new Error("Network error");
  }
  const data = (await response.json()) as UsersTableType;
  return data;
};

function Preview(props: { id: number }) {
  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const { data: pdfUrl, isLoading: isPdfUrlLoading } = useQuery({
    queryKey: ["pdfUrl", props.id, userData], // Include id and paperlessURL in the query key
    queryFn: async () => {
      console.log("fetching");
      return await getPaperlessDocument(props.id, userData!);
    },
    enabled: !!userData,
  });

  if (isPdfUrlLoading ?? isUserDataLoading) {
    return <SkeletonLoader />;
  }

  if (!pdfUrl || !userData) {
    return (
      <div className="flex justify-center">
        <div className="mx-auto max-w-sm rounded-lg bg-slate-700 p-4 shadow-md">
          <h1 className="w-full text-center text-2xl font-bold">
            Failed to get document
          </h1>
        </div>
      </div>
    );
  }
  return (
    <>
      <object data={pdfUrl} type="application/pdf" width="100%" height="100%">
        <p>
          Your web browser doesn&apos;t have a PDF plugin. Instead you can
          <OpenInternalLink href={pdfUrl}>
            click here to download the PDF file.
          </OpenInternalLink>
        </p>
      </object>
      <Button asChild></Button>
    </>
  );
}

export default function DocumentPreview(props: { id: number }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Preview id={props.id} />
    </QueryClientProvider>
  );
}
