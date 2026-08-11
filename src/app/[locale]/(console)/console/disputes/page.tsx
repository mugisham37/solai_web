import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DisputeQueueView } from "@/components/organisms/DisputeQueueView";
import {
  getConsoleService,
  getConsoleSession,
  parseDisputesSearchParams,
} from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; q?: string }>;
};

export default async function ConsoleDisputesPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const sp = await searchParams;
  const query = parseDisputesSearchParams(sp);
  const data = await getConsoleService().getDisputes(query);

  return (
    <DisputeQueueView
      data={data}
      filter={query.filter}
      q={query.q}
      locale={locale}
    />
  );
}
