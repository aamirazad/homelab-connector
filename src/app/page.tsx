import OpenExternalLInk from "@/components/external-link";

export default function HomePage() {
  return (
    <main>
      <div>
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the{" "}
          <OpenExternalLInk href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">
            README
          </OpenExternalLInk>{" "}
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
      </div>
    </main>
  );
}
