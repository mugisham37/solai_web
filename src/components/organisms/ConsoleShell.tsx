import { ToastProvider } from "@/components/providers/ToastProvider";
import { ConsoleChrome } from "@/components/organisms/ConsoleChrome";
import type { ConsoleAgent } from "@/types/console";

type ConsoleShellProps = {
  children: React.ReactNode;
  agent: ConsoleAgent;
  breachBadge?: number;
  className?: string;
};

export function ConsoleShell({
  children,
  agent,
  breachBadge = 0,
  className,
}: ConsoleShellProps) {
  return (
    <ToastProvider>
      <ConsoleChrome
        agent={agent}
        breachBadge={breachBadge}
        className={className}
      >
        {children}
      </ConsoleChrome>
    </ToastProvider>
  );
}
