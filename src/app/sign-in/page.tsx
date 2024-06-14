import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="text-xl">
      <SignedOut>
        Signing you in...
        <RedirectToSignIn />
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
