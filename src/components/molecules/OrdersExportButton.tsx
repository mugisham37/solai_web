"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { formatMoney } from "@/lib/money";
import { orderNet, orderTotal } from "@/lib/dashboard/derive";
import { ORDER_STATUS } from "@/lib/dashboard/status";
import type { DashboardOrder, DashboardProduct } from "@/types/dashboard";

type OrdersExportButtonProps = {
  orders: readonly DashboardOrder[];
  productsById: Readonly<Record<string, DashboardProduct>>;
  statusLabels: Readonly<Record<string, string>>;
  locale: string;
};

function csvEscape(value: string | number): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Downloads a CSV of the currently filtered rows only. */
export function OrdersExportButton({
  orders,
  productsById,
  statusLabels,
  locale,
}: OrdersExportButtonProps) {
  const t = useTranslations("dashboard");

  const onExport = () => {
    const head = [
      "Order",
      "Buyer",
      "Area",
      "Product",
      "Qty",
      "Total",
      "Fees",
      "Your payout",
      "Status",
      "When",
    ];
    const rows = orders.map((o) => {
      const product = productsById[o.productId];
      const total = orderTotal(o);
      const net = orderNet(o);
      const fees = o.fee.amountMinor + o.disbursement.amountMinor;
      return [
        o.id,
        o.buyerName,
        o.buyerArea,
        product?.name ?? "",
        o.qty,
        formatMoney(total, locale),
        formatMoney({ amountMinor: fees, currency: o.fee.currency }, locale),
        formatMoney(net, locale),
        statusLabels[o.status] ?? ORDER_STATUS[o.status].labelKey,
        o.whenLabel,
      ];
    });

    const body = [head, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");
    const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solai-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ActionButton type="button" variant="line" size="sm" onClick={onExport}>
      <Icon name="download" size="sm" />
      {t("orders.export")}
    </ActionButton>
  );
}
