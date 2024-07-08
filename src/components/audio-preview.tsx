"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { formatWhishperName } from "@/app/actions";

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
      <div className="flex h-full justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center">
            {/* Title Skeleton */}
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-300"></div>
            {/* Audio Skeleton */}
            <div className="my-2 flex w-full flex-grow justify-center">
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 md:w-3/4"></div>
            </div>
            {/* Button Skeletons */}
            <div className="flex w-full flex-shrink-0 justify-between">
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300"></div>
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300"></div>
              <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300"></div>
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
    isLoading: isUserDataLoading,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const decodedName = decodeURIComponent(props.name);
  const frontPart = decodedName.split("_WHSHPR_")[1] ?? decodedName;
  const formattedName = frontPart.replace(".m4a", "") ?? decodedName;

  if (isUserDataLoading) {
    return <SkeletonLoader />;
  }
  if (!userData?.whishperURL ?? error) {
    return <h1>Failed to get whishper url</h1>;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-full justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center gap-4">
            <h1 className="h-6 w-3/4 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-lg text-white">
              {formattedName}
            </h1>
            {/* Audio */}
            <div className="flex w-full flex-grow justify-center">
              <audio controls={true} className="w-full md:w-3/4">
                <source
                  src={`${userData.whishperURL}/api/video/${props.name}`}
                  type="audio/mp4"
                />
              </audio>
            </div>
            <div className="flex w-full flex-shrink-0 animate-pulse justify-between">
              {Array.from({ length: 5 }, (_, index) => (
                <Button key={index} />
              ))}
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
