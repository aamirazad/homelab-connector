"use client";

import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

async function getRecording(name: string) {
  const userData = await getUserData();
  if (!userData) {
    console.error("Error getting user data");
    return null;
  }

  try {
    const url = `${userData.whishperURL}/api/documents/${name}/download/`;
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

function AudioPreview(props: { name: string }) {
  const { data: url, isLoading } = useQuery({
    queryKey: ["audioURL", props.name],
    queryFn: async () => {
      return getRecording(props.name);
    },
  });

  return <p>{url}</p>;
}

export default function Page(props: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioPreview name={props.name} />
    </QueryClientProvider>
  );
}
