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
import { getUserData, setUserProperty } from "@/app/actions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { UsersTableType } from "@/server/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const queryClient = new QueryClient();

interface FormProps {
  setActiveTab: Dispatch<SetStateAction<number>>;
  userData: UsersTableType;
}

function PaperlessCard({ setActiveTab, userData }: FormProps) {
  const [isHidden, setIsHidden] = useState(false);

  const formSchema = z.object({
    PaperlessURL: z.string(),
    PaperlessToken: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PaperlessURL: userData.paperlessURL ?? "",
      PaperlessToken: userData.paperlessToken ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
    try {
      await setUserProperty("paperlessURL", values.PaperlessURL);
      await setUserProperty("paperlessToken", values.PaperlessToken);
      // Operation succeeded, show success toast
      toast("Your paperless preferences was saved");
      // Optionally, move to a new tab or take another action to indicate success
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your Paperless preferences were not saved.",
        action: {
          label: "Go back",
          onClick: () => setActiveTab((prevTab) => prevTab - 1), // Go back to try again
        },
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paperless settings</CardTitle>
        <CardDescription>Paperless ngx is a pdf organizer</CardDescription>
      </CardHeader>
      <CardContent className="items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-64 space-y-4"
          >
            <FormField
              control={form.control}
              name="PaperlessURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paperless URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PaperlessToken"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Paperless API Token</FormLabel>
                    <FormControl>
                      <div className="flex flex-shrink items-center space-x-2">
                        <Input
                          type={isHidden ? "text" : "password"}
                          {...field}
                        />
                        {isHidden ? (
                          <EyeIcon onClick={() => setIsHidden(false)} />
                        ) : (
                          <EyeOffIcon onClick={() => setIsHidden(true)} />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      You can create (or re-create) an API token by opening the
                      &quot;My Profile&quot; link in the user dropdown found in
                      the web UI and clicking the circular arrow button.
                    </FormDescription>
                  </FormItem>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function WhishperURL({ setActiveTab, userData }: FormProps) {
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

  if (userData.whishperURL && !isAutofilled) {
    form.setValue("URL", userData.whishperURL);
    setIsAutofilled(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.URL == "") {
      setActiveTab((prevTab) => prevTab + 2); // Skip api key form
    } else {
      setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
    }
    try {
      await setUserProperty("whishperURL", values.URL);
      // Operation succeeded, show success toast
      toast("Your whishper URL preferences was saved");
      // Optionally, move to a new tab or take another action to indicate success
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your whishper URL preferences were not saved.",
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
              <FormLabel>Whishper URL</FormLabel>
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

export function Forms() {
  const [activeTab, setActiveTab] = useState(0);
  const { user: clerkUser, isLoaded: clerkUserIsLoaded } = useUser();
  const pathname = usePathname();

  const { data: userData, isLoading: userDataIsLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const data = await getUserData();
      return data;
    },
  });

  if (!userData || userDataIsLoading || !clerkUserIsLoaded) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  } else if (!clerkUser) {
    return redirect("/sign-in?redirect=" + pathname);
  }

  const formElements = [
    <PaperlessCard
      key="paperlessURL"
      setActiveTab={setActiveTab}
      userData={userData}
    />,
    <WhishperURL
      key="paperlessToken"
      setActiveTab={setActiveTab}
      userData={userData}
    />,
  ];
  return (
    <>
      {formElements[activeTab]}
      <ProgressIndicator
        activeTab={activeTab}
        totalTabs={formElements.length}
        setActiveTab={setActiveTab}
      />
    </>
  );
}

export default function SettingsPage() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Forms />
      </QueryClientProvider>
      <Toaster />
    </>
  );
}
