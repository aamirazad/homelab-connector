"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import Tooltip from "./tooltip";

export function TopNav() {

  return (
    <nav className="m-4 flex h-10 flex-wrap items-center justify-between rounded-bl-md rounded-tl-md bg-slate-900 text-xl">
      <div className="flex w-64">
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
        <Tooltip text="Comming soon!">
        <Link
          href="/immich"
          className={`${buttonVariants({ variant: "link" })} pointer-events-none text-slate-200`}
          style={{ opacity: 0.5 }}
          aria-disabled="true"
          tabIndex={-1}
          >
            Immich
        </Link>
      </Tooltip>
        <div
          className={`${buttonVariants({ variant: "link" })} text-slate-200`}
        >
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
