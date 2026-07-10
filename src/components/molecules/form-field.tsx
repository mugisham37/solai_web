import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, className, children }: FormFieldProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-text">
        {label}
      </label>
      {children}
    </div>
  );
}

export const FORM_CONTROL_CLASSES =
  "w-full rounded-md border border-border bg-bg px-3 py-2.5 font-sans text-sm text-text transition-colors duration-150 ease-brand focus:border-brand focus:ring-3 focus:ring-brand-soft focus:outline-none";
