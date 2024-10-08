import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TopNav } from "@/components/topnav";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";
import Script from "next/script";

export const metadata = {
  title: "Homelab Connector",
  description: "Connecting all your homelab services",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
        <html
          suppressHydrationWarning
          lang="en"
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            GeistSans.variable,
          )}
        >
          <Script defer src="https://cloud.umami.is/script.js" data-website-id="5cf4c224-24ad-414e-b94c-c04a285bf21d" />
          <body className="h-screen">
            <ThemeProvider attribute="class" defaultTheme="dark">
              <div className="flex h-full flex-col gap-12 md:gap-0">
                <TopNav />
                <div className="flex h-full flex-col items-center p-4 px-6">
                  {children}
                </div>
              </div>
              {modal}
              <div id="modal-root" />
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
