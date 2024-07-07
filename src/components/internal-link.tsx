import React from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface OpenLinkInNewPageProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function OpenInternalLink({
  children,
  href,
  className,
}: OpenLinkInNewPageProps) {
  return (
    <Link
      className={cn("hover:underline", className)}
      href={href}
    >
      {children}
    </Link>
  );
}
