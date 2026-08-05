import { setRequestLocale } from "next-intl/server";
import { ShareTemplate } from "@/components/templates/ShareTemplate";

type SharePageProps = {
  params: Promise<{ locale: string; draftId: string }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { locale, draftId } = await params;
  setRequestLocale(locale);
  return <ShareTemplate draftId={draftId} />;
}
