import type { Metadata } from "next";
import { Rubik as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Jobremote - Find or Post Developer Positions",
  description:
    "Explore top remote development job opportunities or post your own to attract skilled developers worldwide.",
  keywords: "remote jobs, developer jobs, tech careers, remote work",
  authors: [
    { name: "Remigiusz Wozniak", url: "https://portfolio-remi.vercel.app" },
  ],
  openGraph: {
    title: "Jobremote - Find or Post Developer Positions",
    description:
      "Explore top remote development job opportunities or post your own to attract skilled developers worldwide.",
    url: "https://jobremote.vercel.app/",
    siteName: "Jobremote - Find or Post Developer Positions",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jobremote - Find or Post Developer Positions",
    description:
      "Explore top remote development job opportunities or post your own to attract skilled developers worldwide.",
    creator: "Remigiusz Wozniak",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          fontSans.variable
        )}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
