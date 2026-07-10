import type { LogoItem } from "@/types/marketing";

export function LogoChip({ logo }: { logo: LogoItem }) {
  return (
    <div className="rounded-md border border-border bg-surface px-5 py-2 text-[13px] font-medium text-text-muted">
      {logo.name}
    </div>
  );
}
