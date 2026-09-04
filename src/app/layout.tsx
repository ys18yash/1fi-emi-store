import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { WishlistCompareProvider } from "@/context/WishlistCompareContext";
import { StickyCompareBar } from "@/components/catalog/StickyCompareBar";

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
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

const themeInitScript = `
  (function() {
    try {
      var key = '1fi_theme_preference';
      var saved = localStorage.getItem(key);
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>
          <WishlistCompareProvider>
            {children}
            <StickyCompareBar />
          </WishlistCompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
