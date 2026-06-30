import type { Metadata } from "next";
import { Fraunces, DM_Sans, Oswald } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tractor Connect 2.0 — Connected Tractor Companion App · UX Case Study",
  description:
    "Redesigning a connected-tractor companion app for farmers who work with their hands, not their phones. An interactive product documentary by Dayala Sankaran.",
  keywords: [
    "UX case study",
    "product design",
    "Tractor Connect",
    "mobile app design",
    "agriculture technology",
    "Dayala Sankaran",
  ],
  authors: [{ name: "Dayala Sankaran" }],
  openGraph: {
    title: "Tractor Connect 2.0 — Connected Tractor Companion App",
    description:
      "An interactive documentary: redesigning a connected-tractor companion app around how farmers actually think and work.",
    type: "article",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${fraunces.variable} ${dmSans.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <body className="grain">
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
