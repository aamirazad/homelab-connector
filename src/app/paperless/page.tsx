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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { ExternalLink } from "lucide-react";
import { useEffect } from "react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import type { PaperlessDocumentsType } from "@/types";
import { getPaperlessDocuments } from "../actions";

const queryClient = new QueryClient();

function DocumentsSearch() {
  const formSchema = z.object({
    query: z.string().min(3).max(256),
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const givenQuery = searchParams.get("query") || "";
  // 1. Define your form.
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
    if (values["query"])
      router.replace(
        pathname + "?" + createQueryString("query", values["query"]),
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search for documents</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
  const query = searchParams.get("query") || "";
  
  const QueryResult = useQuery({
    queryKey: ["key", query],
    queryFn: async () => {
      const response = await getPaperlessDocuments(query);
      const data = (await response.json()) as PaperlessDocumentsType;
      return data;
    },
  });

  useEffect(() => {
    void queryClient.refetchQueries();
  }, [query]);

  console.log(QueryResult.isLoading);

  return (
    <div>
      {QueryResult.isLoading ? (
        <LoadingSpinner>Loading...</LoadingSpinner>
      ) : QueryResult.data === null ? ( // Check if QueryResult.data is null
        <h1 className="text-2xl font-bold">Connection failed!</h1>
      ) : QueryResult.data?.data ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Search Results</h1>
          <ul className="list-disc">
            {QueryResult.data.data.documents.map((document, index) => (
              <li className="underline" key={index}>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                  href={`https://papers.aamira.me/api/documents/${document.id}/preview/#search="${query}"`}
                >
                  {document.title}
                  <ExternalLink size={16} className="mx-1 inline-block" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h1 className="text-2xl font-bold">Start searching!</h1>
      )}
    </div>
  );
}

export default function PaperlessPage() {
  return (
    <main className="">
      <div className="flex w-96 flex-col items-center justify-center">
        <SignedOut>
          <div className="flex flex-col text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex w-full flex-col gap-8">
            <DocumentsSearch />
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
