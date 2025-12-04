import type { Metadata } from "next";
import { Inter, Caveat, Permanent_Marker, Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500&f[]=satoshi@700&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${caveat.variable} ${permanentMarker.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
