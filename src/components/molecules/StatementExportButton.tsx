"use client";

import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import { useToastContext } from "@/components/providers/ToastProvider";
import { formatMoney } from "@/lib/money";
import type { DashboardPayout } from "@/types/dashboard";

type StatementExportButtonProps = {
  payouts: readonly DashboardPayout[];
  locale: string;
};

function csvEscape(value: string | number): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Client-side statement CSV — mirrors the HTML prototype download. */
export function StatementExportButton({
  payouts,
  locale,
}: StatementExportButtonProps) {
  const t = useTranslations("dashboard");
  const { toast } = useToastContext();

  const onExport = () => {
    const head = ["Payout", "Order", "Amount", "Settled in (s)", "When"];
    const rows = payouts.map((p) => [
      p.id,
      p.orderId,
      formatMoney(p.amount, locale),
      p.settledSeconds,
      p.whenLabel,
    ]);
    const body = [head, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\r\n");
    const blob = new Blob(["\ufeff" + body], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solai-statement.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast(t("money.statementDownloaded"));
  };

  return (
    <ActionButton type="button" variant="line" size="sm" onClick={onExport}>
      <Icon name="download" size="sm" />
      {t("money.statement")}
    </ActionButton>
  );
}
