import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorBannerProps {
  message: string;
  className?: string;
}

export function FormErrorBanner({ message, className }: FormErrorBannerProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
