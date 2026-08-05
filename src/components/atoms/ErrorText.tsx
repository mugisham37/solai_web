import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type ErrorTextProps = {
  id?: string;
  message?: string;
  className?: string;
};

export function ErrorText({ id, message, className }: ErrorTextProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("flex items-center gap-1 text-[0.76rem] font-semibold text-clay", className)}
    >
      <Icon name="alert" size="sm" className="size-[13px]" />
      <span>{message}</span>
    </p>
  );
}
