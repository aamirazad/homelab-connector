import { ExternalLink } from 'lucide-react';


export default function HomePage() {
  return (
    <main className="p-4 px-6">
      <div className="flex flex-col items-center justify-center">
        <div>Welcome to Homelab Connector</div>
        <div>Check out the <a rel="noopener noreferrer" target="_blank" className="underline text-blue-600 hover:text-blue-800" href="https://github.com/aamirazad/homelab-connector/blob/main/README.md">README<ExternalLink size={16} className="ml-1 inline-block" /></a>  to get started.</div>
        <div>Or sign in to access the dashboard.</div>
      </div>
    </main>
  );
}
