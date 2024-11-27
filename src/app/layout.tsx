import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/navbar";
import { SiteFooter } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:
    "CFind Lost Money - The Registry of Unclaimed Money Australia &amp; New Zealand",
  description:
    "Our FREE search collaborates all of the information kept on Australian &amp; New Zealand Government databases and makes it easy for you to find any money that is owing to you, your family and your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto max-w-full 2xl:max-w-7xl`}>
        <SiteHeader />
        <div className="px-4 md:px-6">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
