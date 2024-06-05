import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function DocuemntsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);

  if (query) {
    useEffect(() => {
      fetch("/api/paperless?query=" + query)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, [query]);
    if (loading) return <div className="my-6 text-lg">Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="my-6 mt-8 text-2xl font-bold">Search Results</h1>
      {results ? (
        <ul className="list-disc">
          {results.data.documents.map((document, index) => (
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
      ) : (
        // Render something else or nothing if data is null
        <p>Start searching!</p>
      )}
    </div>
  );
}
