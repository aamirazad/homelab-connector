import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TopNav } from "./_components/topnav";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./_components/theme-provider";

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
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="">
          <ThemeProvider attribute="class" defaultTheme="dark">
            <TopNav />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
