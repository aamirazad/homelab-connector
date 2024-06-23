"use client";

import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { AlignJustify, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function UserSettings() {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="size-8" asChild>
          {user ? (
            <Image
              src={user.imageUrl}
              width={32}
              height={32}
              priority={true}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          ) : (
            <User className="h-6 w-8" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user?.fullName ? user.fullName : <>My Account</>}{" "}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openUserProfile()}>
            Manage Account
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to sign out?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await signOut();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}

function ImmichTooltip() {
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger
          aria-disabled="true"
          tabIndex={-1}
          className={`${buttonVariants({ variant: "link" })} cursor-not-allowed opacity-50`}
        >
          Immich
        </TooltipTrigger>
        <TooltipContent>Comming soon!</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TopNav() {
  return (
    <nav className="flex w-full justify-center">
      <div className="mt-4 flex h-10 w-56 flex-wrap items-center justify-center text-xl md:w-1/2 md:flex-nowrap md:justify-between md:rounded-l md:bg-slate-200 md:dark:bg-slate-900">
        <div className="flex-col rounded bg-slate-200 dark:bg-slate-900 md:flex md:flex-none md:rounded-l">
          <Link
            href="/"
            className={`${buttonVariants({ variant: "link" })} text-xl font-bold`}
          >
            Homelab Connector
          </Link>
        </div>
        {/* Desktop links */}
        <div className="hidden h-full items-center rounded-r bg-slate-300 dark:bg-slate-700 md:flex">
          <Link
            href="paperless"
            className={buttonVariants({ variant: "link" })}
          >
            Paperless-ngx
          </Link>
          <Separator orientation="vertical" />
          <ImmichTooltip />
          <Separator orientation="vertical" />
          <div className={buttonVariants({ variant: "link" })}>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserSettings />
            </SignedIn>
          </div>
          <Separator orientation="vertical" />
          <ModeToggle />
        </div>
        {/* Mobile dropdown */}
        <div className="flex h-full items-center space-x-4 rounded-l rounded-r bg-slate-300 dark:bg-slate-700 md:hidden px-4 -mt-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AlignJustify />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Links</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  href="paperless"
                  className={buttonVariants({ variant: "link" })}
                >
                  Paperless-ngx
                </Link>
              </DropdownMenuItem>
              <ImmichTooltip />
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
          <UserSettings />
        </div>
      </div>
    </nav>
  );
}
