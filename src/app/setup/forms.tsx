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
import { Dispatch, SetStateAction, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { setFullUserName } from "../actions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function FullName({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<number>>;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const formSchema = z.object({
    FullName: z.string().min(1, {
      message: "Required.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FullName: "",
    },
  });

  if (!isLoaded) {
    return <LoadingSpinner>Loading...</LoadingSpinner>;
  }

  if (!user) {
    return redirect("/sign-in?redirect=" + pathname);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
    try {
      await setFullUserName(values["FullName"], user!.id);
      // Operation succeeded, show success toast
      toast("Your name preferences was saved");
      // Optionally, move to a new tab or take another action to indicate success
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your name preferences were not saved.",
        action: {
          label: "Go back",
          onClick: () => setActiveTab(0), // Go back to try again
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="FullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function PaperlessURL({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<number>>;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

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
  }

  if (!user) {
    return redirect("/sign-in?redirect=" + pathname);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
    try {
      await setPaperlessURL(values["URL"], user!.id);
      // Operation succeeded, show success toast
      toast("Your paperless URL preferences was saved");
      // Optionally, move to a new tab or take another action to indicate success
    } catch {
      // Operation failed, show error toast
      toast("Uh oh! Something went wrong.", {
        description: "Your PaperlessURL preferences were not saved.",
        action: {
          label: "Go back",
          onClick: () => setActiveTab(1), // Go back to try again
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="URL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paperless URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Leave empty to disable</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function PaperlessKey() {
  return <div>PaperlessKey</div>;
}

interface ProgressIndicatorProps {
  activeTab: number;
  totalTabs: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  activeTab,
  totalTabs,
}) => {
  return (
    <div className="flex items-center justify-center p-5">
      {Array.from({ length: totalTabs }, (_, index) => (
        <span
          key={index}
          className={`mx-1 inline-block h-2.5 w-2.5 rounded-full ${
            index === activeTab ? "bg-green-500" : "bg-gray-300"
          }`}
        ></span>
      ))}
    </div>
  );
};

export default function Forms() {
  const [activeTab, setActiveTab] = useState(0);

  const formElements = [
    <FullName setActiveTab={setActiveTab} />,
    <PaperlessURL setActiveTab={setActiveTab} />,
    <PaperlessKey />,
  ];
  return (
    <>
      {formElements[activeTab]}
      <ProgressIndicator
        activeTab={activeTab}
        totalTabs={formElements.length}
      />
      <Toaster />
    </>
  );
}
