"use client";

import { useState, useEffect } from "react";
import { getUserData } from "@/app/actions";
import LoadingSpinner from "@/components/loading-spinner";

export default function DocumentViewer(props: { id: number }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const userData = await getUserData();
      if (!userData) {
        setLoading(false);
        return;
      }

      const url = `${userData.paperlessURL}/api/documents/${props.id}/download/`;
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/pdf",
            Authorization: `Token ${userData.paperlessToken}`,
          },
        });
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
          // Cleanup function to revoke URL when component unmounts or pdfUrl changes
          return () => URL.revokeObjectURL(objectUrl);
        } else {
          console.error("Failed to fetch PDF");
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
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
    <embed
      src={pdfUrl}
      className="h-screen w-2/3"
      type="application/pdf"
      width="100%"
      height="100%"
    />
  );
}
