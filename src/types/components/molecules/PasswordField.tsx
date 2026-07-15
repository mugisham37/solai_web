"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPasswordStrength } from "@/lib/password-strength";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  showStrength?: boolean;
  error?: string;
  labelAction?: React.ReactNode;
  className?: string;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "new-password",
  placeholder = "Min 8 characters",
  showStrength = false,
  error,
  labelAction,
  className,
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  const strength = getPasswordStrength(value);

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
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-10 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setVisible((v) => !v)}
          className="text-text-subtle transition-colors hover:text-text"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {showStrength && value ? (
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: `${strength.width}%`, background: strength.color }}
            />
          </div>
          <span
            className="text-[11px] font-medium"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
        </div>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
