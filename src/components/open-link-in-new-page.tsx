import { ExternalLink } from "lucide-react";
import React from "react";

interface OpenLinkInNewPageProps {
  children: React.ReactNode;
  href: string;
}

export default function OpenLinkInNewPage({
  children,
  href,
}: OpenLinkInNewPageProps) {
  return (
    <a
      rel="noopener noreferrer"
      target="_blank"
      className="mx-1 text-blue-600 underline hover:text-blue-800"
      href={href}
    >
      {children}
      <ExternalLink size={16} className="ml-1 inline-block" />
    </a>
  );
}
