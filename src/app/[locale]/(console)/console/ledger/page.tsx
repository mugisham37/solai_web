import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LedgerView } from "@/components/organisms/LedgerView";
import { CAPABILITY_ORDER } from "@/lib/console/permissions";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ConsoleLedgerPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const data = await getConsoleService().getLedger();
  const t = await getTranslations("console");

  const permissionLabels = Object.fromEntries(
    CAPABILITY_ORDER.map((key) => [key, t(`permissions.${key}`)]),
  );

  return (
    <LedgerView
      data={data}
      locale={locale}
      permissionLabels={permissionLabels}
    />
  );
}
