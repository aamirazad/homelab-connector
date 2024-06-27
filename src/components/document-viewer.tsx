"use client";

import { useState, useEffect } from "react";
import { getPaperlessDocument } from "@/app/actions";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

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
        // Cleanup function to revoke URL when component unmounts or pdfUrl changes
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setLoading(false);
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
    <div className="flex h-screen w-full min-w-0 justify-center text-white">
      <div className="flex h-4/5 w-1/2 justify-center gap-16">
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
  );
}
