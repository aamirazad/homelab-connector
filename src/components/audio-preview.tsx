"use client";

import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import LoadingSpinner from "./loading-spinner";
import type { UsersTableType } from "@/server/db/schema";
import { getRecording } from "@/app/actions";

const queryClient = new QueryClient();

function Player(props: { name: string }) {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["audioURL"],
    queryFn: async () => {
      return getUserData();
    },
  });

  const { data: url } = useQuery({
    queryKey: ["url", props.name],
    queryFn: getRecording,
  });

  if (isLoading ?? !userData) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (error instanceof Error) {
    return <p>Error: {error.message}</p>;
  }

  return <p>{url}</p>;
}

export default function AudioPreview({ name }: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Player name={name} />
    </QueryClientProvider>
  );
}
