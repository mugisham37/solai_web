import { Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ConsoleBrandProps = {
  className?: string;
};

export function ConsoleBrand({ className }: ConsoleBrandProps) {
  return (
    <Link
      href="/console"
      className={cn(
        "inline-flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink uppercase",
        className,
      )}
    >
      <span className="grid size-6 place-items-center rounded-[9px] bg-sun text-sun-ink">
        <Zap className="size-3.5" strokeWidth={1.7} aria-hidden />
      </span>
      <span>
        Sol<span className="text-sun-deep">AI</span>
      </span>
      <span className="rounded-pill bg-mauve/20 px-2 py-0.5 text-[0.62rem] font-bold normal-case tracking-wide text-[#5E4478]">
        Console
      </span>
    </Link>
  );
}
