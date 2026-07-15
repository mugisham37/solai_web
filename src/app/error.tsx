"use client";

import { useEffect } from "react";
import { Logo } from "@/components/atoms/Logo";
import { MarketingButton } from "@/components/molecules/MarketingButton";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Logo size={32} asLink={false} className="mb-6" />
      <h1 className="mb-2 text-2xl font-bold text-text">Something went wrong</h1>
      <p className="mb-6 text-text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <Button variant="cta" onClick={reset}>
          Try again
        </Button>
        <MarketingButton href="/" variant="secondary">
          Back to home
        </MarketingButton>
      </div>
    </div>
  );
}
