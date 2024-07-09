import OpenExternalLink from "@/components/external-link";

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
      </div>
    </main>
  );
}
