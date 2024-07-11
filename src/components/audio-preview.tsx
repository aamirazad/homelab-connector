"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import type { UsersTableType } from "@/server/db/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import OpenExternalLink from "./external-link";
import type { WhishperRecordingType } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const queryClient = new QueryClient();

const fetchUserData = async (): Promise<UsersTableType> => {
  const response = await fetch("/api/getUserData");
  if (!response.ok) {
    throw new Error("Network error");
  }
  const data = (await response.json()) as UsersTableType;
  return data;
};

function SkeletonLoader() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex h-full justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center gap-9">
            {/* Title Skeleton */}
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-300 px-2 py-1"></div>
            {/* Audio Skeleton */}
            <div className="my-2 flex w-full flex-grow justify-center">
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 md:w-3/4"></div>
            </div>
            {/* Button Skeletons */}
            <div className="flex w-full flex-shrink-0 animate-pulse justify-between">
              {Array.from({ length: 5 }, (_, index) => (
                <Button className="w-24" key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function fetchWhishperRecording(searchId: string, whishperURL: string) {
  const response = await fetch(`${whishperURL}/api/transcriptions`);
  const data = (await response.json()) as WhishperRecordingType[];
  for (const recording of data) {
    if (recording.id === searchId) {
      return recording;
    }
  }
}

async function deleteWhishperRecording(url: string) {
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network error");
  }

  return response;
}

type AudioInfoProps = {
  id: string;
};

function AudioInfo({ id }: AudioInfoProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    data: userData,
    isLoading: isUserDataLoading,
    error: userDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const whishperURL = userData?.whishperURL;

  const {
    data: recordingData,
    isLoading: isRecordingDataLoading,
    error: recordingDataError,
  } = useQuery({
    queryKey: ["whishperRecording", id, whishperURL], // Include id in the query key
    queryFn: () => fetchWhishperRecording(id, whishperURL!),
    enabled: !!whishperURL, // Only fetch recording data when userData is available
  });

  if (isUserDataLoading) {
    return <SkeletonLoader />;
  }

  if (userDataError ?? !userData) {
    return (
      <div className="flex justify-center">
        <div className="mx-auto max-w-sm rounded-lg bg-slate-700 p-4 shadow-md">
          <h1 className="w-full text-center text-2xl font-bold">
            Error loading user data
          </h1>
        </div>
      </div>
    );
  }

  if (isRecordingDataLoading) {
    return <SkeletonLoader />;
  }

  if (recordingDataError ?? !recordingData) {
    return (
      <div className="flex justify-center">
        <div className="mx-auto max-w-sm rounded-lg bg-slate-700 p-4 shadow-md">
          <h1 className="w-full text-center text-2xl font-bold">
            Error loading recording data
          </h1>
        </div>
      </div>
    );
  }

  const decodedName = decodeURIComponent(recordingData.fileName);
  const frontPart = decodedName.split("_WHSHPR_")[1] ?? decodedName;
  const formattedName = frontPart.replace(".m4a", "") ?? decodedName;

  return (
    <div className="flex w-full justify-center">
      <div className="flex h-full justify-center md:w-1/2">
        <div className="flex h-full w-full flex-col rounded-xl bg-slate-600/50">
          <div className="m-4 flex h-full flex-grow flex-col justify-center gap-9">
            <div
              className={`audioPreview flex flex-row items-center justify-between gap-2 rounded-md px-2 py-1 text-xl text-white ${isPlaying ? "bg-gradient-to-r from-indigo-900 to-purple-900" : ""}`}
            >
              {formattedName}
              <Button
                className="rounded-full border-none bg-slate-500/60 hover:bg-slate-500/90"
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ChevronLeft />
              </Button>
            </div>
            {/* Audio */}
            <div className="flex w-full flex-grow justify-center">
              <audio
                controls={true}
                className="w-full md:w-3/4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source
                  src={`${userData.whishperURL}/api/video/${recordingData.fileName}`}
                  type="audio/mp4"
                />
              </audio>
            </div>
            <div className="flex w-full flex-shrink-0 justify-center gap-12">
              <Button className="w-24">
                <OpenExternalLink
                  href={`${userData.whishperURL}/editor/${id}`}
                  className="text-primary-foreground"
                >
                  Open
                </OpenExternalLink>
              </Button>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      href={`${userData.whishperURL}/api/video/${recordingData.fileName}`}
                      download={recordingData.fileName}
                      className={`w-24 ${buttonVariants({ variant: "link" })}`}
                      target="_blank"
                    >
                      Download
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      To download the audio file, right click and select
                      &quot;Save as&quot;.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button className="w-24" variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the recording.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const response = await deleteWhishperRecording(
                          `${userData.whishperURL}/api/transcriptions/${id}`,
                        );
                        if (response.ok) {
                          toast("Recording deleted", {
                            description: "The recording has been deleted.",
                          });
                        } else {
                          toast("Error deleting recording", {
                            description:
                              "An error occurred while deleting the recording.",
                          });
                        }
                        router.back();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioPreview({ id }: { id: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioInfo id={id} />
    </QueryClientProvider>
  );
}
