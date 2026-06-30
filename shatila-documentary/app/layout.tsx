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
  title: "Shatila Bakery Factory — Staff & Admin Dashboard · UX Case Study",
  description:
    "Digitizing a 45-year-old bakery's custom-order operation without breaking the trust that built it. An interactive product documentary by Dayala Sankaran.",
  keywords: [
    "UX case study",
    "product design",
    "Shatila Bakery",
    "dashboard design",
    "Dearborn",
    "Dayala Sankaran",
  ],
  authors: [{ name: "Dayala Sankaran" }],
  openGraph: {
    title: "Shatila Bakery Factory — Staff & Admin Dashboard",
    description:
      "An interactive documentary: digitizing a 45-year-old custom-order sweets factory without breaking the trust that built it.",
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
