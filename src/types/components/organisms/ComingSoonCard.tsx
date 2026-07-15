import { Logo } from "@/components/atoms/Logo";
import { MarketingButton } from "@/components/molecules/MarketingButton";

interface ComingSoonCardProps {
  title: string;
  message: string;
}

export function ComingSoonCard({ title, message }: ComingSoonCardProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Logo size={32} asLink={false} className="mb-6" />
      <h1 className="mb-3 text-2xl font-bold text-text">{title}</h1>
      <p className="mb-6 text-text-muted">{message}</p>
      <MarketingButton href="/" variant="secondary">
        Back to home
      </MarketingButton>
    </div>
  );
}
