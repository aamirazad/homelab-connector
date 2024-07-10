"use client";

import { useState, useEffect, useRef } from "react";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { AdviceAPIType } from "@/types";
import OpenInternalLink from "./internal-link";
import OpenExternalLink from "./external-link";
import type { UsersTableType } from "@/server/db/schema";
import { Download } from "lucide-react";

const queryClient = new QueryClient();

async function getPaperlessDocument(
  documentId: number,
): Promise<string | null> {
  const userData = await getUserData();
  if (!userData) {
    console.error("Error getting user data");
    return null;
  }
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
    <div className="flex h-4/5 w-full justify-center">
      <div className="flex h-full min-w-0 justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
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

function DocumentViewer(props: { id: number }) {
  const router = useRouter();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchDataCalledRef = useRef(false);

  useEffect(() => {
    if (!fetchDataCalledRef.current) {
      const fetchData = async () => {
        setLoading(true);

        try {
          const objectUrl = await getPaperlessDocument(props.id);
          if (objectUrl) {
            setPdfUrl(objectUrl);
          } else {
            setPdfUrl(null);
          }
        } catch (error) {
          console.error("An error occurred:", error);
          setPdfUrl(null);
        } finally {
          setLoading(false);
        }
      };

      fetchData().catch((error) => {
        console.error("An error occurred:", error);
      });

      fetchDataCalledRef.current = true; // Mark as fetched
    }
  }, [props.id]); // Include props.id in the dependency array if refetch is needed on id change

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  if (loading ?? isUserDataLoading) {
    return <SkeletonLoader />;
  }

  if (!pdfUrl || !userData) {
    return (
      <div className="flex justify-center">
        <div className="mx-auto max-w-sm rounded-lg bg-black p-4 shadow-md">
          <h1 className="w-full text-center text-2xl font-bold">
            Failed to get document
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full min-w-0 justify-center">
      <div className="flex h-4/5 flex-col rounded-xl bg-slate-600/50 md:w-1/2">
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
          <div className="h-full flex-shrink flex-grow">
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <p>
                Your web browser doesn&apos;t have a PDF plugin. Instead you can
                <OpenInternalLink href={pdfUrl}>
                  click here to download the PDF file.
                </OpenInternalLink>
              </p>
            </object>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-8">
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Back
            </Button>
            <a
              href={pdfUrl}
              download={pdfUrl}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Download
              <Download />
            </a>
            <OpenExternalLink
              className={buttonVariants({ variant: "default" })}
              href={`${userData.paperlessURL}/documents/${props.id}/details/`}
            >
              Open
            </OpenExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page(props: { id: number }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentViewer id={props.id} />
    </QueryClientProvider>
  );
}
