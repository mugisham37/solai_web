import { SectionLabel } from "@/components/atoms/SectionLabel";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  label,
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1280px] border-b border-border px-4 pt-10 pb-6 md:px-8 md:pt-16 md:pb-8",
        className,
      )}
    >
      <SectionLabel>{label}</SectionLabel>
      <h1 className="mb-3 text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.03em] text-text">
        {title}
      </h1>
      {description && (
        <p className="max-w-[640px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
