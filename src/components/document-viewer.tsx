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

      const objectUrl = await getPaperlessDocument(props.id);
      if (objectUrl) {
        setPdfUrl(objectUrl);
        setLoading(false);
        // Cleanup function to revoke URL when component unmounts or pdfUrl changes
        return () => URL.revokeObjectURL(objectUrl);
      } else {
      }
    };

    fetchData().catch((error) => {
      console.error("An error occurred:", error);
    });
  }, [props.id]); // Dependency array to refetch if id changes

  if (loading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (!pdfUrl) {
    return <h1>Failure</h1>;
  }

  return (
    <div className="flex h-screen w-full min-w-0 justify-center">
      <div className="flex h-4/5 w-1/2 flex-col rounded-xl bg-slate-600/50">
        <div className="m-8 flex flex-grow justify-center gap-16">
          <div className="flex-shrink flex-grow">
            <embed
              src={pdfUrl}
              className=""
              type="application/pdf"
              width="100%"
              height="100%"
            />
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
