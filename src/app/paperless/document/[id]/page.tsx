"use client";

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
import { buttonVariants } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import type { PaperlessDocumentType } from "@/types";
import React, { use } from "react";
import BodyMessage from "@/components/body-message";
import Link from "next/link";
import LoadingSpinner from "@/components/loading-spinner";
import OpenExternalLink from "@/components/external-link";
import ky from "ky";

const queryClient = new QueryClient();

export async function getPaperlessDocument(
  documentId: number,
  userData: UsersTableType,
): Promise<string | null> {
  try {
    const url = `${userData.paperlessURL}/api/documents/${documentId}/download/`;
    const blob = await ky
      .get(url, {
        headers: {
          Authorization: `Token ${userData.paperlessToken}`,
        },
      })
      .blob();
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
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
  const response = await ky.post(
    `${userData.paperlessURL}/api/documents/bulk_edit/`,
    {
      json: body,
      headers: {
        Authorization: `Token ${userData.paperlessToken}`,
      },
    },
  );
  return response;
}

async function fetchUserData(): Promise<UsersTableType> {
  return await ky.get("/api/getUserData").json<UsersTableType>();
}

async function getPaperlessDocumentData(
  id: number,
  userData: UsersTableType,
): Promise<PaperlessDocumentType | null> {
  try {
    const url = `${userData.paperlessURL}/api/documents/${id}/?truncate_content=true`;
    const data = await ky
      .get(url, {
        headers: {
          Authorization: `Token ${userData.paperlessToken}`,
        },
      })
      .json<PaperlessDocumentType>();
    return data;
  } catch (error) {
    console.error("Error fetching PDF data:", error);
    return null;
  }
}

function DocumentDetailsInner(props: { id: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

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
      return result;
    },
    enabled: !!userData,
    refetchOnWindowFocus: false,
  });

  const { data: documentData, isLoading: isdocumentDataLoading } = useQuery({
    queryKey: ["documentData", props.id, userData], // Include id and userData in the query key
    queryFn: async () => {
      const result = await getPaperlessDocumentData(props.id, userData!);
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
        <div className="m-4 flex flex-grow flex-col justify-center gap-8 md:flex-row md:gap-16">
          <div className="flex h-full w-full flex-col">
            <h1 className="mb-2 text-xl font-bold">{documentData?.title}</h1>
            <div className="flex-grow overflow-hidden">
              <object
                data={pdfUrl}
                type="application/pdf"
                className="h-full max-h-full w-full max-w-full"
              />
            </div>
          </div>

          <div className="flex w-36 flex-col gap-8">
            <Link
              href={`/paperless?query=${query}`}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              Back to search
            </Link>
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
                    the pdf.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const response = await deleteDocument(props.id);
                      if (response.ok) {
                        toast("Pdf deleted", {
                          description: "The pdf has been deleted.",
                        });
                      } else {
                        toast("Error deleting pdf", {
                          description:
                            "An error occurred while deleting the pdf.",
                        });
                      }
                      router.push(`/paperless?query=${query}`);
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

export default function DocumentDetails(
  props: {
    params: Promise<{ id: number }>;
  }
) {
  const params = use(props.params);
  return (
    <QueryClientProvider client={queryClient}>
      <DocumentDetailsInner {...params} />
    </QueryClientProvider>
  );
}
