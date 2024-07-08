"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const fetchUserData = async (): Promise<UsersTableType> => {
  const response = await fetch(`/api/getUserData`);
  if (!response.ok) {
    throw new Error("Network error");
  }
  const data = (await response.json()) as UsersTableType;
  return data;
};

function SkeletonLoader() {
  return (
    <div className="flex h-1/5 w-full justify-center">
      <div className="flex h-full justify-center md:w-1/3">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col items-center justify-center">
            {/* Long Pill Skeleton */}
            <div className="mb-2 flex w-full flex-grow justify-center">
              <div className="h-12 w-full animate-pulse rounded-full bg-gray-400 md:w-3/4"></div>
            </div>
            {/* Button Skeleton */}
            <div className="flex animate-pulse justify-center gap-12">
              <div className="h-10 w-24 rounded-md bg-gray-400" />
              <div className="h-10 w-24 rounded-md bg-gray-400" />
              <div className="h-10 w-24 rounded-md bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AudioInfo(props: { name: string }) {
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
    return <SkeletonLoader />;
  }
  if (!userData?.whishperURL ?? error) {
    return <h1>Failed to get whishper url</h1>;
  }

  return (
    <div className="flex h-1/5 w-full justify-center">
      <div className="flex h-full justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center">
            <div className="mb-4 w-full animate-pulse">
              <div className="h-6 w-3/4 rounded-md bg-gray-500"></div>
            </div>
            {/* Audio */}
            <div className="mb-2 flex w-full flex-grow justify-center">
              <audio controls={true} className="w-full md:w-3/4">
                <source
                  src={`${userData.whishperURL}/api/video/${props.name}`}
                  type="audio/mp4"
                />
              </audio>
            </div>
            <div className="flex w-full flex-shrink-0 animate-pulse justify-between">
              <Button />
              <Button />
              <Button />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioPreview({ name }: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioInfo name={name} />
    </QueryClientProvider>
  );
}
