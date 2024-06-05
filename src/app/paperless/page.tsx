"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import DocumentsSearch from "./document-search";
import DocuemntsPage from "./documents-page";

export default function PaperlessPage() {
  return (
    <main className="flex flex-col items-center justify-center p-4 px-6">
      <div className="flex w-96 flex-col items-center justify-center">
        <SignedOut>
          <div className="flex flex-col text-center text-2xl">
            Please sign in above
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-col gap-8 w-full">
            <DocumentsSearch />
            <DocuemntsPage />
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
