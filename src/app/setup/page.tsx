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

function FullName() {
  return <div>Hello Dathi</div>;
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
    <FullName />,
    <PaperlessURL />,
    <PaperlessAPI />,
    // <PaperlessURL data={data} handleChange={handleChange} />,
    // <PaperlesssKey data={data} setData={setData} />,
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>{formElements[activeTab]}</div>
      <div className="mx-auto flex flex-wrap gap-x-6">
        <button
          disabled={activeTab === 0 ? true : false}
          onClick={() => setActiveTab((prev) => prev - 1)}
          className={`rounded-xl bg-green-600 px-4 py-2 text-white ${activeTab === 0 ? "bg-slate-600 opacity-50" : "opacity-100"}`}
        >
          Back
        </button>
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
