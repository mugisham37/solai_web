import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RulesView } from "@/components/organisms/RulesView";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsoleRulesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const rules = await getConsoleService().getRules();
  return <RulesView rules={rules} agent={agent} />;
}
