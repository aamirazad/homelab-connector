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
import { useCallback } from "react";
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

const queryClient = new QueryClient();

async function getPaperlessDocuments(query: string) {
  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData) return null;

  const response = await fetch(
    `${userData.paperlessURL}/api/documents/?query=${query}&page=1&page_size=10&truncate_content=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${userData.paperlessToken}`,
      },
    },
  );

  const data = (await response.json()) as PaperlessDocumentsType;

  return data;
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

  const PaperlessDocuments = useQuery({
    queryKey: ["key", query],
    queryFn: async () => {
      if (!query) {
        return Promise.resolve(null);
      }
      const response = await getPaperlessDocuments(query);
      return response;
    },
    // This ensures the query does not run if there's no query string
    enabled: !!query,
    staleTime: 60 * 1000, // 1 minute in milliseconds
    refetchOnWindowFocus: false,
  });

  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await getUserData();
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    refetchOnWindowFocus: false,
  });

  if (!query) {
    return <h1 className="text-2xl font-bold">Start Searching!</h1>;
  }

  if (PaperlessDocuments.isLoading || userData.isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (!userData.data?.paperlessURL) {
    return (
      <h1 className="text-2xl font-bold">
        You need to set your paperless url in
        <OpenInternalLink href="/settings">settings</OpenInternalLink>
      </h1>
    );
  } else if (!PaperlessDocuments.data || PaperlessDocuments.error) {
    return (
      <h1 className="text-2xl font-bold">
        Connection failed! Check that the paperless url/token is set correctly
        in <OpenInternalLink href="/settings">settings</OpenInternalLink>
      </h1>
    );
  }

  const paperlessDocumentMap = PaperlessDocuments.data.results;

  if (!paperlessDocumentMap ?? paperlessDocumentMap.length === 0) {
    return <h1 className="text-2xl font-bold">No results!</h1>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Search Results</h1>
      <ul className="list-disc">
        {paperlessDocumentMap.map((document, index) => (
          <li className="underline" key={index}>
            <Link
              className="underline hover:text-slate-300"
              href={`/paperless/document/${document.id}?query=${query}`}
            >
              {document.title}
            </Link>
          </li>
        ))}
      </ul>
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
