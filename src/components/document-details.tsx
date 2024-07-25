"use client";

import { Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getUserData } from "@/app/actions";
import { Button, buttonVariants } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import LoadingSpinner from "./loading-spinner";
import OpenExternalLink from "./external-link";
import type { PaperlessDocumentType } from "@/types";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import BodyMessage from "./body-message";

const queryClient = new QueryClient();

export async function getPaperlessDocument(
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

async function deleteDocument(documentId: number) {
  const userData = await getUserData();
  if (!userData) {
    throw new Error("User data not found");
  }
  const body = {
    documents: [documentId],
    method: "delete",
  };
  const response = await fetch(
    `${userData.paperlessURL}/api/documents/bulk_edit/ `,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
      body: JSON.stringify(body),
    },
  );
  return response;
}

const fetchUserData = async (): Promise<UsersTableType> => {
  const response = await fetch(`/api/getUserData`);
  if (!response.ok) {
    throw new Error("Network error");
  }
  const data = (await response.json()) as UsersTableType;
  return data;
};

async function getPaperlessDocumentData(id: number, userData: UsersTableType) {
  try {
    const url = `${userData.paperlessURL}/api/documents/${id}/?truncate_content=true`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${userData.paperlessToken}`,
      },
    });
    console.log(response);
    if (response.ok) {
      const data = (await response.json()) as PaperlessDocumentType;
      return data;
    } else {
      console.error("Failed to fetch PD dataF");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF data:", error);
    return null;
  }
}

function DocumentDetailsInner(props: { id: number }) {
  const router = useRouter();

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });

  const { data: pdfUrl, isLoading: isPdfUrlLoading } = useQuery({
    queryKey: ["pdfUrl", props.id, userData], // Include id and userData in the query key
    queryFn: async () => {
      const result = await getPaperlessDocument(props.id, userData!);
      console.log("Fetched PDF URL:", result);
      return result;
    },
    enabled: !!userData,
    refetchOnWindowFocus: false,
  });

  const { data: documentData, isLoading: isdocumentDataLoading } = useQuery({
    queryKey: ["documentData", props.id, userData], // Include id and userData in the query key
    queryFn: async () => {
      const result = await getPaperlessDocumentData(props.id, userData!);
      console.log("Fetched Document Data:", result);
      return result;
    },
    enabled: !!userData,
    refetchOnWindowFocus: false,
  });

  if (isUserDataLoading || isdocumentDataLoading || isPdfUrlLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (!userData || !documentData || !pdfUrl) {
    return <BodyMessage>Error</BodyMessage>;
  }
  return (
    <div className="flex h-full w-full min-w-0 justify-center">
      <div className="flex h-4/5 flex-col rounded-xl bg-slate-600/50 md:w-1/2">
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
          <div>
            {documentData?.title}
            <object
              data={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
            />
          </div>
          <div className="flex flex-col gap-8">
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
            >
              Back
            </Button>
            <a>
              Download
              <Download />
            </a>
            <div id="dialog-container" />
            <OpenExternalLink
              className={buttonVariants({ variant: "default" })}
              href={`${userData.paperlessURL}/documents/${props.id}/details/`}
            >
              Open
            </OpenExternalLink>
            <AlertDialog>
              <AlertDialogTrigger
                className={`${buttonVariants({ variant: "destructive" })} w-24`}
              >
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the recording.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const response = await deleteDocument(props.id);
                      if (response.ok) {
                        toast("Pdf deleted", {
                          description: "The recording has been deleted.",
                        });
                      } else {
                        toast("Error deleting pdf", {
                          description:
                            "An error occurred while deleting the pdf.",
                        });
                      }
                      router.back();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentDetails(props: { id: number }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentDetailsInner {...props} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
