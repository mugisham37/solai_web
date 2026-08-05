import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { DeliverView } from "@/components/organisms/DeliverView";
import { getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string; orderId: string }>;
};

export default async function DeliverPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const order = await getDashboardService().getOrder(orderId);
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

  if (order.status === "paid") {
    redirect({ href: `/dashboard/orders/${orderId}/paid`, locale });
  }

  if (order.status !== "held" && order.status !== "transit") {
    return (
      <EmptyState
        icon="alert"
        title={t("deliver.notReleasableTitle")}
        description={t("deliver.notReleasable")}
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

  return <DeliverView order={order} />;
}
