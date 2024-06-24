"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { getUserData, setUserProperty } from "../actions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { UsersTableType } from "@/server/db/schema";

function PaperlessURL({
  setActiveTab,
  userData,
}: {
  setActiveTab: Dispatch<SetStateAction<number>>;
  userData: UsersTableType;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isAutofilled, setIsAutofilled] = useState(false);
  const formSchema = z.object({
    URL: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      URL: "",
    },
  });

  if (!isLoaded) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (userData.paperlessURL && !isAutofilled) {
    form.setValue("URL", userData.paperlessURL);
    setIsAutofilled(true);
  }

  if (!user) {
    return redirect("/sign-in?redirect=" + pathname);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.URL == "") {
      setActiveTab((prevTab) => prevTab + 2); // Skip api key form
    } else {
      setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
    }
    try {
      await setUserProperty("paperlessURL", values.URL);
      // Operation succeeded, show success toast
      toast("Your paperless URL preferences was saved");
      // Optionally, move to a new tab or take another action to indicate success
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your Paperless URL preferences were not saved.",
        action: {
          label: "Go back",
          onClick: () => setActiveTab((prevTab) => prevTab - 1), // Go back to try again
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="URL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paperless URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormDescription>Leave empty to disable</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function PaperlessToken({
  setActiveTab,
  userData,
}: {
  setActiveTab: Dispatch<SetStateAction<number>>;
  userData: UsersTableType;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const formSchema = z.object({
    token: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
    },
  });

  if (!isLoaded) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (userData.paperlessToken && !isAutofilled) {
    form.setValue("token", userData.paperlessToken);
    setIsAutofilled(true);
  }

  if (!user) {
    return redirect("/sign-in?redirect=" + pathname);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab

    try {
      await setUserProperty("paperlessToken", values.token);
      // Operation succeeded, show success toast
      toast("Your paperless token preferences was saved");
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your Paperless token preferences were not saved.",
        action: {
          label: "Go back",
          onClick: () => setActiveTab((prevTab) => prevTab - 1), // Go back to try again
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-64 space-y-4">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paperless API Token</FormLabel>
              <FormControl>
                <div className="flex flex-shrink items-center space-x-2">
                  <Input type={isHidden ? "text" : "password"} {...field} />
                  {isHidden ? (
                    <EyeIcon onClick={() => setIsHidden(false)} />
                  ) : (
                    <EyeOffIcon onClick={() => setIsHidden(true)} />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                You can create (or re-create) an API token by opening the
                &quot;My Profile&quot; link in the user dropdown found in the
                web UI and clicking the circular arrow button.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

interface ProgressIndicatorProps {
  activeTab: number;
  totalTabs: number;
  setActiveTab: (tabIndex: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  activeTab,
  totalTabs,
  setActiveTab,
}) => {
  return (
    <div className="flex items-center justify-center p-5">
      {Array.from({ length: totalTabs }, (_, index) => (
        <span
          onClick={() => setActiveTab(index)}
          key={index}
          className={`mx-1.5 inline-block h-3 w-3 cursor-pointer rounded-full transition delay-75 hover:scale-125 hover:bg-blue-300 ${
            index === activeTab ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></span>
      ))}
    </div>
  );
};

const queryClient = new QueryClient();

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await getUserData();
      return data;
    },
  });

  if (!userData || isLoading) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  const formElements = [
    <PaperlessURL
      key="paperlessURL"
      setActiveTab={setActiveTab}
      userData={userData}
    />,
    <PaperlessToken
      key="paperlessToken"
      setActiveTab={setActiveTab}
      userData={userData}
    />,
  ];
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {formElements[activeTab]}
      </QueryClientProvider>
      <ProgressIndicator
        activeTab={activeTab}
        totalTabs={formElements.length}
        setActiveTab={setActiveTab}
      />
      <Toaster />
    </>
  );
}
