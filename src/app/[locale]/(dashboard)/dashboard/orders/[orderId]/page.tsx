import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { OrderDetailView } from "@/components/organisms/OrderDetailView";
import { findProduct, getDashboardService } from "@/lib/dashboard";

type PageProps = {
  params: Promise<{ locale: string; orderId: string }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
  const { locale, orderId } = await params;
  setRequestLocale(locale);

  const dashboard = getDashboardService();
  const [order, shop, products] = await Promise.all([
    dashboard.getOrder(orderId),
    dashboard.getShop(),
    dashboard.getProducts(),
  ]);

  if (!order) {
    const t = await getTranslations("dashboard");
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

  const product = findProduct(products, order.productId, shop.currency);
  return <OrderDetailView order={order} product={product} />;
}
