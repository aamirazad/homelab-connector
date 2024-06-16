import OpenLinkInNewPage from "@/components/open-link-in-new-page";

export default async function HomePage() {
  return (
    <main className="">
      <div className="">
        <div>Welcome to Homelab Connector</div>
        <div>
          Check out the
          <OpenLinkInNewPage href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">README</OpenLinkInNewPage>
          to get started.
        </div>
        <div>Or sign in to access the dashboard.</div>
      </div>
    </main>
  );
}
