import { Logo } from "@/components/atoms/Logo";
import { MarketingButton } from "@/components/molecules/MarketingButton";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Logo size={32} asLink={false} className="mb-6" />
      <h1 className="mb-2 text-6xl font-bold text-text">404</h1>
      <p className="mb-6 text-text-muted">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <MarketingButton href="/" variant="cta">
        Back to home
      </MarketingButton>
    </div>
  );
}
