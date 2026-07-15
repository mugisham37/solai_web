import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  panel: React.ReactNode;
}

export function AuthLayout({ children, panel }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_0.7fr] max-[900px]:grid-cols-1">
      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
          {children}
        </div>
        <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-text-subtle">
          <span>© 2026 Digisi Rwanda</span>
          <div className="flex gap-4">
            <Link href="#" className="text-text-subtle hover:text-text">
              Privacy
            </Link>
            <Link href="#" className="text-text-subtle hover:text-text">
              Terms
            </Link>
          </div>
        </footer>
      </div>
      <aside
        className={cn(
          "hidden border-l border-border bg-surface px-8 py-12 lg:flex lg:items-center lg:justify-center max-[900px]:hidden",
        )}
      >
        <div className="w-full max-w-[340px]">{panel}</div>
      </aside>
    </div>
  );
}
