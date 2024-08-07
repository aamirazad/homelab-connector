"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
  return (
    <div className="m-4 flex h-full flex-grow flex-col justify-center gap-8 bg-gray-200 md:m-8 md:flex-row md:gap-16">
      <div className="relative flex h-full w-full flex-shrink flex-grow items-center justify-center rounded-lg">
        {/* Pulsing Background */}
        <div className="absolute inset-0 h-full w-full animate-pulse rounded-lg bg-gray-300" />
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
  }

  return <img src={pdfUrl} alt="Document Preview" />;
}

export default function DocumentPreview(props: { id: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <QueryClientProvider client={queryClient}>
      <Preview id={props.id} />
      <div className="flex flex-col items-center gap-8">
        <Button size="icon" className="bg-white" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" color="black" />
        </Button>
        <a
          className={`${buttonVariants({ variant: "default" })}`}
          href={`/paperless/details/${props.id}?query=${query}`}
        >
          Open full page
        </a>
      </div>
    </QueryClientProvider>
  );
}
