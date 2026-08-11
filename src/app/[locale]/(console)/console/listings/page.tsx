import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ListingsView } from "@/components/organisms/ListingsView";
import {
  getConsoleService,
  getConsoleSession,
  parseListingsSearchParams,
} from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
};

export default async function ConsoleListingsPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const sp = await searchParams;
  const query = parseListingsSearchParams(sp);
  const data = await getConsoleService().getListings(query);

  return (
    <ListingsView
      data={data}
      filter={query.filter}
      agent={agent}
      locale={locale}
    />
  );
}
