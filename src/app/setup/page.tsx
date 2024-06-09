"use client";

import { useState } from "react";
import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

function FullName() {
  const formSchema = z.object({
    FullName: z.string().min(3).max(256),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FullName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values["FullName"]);
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
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function PaperlessURL() {
  return <div>It's magic</div>;
}

function PaperlessAPI() {
  return <div>PaperlessAPI</div>;
}

export default function userSetup() {
  const handleChange = (event: { target: { key: string; value: string } }) => {
    const { key, value } = event.target;
    console.log(key, value);
  };
  1;

  const [activeTab, setActiveTab] = useState(0);

  const formElements = [
    <FullName data={data} handleChange={handleChange} />,
    <PaperlessURL />,
    <PaperlessAPI />,
    // <PaperlessURL data={data} handleChange={handleChange} />,
    // <PaperlesssKey data={data} setData={setData} />,
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>{formElements[activeTab]}</div>
      <div className="mx-auto flex flex-wrap gap-x-6">
        x{" "}
        <button
          disabled={activeTab === formElements.length - 1 ? true : false}
          onClick={() => setActiveTab((prev) => prev + 1)}
          className={`rounded-xl bg-blue-800 px-4 py-2 text-white ${activeTab === formElements.length - 1 ? "bg-slate-600 opacity-50" : "opacity-100"}`}
        >
          Next
        </button>
        {activeTab === formElements.length - 1 ? (
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            Submit
          </button>
        ) : null}
      </div>
    </div>
  );
}
