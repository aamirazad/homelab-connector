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
import DocumentPreview, { getPaperlessDocument } from "./document-preview";
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
import { PaperlessDocumentType } from "@/types";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

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
    const url = `${userData.paperlessURL}/api/documents/${id}/`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${userData.paperlessToken}`,
      },
    });
    if (response.ok) {
      const data = (await response.json()) as PaperlessDocumentType[];
      return data[0];
    } else {
      console.error("Failed to fetch PDF");
      return null;
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
    return null;
  }
}

function DocumentDetailsInner(props: { id: number }) {
  const router = useRouter();

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const { data: documentData, isLoading: isdocumentDataLoading } = useQuery({
    queryKey: ["pdfUrl", props.id, userData], // Include id and paperlessURL in the query key
    queryFn: async () => {
      return await getPaperlessDocumentData(props.id, userData!);
    },
    enabled: !!userData,
  });

  if (isUserDataLoading ?? isdocumentDataLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  return (
    <div className="flex h-full w-full min-w-0 justify-center">
      <div className="flex h-4/5 flex-col rounded-xl bg-slate-600/50 md:w-1/2">
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:m-8 md:flex-row md:gap-16">
          <div>{documentData?.title}</div>
          <DocumentPreview id={props.id} />
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
              <AlertDialogTrigger>
                <Button className="w-24" variant="destructive">
                  Delete
                </Button>
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
