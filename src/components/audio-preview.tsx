"use client";

import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

async function getthedata() {
  const userData = await getUserData();
  if (!userData) {
    console.error("Error getting user data");
    return null;
  }
  return userData;
}

function Player(props: { name: string }) {
  // Fetch user data using useQuery hook

  console.log("User data:", userData);

  return (
    <audio controls={true}>
      <source
        src="https://audio.typhon-sirius.ts.net/api/video/2024_07_04-230439000_WHSHPR_2024-05-18%20-%20Grandma%20telling%20me%20and%20dathi%20about%20the%20past.m4a"
        type="audio/mp4"
      />
    </audio>
  );
}

export default function AudioPreview({ name }: { name: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Player name={name} />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
