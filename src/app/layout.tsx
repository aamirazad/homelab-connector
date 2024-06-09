import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TopNav } from "./_components/topnav";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./_components/theme-provider";
import { cn } from "~/lib/utils";

export const metadata = {
  title: "Homelab Connector",
  description: "Connecting all your homelab services",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        suppressHydrationWarning
        lang="en"
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
        )}
      >
        <body className="">
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TopNav />
            <div className="flex flex-col items-center justify-center p-4 px-6">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
