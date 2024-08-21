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
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { getUserData } from "../actions";
import LoadingSpinner from "@/components/loading-spinner";
import OpenInternalLink from "@/components/internal-link";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OpenExternalLink from "@/components/external-link";
import type { UsersTableType } from "@/server/db/schema";
import { BadgeCheck, Badge, BadgeAlert } from "lucide-react";
import type { WhishperRecordingType } from "@/types";
import ky from "ky";

const queryClient = new QueryClient();

async function getWhishperRecordings(
  query: string,
): Promise<WhishperRecordingType[] | null> {
  const userData = await getUserData();

  if (!query || query == "null" || query.length < 3 || !userData) return null;

  const data = await ky
    .get(`${userData.whishperURL}/api/transcriptions`)
    .json<WhishperRecordingType[]>();

  const lowerCaseQuery = query.toLowerCase();
  const filteredAndScored = data
    .filter(
      (item) =>
        item.fileName.toLowerCase().includes(lowerCaseQuery) ||
        item.result.text.toLowerCase().includes(lowerCaseQuery),
    )
    .map((item) => {
      const fileNameOccurrences = (
        item.fileName.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) ?? []
      ).length;
      const textOccurrences = (
        item.result.text.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) ??
        []
      ).length;
      const score = fileNameOccurrences + textOccurrences;
      return { ...item, score };
    });
  const sortedByScore = filteredAndScored.sort((a, b) => b.score - a.score);

  // Step 4: Return the sorted array without the score
  return sortedByScore.map(({ ...item }) => item);
}

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
  }

  if (!userData.data?.whishperURL) {
    return (
      <h1 className="text-2xl font-bold">
        You need to set your whishper url in{" "}
        <Link href="/settings">settings</Link>
      </h1>
    );
  }

  if (!WhishperRecordings.data || WhishperRecordings.error) {
    return (
      <h1 className="text-2xl font-bold">
        Connection failed! Check that the whishper url is set correctly in{" "}
        <Link href="/settings">settings</Link>
      </h1>
    );
  }

  const WhishperRecordingsMap = WhishperRecordings.data;

  if (WhishperRecordingsMap.length === 0) {
    return <h1 className="text-2xl font-bold">No results!</h1>;
  }

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Search Results</h1>
      <DataTable
        data={WhishperRecordingsMap}
        userData={userData.data}
        query={query}
      />
    </>
  );
}

interface DataTableProps<TData> {
  data: TData[];
  userData: UsersTableType;
  query: string;
}

function DataTable<TData extends WhishperRecordingType>({
  data,
  userData,
  query,
}: DataTableProps<TData>) {
  const columns: ColumnDef<TData>[] = [
    {
      accessorFn: (recording) => {
        const name =
          recording.fileName.split("_WHSHPR_")[1] ?? recording.fileName;
        return name.replace(".m4a", "") ?? recording.fileName;
      },
      header: "Name",
      cell: ({ getValue, row }) => (
        <OpenInternalLink
          href={`/whishper/recording/${row.original.id}?query=${query}`}
        >
          {getValue() as string}
        </OpenInternalLink>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue();
        if (value === 2) return <BadgeCheck color="#28a745" />;
        if (value === 1) return <Badge />;
        if (value === -1) return <BadgeAlert color="#ff0f0f" />;
        return null;
      },
    },
    {
      accessorKey: "id",
      header: "Link",
      cell: ({ row }) => (
        <OpenExternalLink
          href={`${userData.whishperURL}/editor/${row.original.id}`}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function WhishperPage() {
  return (
    <main className="">
      <div className="flex flex-col items-center justify-center">
        <SignedOut>
          <div className="text-center text-2xl">
            Please{" "}
            <OpenInternalLink href="/sign-in?redirect=/whishper">
              sign in
            </OpenInternalLink>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex w-full flex-col gap-8">
            <div className="flex w-full justify-center">
              <SearchForm />
            </div>
            <div className="w-full">
              <QueryClientProvider client={queryClient}>
                <RecordingsList />
              </QueryClientProvider>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
