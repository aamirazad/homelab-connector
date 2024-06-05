import { ExternalLink, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

type DataType = {
  data: {
    total: number;
    documents: {
      added: string;
      archive_serial_number: string;
      archived_file_name: string;
      content: string;
      correspondent: string;
      created: string;
      created_date: string;
      custom_fields: [];
      document_type: number;
      id: number;
      is_shared_by_requester: boolean;
      modified: string;
      notes: [];
      original_file_name: string;
      owner: number;
      storage_path: number;
      tags: [];
      title: string;
      user_can_change: boolean;
    }[];
    saved_views: [];
    correspondents: [];
    document_types: [];
    storage_paths: [];
    tags: [];
    users: [];
    groups: [];
    mail_accounts: [];
    mail_rules: [];
    custom_fields: [];
    workflows: [];
  };
};

function Documents() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  
  const QueryResult = useQuery({
    queryKey: ["key"],
    queryFn: async () => {
      const response = await fetch("/api/paperless?query=" + query);
      const data = (await response.json()) as DataType;
      console.log("data just got got");
      return data;
    },
  });

  useEffect(() => {
    queryClient.refetchQueries();
  }, [query]);

  return (
    <div>
      {QueryResult.isLoading ? (
        <div className="flex flex-row place-content-center gap-1">
          <LoaderCircle className="animate-spin" />
          Loading...
        </div>
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

export default function DocumentsPage() {
  return (
    <div className="w-full">
      <QueryClientProvider client={queryClient}>
        <Documents />
      </QueryClientProvider>
    </div>
  );
}