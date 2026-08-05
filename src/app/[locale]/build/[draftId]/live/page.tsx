import { setRequestLocale } from "next-intl/server";
import { LiveTemplate } from "@/components/templates/LiveTemplate";

type LivePageProps = {
  params: Promise<{ locale: string; draftId: string }>;
};

export default async function LivePage({ params }: LivePageProps) {
  const { locale, draftId } = await params;
  setRequestLocale(locale);
  return <LiveTemplate draftId={draftId} />;
}
