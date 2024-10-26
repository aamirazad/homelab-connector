"use client";

import OpenInternalLink from "@/components/internal-link";
import LoadingSpinner from "@/components/loading-spinner";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function SignIn() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <Suspense>
      <main className="text-xl">
        <SignedOut>
          <LoadingSpinner>Signing you in...</LoadingSpinner>
          <RedirectToSignIn signInForceRedirectUrl={redirect} />
        </SignedOut>
        <SignedIn>
          You are already signed in
          <div className="mt-8">
            Go{" "}
            <OpenInternalLink href="/" className="text-primary">
              Home
            </OpenInternalLink>
          </div>
        </SignedIn>
      </main>
    </Suspense>
  );
}
