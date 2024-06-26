"use client";

import OpenLinkInNewPage from "@/components/open-link-in-new-page";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div>
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the
          <OpenLinkInNewPage href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">
            README
          </OpenLinkInNewPage>
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
        <Link href="/paperless/document/12">Button</Link>
      </div>
    </main>
  );
}
