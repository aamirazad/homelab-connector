"use client";

import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

async function fetchAudioUrl() {
  const response = await fetch(`/api/getUserData`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function Player(props: { name: string }) {
  // Fetch user data using useQuery hook

  const userData = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await fetchAudioUrl();
      return data;
    },
  });

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
    </QueryClientProvider>
  );
}
