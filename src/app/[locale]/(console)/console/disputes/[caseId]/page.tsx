import { notFound, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CaseView } from "@/components/organisms/CaseView";
import { getConsoleService, getConsoleSession } from "@/lib/console";

type PageProps = {
  params: Promise<{ locale: string; caseId: string }>;
};

export default async function ConsoleCasePage({ params }: PageProps) {
  const { locale, caseId } = await params;
  setRequestLocale(locale);

  const agent = await getConsoleSession();
  if (!agent) redirect("/console/login");

  const service = getConsoleService();
  const [dispute, threshold] = await Promise.all([
    service.getDispute(caseId),
    service.getApprovalThreshold(),
  ]);

  if (!dispute) notFound();

  return (
    <CaseView
      dispute={dispute}
      agent={agent}
      approvalThreshold={threshold}
      locale={locale}
    />
  );
}
