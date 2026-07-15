import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  error?: string;
  labelAction?: React.ReactNode;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon,
  prefix,
  error,
  labelAction,
  inputMode,
  className,
}: AuthFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={id}
        className="flex items-center justify-between text-[13px] font-medium text-text"
      >
        {label}
        {labelAction}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-border bg-bg px-3 transition-[border-color,box-shadow] duration-120 focus-within:border-brand focus-within:ring-[3px] focus-within:ring-brand-soft",
          error &&
            "border-danger focus-within:border-danger focus-within:ring-danger/20",
        )}
      >
        {icon ? <span className="text-text-subtle">{icon}</span> : null}
        {prefix}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="h-10 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
