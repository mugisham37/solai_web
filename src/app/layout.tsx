import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { siteConfig } from "@/lib/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Autonomous E-Commerce Revenue Engine`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Upload a product. SolAI runs everything else — ads, WhatsApp sales, payments, and explainable optimisation for African e-commerce sellers.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Autonomous E-Commerce Revenue Engine`,
    description:
      "Upload a product. SolAI runs everything else — ads, WhatsApp sales, payments, and explainable optimisation.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Autonomous E-Commerce Revenue Engine`,
    description:
      "Upload a product. SolAI runs everything else — ads, WhatsApp sales, payments, and explainable optimisation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <QueryProvider>
            <SessionProvider>{children}</SessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
