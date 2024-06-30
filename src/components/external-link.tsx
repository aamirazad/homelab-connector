import { ExternalLink } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

interface OpenLinkInNewPageProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function OpenExternalLInk({
  children,
  href,
  className,
}: OpenLinkInNewPageProps) {
  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      className={cn("text-sky-400 hover:underline", className)}
      href={href}
    >
      {children}
      <ExternalLink size={16} className="ml-1 inline-block" />
    </a>
  );
}
