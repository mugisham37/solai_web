"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/ui/button";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${inter.className} ${jetbrainsMono.className}`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
        <Logo size={32} asLink={false} className="mb-6" />
        <h1 className="mb-2 text-2xl font-bold">Critical error</h1>
        <p className="mb-6 text-text-muted">
          The application encountered a critical error.
        </p>
        <Button variant="cta" onClick={reset}>
          Try again
        </Button>
      </body>
    </html>
  );
}
