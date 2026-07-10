import { cn } from "@/lib/utils";

interface EmphasisProps {
  children: React.ReactNode;
  className?: string;
}

export function Emphasis({ children, className }: EmphasisProps) {
  return <em className={cn("text-brand italic", className)}>{children}</em>;
}
