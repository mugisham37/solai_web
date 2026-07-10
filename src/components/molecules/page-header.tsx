import { SectionLabel } from "@/components/atoms/section-label";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  subCopy?: string;
  children?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, subCopy, children }: PageHeaderProps) {
  return (
    <section className="mx-auto max-w-[1280px] border-b border-border px-4 pt-10 pb-8 sm:px-8 sm:pt-16 sm:pb-8">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h1 className="mb-3 text-[clamp(28px,4vw,44px)] font-bold tracking-[-0.03em] text-text">
        {title}
      </h1>
      {subCopy && (
        <p className="max-w-[640px] text-[clamp(16px,1.8vw,18px)] text-text-muted">
          {subCopy}
        </p>
      )}
      {children}
    </section>
  );
}
