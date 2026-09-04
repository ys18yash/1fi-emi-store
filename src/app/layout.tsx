import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "1Fi - Shop Using Your Mutual Funds | Flagship EMI Platform",
  description:
    "India's first LAMF-based shopping platform. Buy smartphones and electronics with 0% No-Cost EMI without selling your mutual fund investments. Keep earning wealth while you shop.",
  keywords: [
    "1Fi",
    "Mutual Fund EMI",
    "LAMF Shopping",
    "No-Cost EMI",
    "iPhone 17 Pro EMI",
    "Loan Against Mutual Funds",
  ],
  authors: [{ name: "1Fi" }],
  icons: {
    icon: "/1fi-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-950">
        {children}
      </body>
    </html>
  );
}
