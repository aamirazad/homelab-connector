import OpenExternalLink from "@/components/external-link";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <div>
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the{" "}
          <OpenExternalLink href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">
            README
          </OpenExternalLink>{" "}
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
        <Link href="/paperless/document/2024_07_04">testing</Link>
      </div>
    </main>
  );
}
