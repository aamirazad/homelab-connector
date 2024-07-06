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
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserData, getWhishperRecordings } from "../actions";
import LoadingSpinner from "@/components/loading-spinner";

function SearchForm() {
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
              <FormLabel>Search for your voice recordings</FormLabel>
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

function RecordingsList() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const WhishperRecordings = useQuery({
    queryKey: ["key", query],
    queryFn: async () => {
      if (!query) {
        return Promise.resolve(null);
      }
      const response = await getWhishperRecordings(query);
      return response;
    },
    // This ensures the query does not run if there's no query string
    enabled: !!query,
  });

  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await getUserData();
      return data;
    },
  });

  if (!query) {
    return <h1 className="text-2xl font-bold">Start Searching!</h1>;
  }

  if (WhishperRecordings.isLoading || userData.isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (!userData.data?.whishperURL) {
    return (
      <h1 className="text-2xl font-bold">
        You need to set your paperless url in{" "}
        <Link href="/settings">settings</Link>
      </h1>
    );
  } else if (!WhishperRecordings.data || WhishperRecordings.error) {
    return (
      <h1 className="text-2xl font-bold">
        Connection failed! Check that the whishper url is set correctly in{" "}
        <Link href="/settings">settings</Link>
      </h1>
    );
  }

  const WhishperRecordingsMap = WhishperRecordings.data.results;

  if (WhishperRecordingsMap.length === 0) {
    return <h1 className="text-2xl font-bold">No results!</h1>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Search Results</h1>
      <ul className="list-disc">
        {WhishperRecordingsMap.map((recording, index) => (
          <li className="underline" key={index}>
            <Link
              className="underline hover:text-slate-300"
              href={`/paperless/document/${recording.id}?query=${query}`}
            >
              {recording.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function WhishperPage() {
  return (
    <main className="">
      <div className="flex flex-col items-center justify-center">
        <SignedOut>
          <div className="flex flex-col text-center text-2xl">
            Please <Link href="/sign-in">sign in</Link>
          </div>
        </SignedOut>
        <SignedIn>
          <SearchForm />
        </SignedIn>
      </div>
    </main>
  );
}
