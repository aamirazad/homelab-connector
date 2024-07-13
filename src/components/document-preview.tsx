"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { AdviceAPIType } from "@/types";
import OpenInternalLink from "./internal-link";
import type { UsersTableType } from "@/server/db/schema";
import BodyMessage from "./body-message";
import { buttonVariants } from "./ui/button";

const queryClient = new QueryClient();

export async function getPaperlessThumbnail(
  documentId: number,
  userData: UsersTableType,
): Promise<string | null> {
  try {
    const url = `${userData.paperlessURL}/api/documents/${documentId}/thumb/`;
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
    staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });

  const { data: pdfUrl, isLoading: isPdfUrlLoading } = useQuery({
    queryKey: ["pdfUrl", props.id, userData], // Include id and paperlessURL in the query key
    queryFn: async () => {
      console.log("fetching");
      return await getPaperlessThumbnail(props.id, userData!);
    },
    enabled: !!userData,
    refetchOnWindowFocus: false,
  });

  if (isPdfUrlLoading ?? isUserDataLoading) {
    return <SkeletonLoader />;
  } else if (!pdfUrl || !userData) {
    return <BodyMessage>Failed to get document</BodyMessage>;
  }

  return <img src={pdfUrl} alt="Document Preview" className="h-full" />;
}

export default function DocumentPreview(props: { id: number }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Preview id={props.id} />
      <OpenInternalLink
        className={`${buttonVariants({ variant: "default" })}`}
        href={`/paperless/details/${props.id}`}
      >
        Open full page
      </OpenInternalLink>
    </QueryClientProvider>
  );
}
