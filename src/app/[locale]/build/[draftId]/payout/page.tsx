import { setRequestLocale } from "next-intl/server";
import { PayoutTemplate } from "@/components/templates/PayoutTemplate";

type PayoutPageProps = {
  params: Promise<{ locale: string; draftId: string }>;
};

export default async function PayoutPage({ params }: PayoutPageProps) {
  const { locale, draftId } = await params;
  setRequestLocale(locale);
  return <PayoutTemplate draftId={draftId} />;
}
