import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PersonFileView } from "@/components/organisms/PersonFileView";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string; personId: string }>;
};

export default async function ConsolePersonPage({ params }: PageProps) {
  const { locale, personId } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const person = await getConsoleService().getPerson(personId);
  if (!person) notFound();

  return <PersonFileView person={person} agent={agent} locale={locale} />;
}
