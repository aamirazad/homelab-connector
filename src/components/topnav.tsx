"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Tooltip from "@/components/tooltip";
import { ModeToggle } from "@/components/mode-toggle";

export function TopNav() {
  return (
    <nav className="m-4 flex h-10 flex-wrap items-center justify-between rounded-bl-md rounded-tl-md bg-slate-200 text-xl dark:bg-slate-900">
      <div className="flex w-64">
        <Link
          href="/"
          className={`${buttonVariants({ variant: "link" })} text-xl font-bold`}
        >
          Homelab Connector
        </Link>
      </div>
      <div className="flex h-full items-center divide-x divide-dotted rounded-br-md rounded-tr-md bg-slate-300 dark:bg-slate-700">
        <Link href="paperless" className={buttonVariants({ variant: "link" })}>
          Paperless-ngx
        </Link>
        <div>
          <Tooltip text="Comming soon!">
            <Button
              variant="link"
              className="pointer-events-none opacity-50"
              aria-disabled="true"
              tabIndex={-1}
            >
              Immich
            </Button>
          </Tooltip>
        </div>
        <div>
          <div className={buttonVariants({ variant: "link" })}>
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
