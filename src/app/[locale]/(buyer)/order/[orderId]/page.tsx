import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ProtectedShell } from "@/components/templates/ProtectedShell";
import { getBuyerService } from "@/lib/buyer";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; orderId: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    { locale, orderId: "1042" },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, orderId } = await params;
  const t = await getTranslations({ locale, namespace: "protected" });
  return {
    title: t("orderTitle", { id: orderId }),
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({ params }: Props) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const order = await getBuyerService().getOrder(orderId);
  if (!order) notFound();

  return <ProtectedShell order={order} />;
}
