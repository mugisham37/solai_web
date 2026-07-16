"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileText,
  Plug,
  Shield,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { settingsNav } from "@/lib/data/app/settings";
import { cn } from "@/lib/utils";

const navIcons: Record<string, LucideIcon> = {
  User,
  Users,
  Shield,
  Plug,
  CreditCard,
  FileText,
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 min-[900px]:grid-cols-[240px_1fr]">
      <aside className="sticky top-14 self-start border-b border-border bg-surface min-[900px]:top-14 min-[900px]:h-[calc(100vh-56px)] min-[900px]:overflow-y-auto min-[900px]:border-b-0 min-[900px]:border-r">
        <nav className="flex gap-1 overflow-x-auto px-3 py-4 min-[900px]:flex-col min-[900px]:overflow-x-visible">
          {settingsNav.map((group) => (
            <div key={group.group} className="min-[900px]:mb-4">
              <h3 className="hidden px-3 pb-2 text-[11px] font-semibold tracking-wider text-text-subtle uppercase min-[900px]:block">
                {group.group}
              </h3>
              <div className="flex gap-1 min-[900px]:flex-col">
                {group.items.map((item) => {
                  const Icon = navIcons[item.icon] ?? User;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors min-[900px]:w-full",
                        active
                          ? "bg-brand-soft text-text"
                          : "text-text-muted hover:bg-surface-2 hover:text-text"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-brand" : "text-text-subtle"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <p className="hidden px-4 pb-4 text-[11px] leading-relaxed text-text-subtle min-[900px]:block">
          Settings apply to your workspace. Some changes require Owner or Admin
          role.
        </p>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
