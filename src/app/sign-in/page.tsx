"use client";

import OpenInternalLink from "@/components/internal-link";
import LoadingSpinner from "@/components/loading-spinner";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
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
  );
}
