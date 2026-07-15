import { cn } from "@/lib/utils";

interface CodeSecretProps {
  secret: string;
  className?: string;
}

export function CodeSecret({ secret, className }: CodeSecretProps) {
  return (
    <code
      className={cn(
        "inline-block rounded-md bg-brand-soft px-3 py-2 font-mono text-sm font-medium tracking-wider text-brand",
        className,
      )}
    >
      {secret}
    </code>
  );
}
