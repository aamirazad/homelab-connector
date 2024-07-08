// Fixed code: Moved the QueryClientProvider and ReactQueryDevtools to wrap the entire component, ensuring React Query's context is available throughout the component.

import OpenExternalLink from "@/components/external-link";
import { getUserData } from "@/app/actions";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

function Content() {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: getUserData,
  });

  if (isLoading) {
    console.log("Loading user data...");
  }

  if (isError) {
    console.error("Error fetching user data:", error);
  }

  console.log("User data:", userData);
  return (
    <main>
      <div>
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the{" "}
          <OpenExternalLink href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">
            README
          </OpenExternalLink>{" "}
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
      </div>
    </main>
  );
}
