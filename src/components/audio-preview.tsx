"use client";

import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import LoadingSpinner from "./loading-spinner";
import { UsersTableType } from "@/server/db/schema";

const queryClient = new QueryClient();

async function getRecording(
  name: string,
  userData: UsersTableType,
): Promise<string | null> {
  if (!userData) {
    console.error("Error getting user data");
    return null;
  }

  try {
    const url = `${userData.whishperURL}/api/documents/${name}/download/`;
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      console.error("Failed to fetch recording");
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

function Player(props: { name: string }) {
  const user = useQuery({
    queryKey: ["audioURL", props.name],
    queryFn: async () => {
      return getUserData;
    },
  });

  const url = useQuery({
    queryKey: ["audioURL", props.name],
    queryFn: async () => {
      return getRecording(props.name, user.data);
    },
  });

  if (user.isLoading ?? url.isLoading) {
    return <LoadingSpinner>Loading ...</LoadingSpinner>;
  }

  return <p>{url.data}</p>;
}

export default function AudioPreview(props: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Player name={props.name} />
    </QueryClientProvider>
  );
}
