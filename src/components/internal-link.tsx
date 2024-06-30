import React from "react";

import { cn } from "@/lib/utils";

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
    <a
      rel="noopener noreferrer"
      target="_blank"
      className={cn("hover:underline", className)}
      href={href}
    >
      {children}
    </a>
  );
}
