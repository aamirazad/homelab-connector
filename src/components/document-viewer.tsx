"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getUserData } from "@/app/actions";

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

  useEffect(() => {
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
  }, [props.id]); // Dependency array to refetch if id changes

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="mx-auto max-w-sm rounded-lg bg-black p-4 shadow-md">
          <LoadingSpinner className="w-min rounded-full text-xl font-bold">
            Loading...
          </LoadingSpinner>
        </div>
      </div>
    );
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
                Your web browser doesn't have a PDF plugin. Instead you can
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
