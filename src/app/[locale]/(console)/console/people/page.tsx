import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PeopleView } from "@/components/organisms/PeopleView";
import {
  getConsoleService,
  getConsoleSession,
  parsePeopleSearchParams,
} from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string; q?: string }>;
};

export default async function ConsolePeoplePage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const sp = await searchParams;
  const query = parsePeopleSearchParams(sp);
  const data = await getConsoleService().getPeople(query);

  return <PeopleView data={data} filter={query.filter} locale={locale} />;
}
