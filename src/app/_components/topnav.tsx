"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export function TopNav() {
  return (
    <nav className="flex flex-wrap w-full items-center justify-between p-4 text-xl">
      <div className="flex w-64 rounded-bl-md rounded-tl-md bg-slate-900">
        <Link
          href="/"
          className={`${buttonVariants({ variant: "link" })} text-xl font-bold text-slate-200`}
        >
          Homelab Connector
        </Link>
      </div>
      <div className="flex items-center divide-x divide-dotted rounded-br-md rounded-tr-md bg-slate-700">
        <Link
          href="paperless"
          className={`${buttonVariants({ variant: "link" })} text-slate-200`}
        >
          Paperless-ngx
        </Link>
        <Link
          href="immich"
          className={`${buttonVariants({ variant: "link" })} text-slate-200`}
        >
          Immich
        </Link>
        <div className={`${buttonVariants({ variant: "link" })} text-slate-200`}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
