"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import { getUserData } from "@/app/actions";
import Link from "next/link";
import OpenInternalLink from "@/components/internal-link";
import type { PaperlessDocumentsType } from "@/types";
import type { UsersTableType } from "@/server/db/schema";
import Image from "next/image";
import ky from "ky";

const queryClient = new QueryClient();

async function getPaperlessDocuments(query: string) {
  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData) return null;

  const data = await ky
    .get(
      `${userData.paperlessURL}/api/documents/?query=${query}&page=1&page_size=10&truncate_content=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${userData.paperlessToken}`,
        },
      },
    )
    .json<PaperlessDocumentsType>();

  return data;
}

export async function getPaperlessThumbnail(
  documentId: number,
  userData: UsersTableType,
): Promise<string | null> {
  try {
    const url = `${userData.paperlessURL}/api/documents/${documentId}/thumb/`;
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

function DocumentsSearch() {
  const formSchema = z.object({
    query: z.string().min(3).max(256),
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const givenQuery = searchParams.get("query") ?? "";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: givenQuery,
    },
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.query)
      router.replace(pathname + "?" + createQueryString("query", values.query));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for documents</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="dark:bg-slate-200">
          Submit
        </Button>
      </form>
    </Form>
  );
}

function DocumentsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const {
    data: PaperlessDocuments,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery({
    queryKey: ["key", query],
    queryFn: async () => {
      if (!query) {
        return Promise.resolve(null);
      }
      const response = await getPaperlessDocuments(query);
      return response;
    },
    enabled: !!query,
    staleTime: 60 * 1000, // 1 minute in milliseconds
    refetchOnWindowFocus: false,
  });

  const {
    data: userData,
    isLoading: isLoadingUserData,
    error: userDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await getUserData();
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });

  const [imageUrls, setImageUrls] = useState(new Map<number, string | null>());

  useEffect(() => {
    const fetchImageUrls = async () => {
      const newImageUrls = new Map<number, string | null>();
      if (PaperlessDocuments?.results && userData) {
        for (const document of PaperlessDocuments.results) {
          const url = await getPaperlessThumbnail(document.id, userData);
          newImageUrls.set(document.id, url);
        }
      }
      setImageUrls(newImageUrls);
    };

    void fetchImageUrls();
  }, [PaperlessDocuments, userData]);

  if (!query) {
    return (
      <h1 className="mb-4 text-center text-2xl font-bold">Start searching</h1>
    );
  }

  if (isLoadingDocuments || isLoadingUserData) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (userDataError || !userData?.paperlessURL) {
    return (
      <h1 className="text-2xl font-bold">
        You need to set your paperless url in
        <OpenInternalLink href="/settings">settings</OpenInternalLink>
      </h1>
    );
  } else if (documentsError || !PaperlessDocuments) {
    return (
      <h1 className="text-2xl font-bold">
        Connection failed! Check that the paperless url/token is set correctly
        in <OpenInternalLink href="/settings">settings</OpenInternalLink>
      </h1>
    );
  }

  const paperlessDocumentMap = PaperlessDocuments.results;

  if (paperlessDocumentMap.length === 0) {
    return <h1 className="mb-4 text-center text-2xl font-bold">No results</h1>;
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold">Search Results</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paperlessDocumentMap.map((document, index) => (
          <div
            key={index}
            className="rounded-lg border p-4 shadow transition-shadow duration-300 hover:shadow-lg"
          >
            <Link
              className="mt-2 block text-lg font-semibold underline hover:text-slate-300"
              href={`/paperless/document/${document.id}?query=${query}`}
            >
              <Image
                src={imageUrls.get(document.id) ?? ""}
                alt={document.title}
                width={40}
                height={128}
                className="mb-2 h-32 w-full rounded object-cover"
              />
              {document.title}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default function PaperlessPage() {
  return (
    <main className="">
      <div className="flex flex-col items-center justify-center">
        <SignedOut>
          <div className="text-center text-2xl">
            Please{" "}
            <OpenInternalLink href="/sign-in?redirect=/paperless">
              sign in
            </OpenInternalLink>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex w-full flex-col gap-8">
            <div className="flex w-full justify-center">
              <DocumentsSearch />
            </div>
            <div className="w-full">
              <QueryClientProvider client={queryClient}>
                <DocumentsPage />
              </QueryClientProvider>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
