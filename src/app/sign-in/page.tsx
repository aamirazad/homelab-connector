"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="text-xl">
      <SignedOut>
        <LoadingSpinner>Signing you in...</LoadingSpinner>
        <RedirectToSignIn signInForceRedirectUrl={redirect} />
      </SignedOut>
      <SignedIn>
        You are already signed in
        <div className="mt-8">
          Go
          <Link
            href="/"
            className="ml-1 text-primary underline-offset-4 hover:underline"
          >
            Home
          </Link>
        </div>
      </SignedIn>
    </div>
  );
}
