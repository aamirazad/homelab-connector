"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import Tooltip from "./tooltip";
import { ModeToggle } from "./mode-toggle";

export function TopNav() {
  return (
    <nav className="m-4 flex h-10 flex-wrap items-center justify-between rounded-bl-md rounded-tl-md dark:bg-slate-900 bg-slate-200 text-xl">
      <div className="flex w-64">
        <Link
          href="/"
          className={`${buttonVariants({ variant: "link" })} text-xl font-bold `}
        >
          Homelab Connector
        </Link>
      </div>
      <div className="flex items-center divide-x divide-dotted rounded-br-md rounded-tr-md dark:bg-slate-700 bg-slate-300">
        <Link
          href="paperless"
          className={buttonVariants({ variant: "link" })}
        >
          Paperless-ngx
        </Link>
        <div>
          <Tooltip text="Comming soon!">
            <Link
              href="/immich"
              className={`${buttonVariants({ variant: "link" })} pointer-events-none`}
              style={{ opacity: 0.5 }}
              aria-disabled="true"
              tabIndex={-1}
            >
              Immich
            </Link>
          </Tooltip>
        </div>
        <div>
          <div
            className={buttonVariants({ variant: "link" })}
          >
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
}
