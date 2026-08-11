import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ConsoleLoginView } from "@/components/organisms/ConsoleLoginView";
import { getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsoleLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (agent) redirect("/console");

  return <ConsoleLoginView />;
}
