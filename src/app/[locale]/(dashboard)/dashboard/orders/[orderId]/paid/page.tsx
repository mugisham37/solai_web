import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PaidView } from "@/components/organisms/PaidView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string; orderId: string }>;
};

export default async function PaidPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [order, shop] = await Promise.all([
    dashboard.getOrder(orderId),
    dashboard.getShop(),
  ]);
  const t = await getTranslations("dashboard");

  if (!order) {
    return (
      <EmptyState
        icon="alert"
        title={t("orders.notFoundTitle")}
        description={t("orders.notFoundLede")}
        action={
          <ActionButton asChild variant="line" size="sm">
            <Link href="/dashboard/orders">{t("orders.backToOrders")}</Link>
          </ActionButton>
        }
      />
    );
  }

  if (order.status !== "paid") {
    return (
      <EmptyState
        icon="info"
        title={t("paid.notYetTitle")}
        description={t("paid.notYetLede")}
        action={
          <ActionButton asChild variant="line" size="sm">
            <Link href={`/dashboard/orders/${orderId}`}>
              {t("deliver.back")}
            </Link>
          </ActionButton>
        }
      />
    );
  }

  return <PaidView order={order} shop={shop} />;
}
