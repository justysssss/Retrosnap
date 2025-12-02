import type { Metadata } from "next";
import { Inter, Caveat, Permanent_Marker } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RetroSnap",
  description: "The Collaborative Polaroid Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${caveat.variable} ${permanentMarker.variable} antialiased font-sans bg-[#e5e5e5] text-stone-800`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
