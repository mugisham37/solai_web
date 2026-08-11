import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { OverviewView } from "@/components/organisms/OverviewView";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsoleOverviewPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const snapshot = await getConsoleService().getOverview();
  return <OverviewView snapshot={snapshot} locale={locale} />;
}
