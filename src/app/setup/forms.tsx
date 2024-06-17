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
    setFullUserName(values["FullName"], user!.id);
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
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
  const formSchema = z.object({
    URL: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      URL: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values["URL"]);
    setActiveTab((prevTab) => prevTab + 1); // Increment activeTab
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

export default function Forms() {
  const [activeTab, setActiveTab] = useState(0);

  const formElements = [
    <FullName setActiveTab={setActiveTab} />,
    <PaperlessURL setActiveTab={setActiveTab} />,
    <PaperlessKey />,
  ];
  return formElements[activeTab];
}
