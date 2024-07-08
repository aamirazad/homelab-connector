"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import LoadingSpinner from "./loading-spinner";
import type { UsersTableType } from "@/server/db/schema";

const queryClient = new QueryClient();

const fetchUserData = async (): Promise<UsersTableType> => {
  const response = await fetch(`/api/getUserData`);
  if (!response.ok) {
    throw new Error("Network error");
  }
  const data = (await response.json()) as UsersTableType;
  return data;
};

function Player(props: { name: string }) {
  // Fetch user data using useQuery hook

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  if (isLoading) {
    return <LoadingSpinner>Loading ...</LoadingSpinner>;
  }
  if (!userData?.whishperURL ?? error) {
    return <h1>Failed to get whishper url</h1>;
  }

  return (
    <audio controls={true}>
      <source
        src={`${userData.whishperURL}/api/video/${props.name}`}
        type="audio/mp4"
      />
    </audio>
  );
}

export default function AudioPreview({ name }: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Player name={name} />
    </QueryClientProvider>
  );
}
