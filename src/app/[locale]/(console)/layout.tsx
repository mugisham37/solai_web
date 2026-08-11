import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ConsoleShell } from "@/components/organisms/ConsoleShell";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type ConsoleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "SolAI Console",
};

/**
 * Shared console layout — shell mounts once so sidebar/bottom nav persist.
 * Separate session cookie from seller/buyer apps. noindex.
 * Unauthenticated: render children only (login page). Authenticated: shell.
 */
export default async function ConsoleLayout({
  children,
  params,
}: ConsoleLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();

  if (!agent) {
    return <>{children}</>;
  }

  const breachBadge = await getConsoleService().getBreachCount();

  return (
    <ConsoleShell agent={agent} breachBadge={breachBadge}>
      {children}
    </ConsoleShell>
  );
}
