import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import QueryProvider from './query-provider';
import { ThemeProvider } from "../components/theme-provider";

// Load fonts without subsets to reduce complexity
const geistSans = Geist({
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Loan Application Evaluation System",
  description: "Application for bank employees to evaluate loan applications",
  keywords: ["loan", "bank", "evaluation", "application", "finance"],
  authors: [{ name: "Bank Corp" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.className} antialiased h-full`}>
        <Providers>
          <ThemeProvider defaultTheme="light">
            <QueryProvider>
              <main className="min-h-full">{children}</main>
            </QueryProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
