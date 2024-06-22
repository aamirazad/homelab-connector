"use client";

import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import Tooltip from "@/components/tooltip";
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
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
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

function UserSettings() {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const router = useRouter();

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
              className="mt-1 overflow-hidden rounded-full"
            />
          ) : (
            <User className="h-6 w-8" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.fullName ? (user.fullName) : (<>My Account</>)} </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => openUserProfile()}>
            Manage Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
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
        <div className="flex h-full items-center rounded-l rounded-r bg-slate-300 dark:bg-slate-700 md:rounded-l-none">
          <Link
            href="paperless"
            className={buttonVariants({ variant: "link" })}
          >
            Paperless-ngx
          </Link>
          <Separator orientation="vertical" />
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
          <Separator orientation="vertical" />
          <div>
            <div className={buttonVariants({ variant: "link" })}>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserSettings />
              </SignedIn>
            </div>
          </div>
          <Separator orientation="vertical" />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
