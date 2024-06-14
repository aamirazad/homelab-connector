"use client";

import { useState } from "react";
import { db } from "@/server/db";
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
import { Dispatch, SetStateAction } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function FullName({
  setActiveTab,
}: {
  setActiveTab: Dispatch<SetStateAction<number>>;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) {
    // Handle loading state however you like
    return (
      <div className="flex flex-row place-content-center gap-1">
        <LoaderCircle className="animate-spin" />
        Loading...
      </div>
    );
  }

  if (!user) {
    return redirect("/sign-in?redirect=" + pathname);
  }

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values["FullName"], user!.id);
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

function PaperlessAPI() {
  return <div>PaperlessAPI</div>;
}

export default function userSetup() {
  const [activeTab, setActiveTab] = useState(0);

  const formElements = [
    <FullName setActiveTab={setActiveTab} />,
    <PaperlessURL setActiveTab={setActiveTab} />,
    <PaperlessAPI />,
    // <PaperlessURL data={data} handleChange={handleChange} />,
    // <PaperlesssKey data={data} setData={setData} />,
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>{formElements[activeTab]}</div>
    </div>
  );
}
