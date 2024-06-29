"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/actions";
import type { AdviceAPIType } from "@/types";

export async function getPaperlessDocument(
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

export default function DocumentViewer(props: { id: number }) {
  const router = useRouter();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchDataCalledRef = useRef(false);
  const [advice, setAdvice] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await fetch("https://api.adviceslip.com/advice");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = (await response.json()) as AdviceAPIType;
        setAdvice(data.slip.advice);
      } catch (error) {
        console.error("Failed to fetch advice:", error);
      }
    };

    void fetchAdvice();
  }, []);

  const SkeletonLoader = () => (
    <div className="flex h-4/5 w-full justify-center">
      <div className="flex h-full min-w-0 justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
            {/* PDF Skeleton */}
            <div className="relative flex h-full flex-shrink flex-grow items-center justify-center rounded-lg">
              {/* Pulsing Background */}
              <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-400"></div>
              {/* Text Overlay */}
              <div className="z-10 flex items-center justify-center">
                <div className="text-center text-black">
                  {advice ? advice : "Loading advice..."}
                </div>
              </div>
            </div>
            {/* Button Skeleton */}
            <div className="flex flex-shrink-0 animate-pulse flex-col gap-8">
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
              <div className="h-10 w-24 rounded-md bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!pdfUrl) {
    return <h1>Failed to get document</h1>;
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
                <a href={pdfUrl}>click here to download the PDF file.</a>
              </p>
            </object>
          </div>
          <div className="flex flex-shrink-0 flex-col">
            <Button
              onClick={() => {
                router.back();
              }}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
