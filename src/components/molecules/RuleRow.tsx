"use client";

import { useState, useTransition } from "react";
import { updateMarketRulesAction } from "@/app/actions/console/rules";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { MarketRules } from "@/types/console";

type RuleField = {
  key: string;
  title: string;
  subtitle: string;
  value: string;
  parse: (raw: string) => number | null;
};

type RuleRowProps = {
  market: MarketRules;
  locked: boolean;
  className?: string;
};

function buildFields(market: MarketRules): RuleField[] {
  return [
    {
      key: "confirmationWindowHours",
      title: "Confirmation window",
      subtitle: "Auto-release this long after delivery",
      value: `${market.confirmationWindowHours} hours`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
    {
      key: "deliverySlaDays",
      title: "Delivery SLA",
      subtitle: "Auto-refund if nothing is delivered by",
      value: `${market.deliverySlaDays} days`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
    {
      key: "newSellerReservePercent",
      title: "New-seller reserve",
      subtitle: "Held back on the first 10 orders",
      value: `${market.newSellerReservePercent}%`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
    {
      key: "newSellerOrderCap",
      title: "New-seller order cap",
      subtitle: "Refuse orders above this for the first 3 orders",
      value: `RWF ${market.newSellerOrderCap.amountMinor.toLocaleString("en")}`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
    {
      key: "approvalThreshold",
      title: "Second approver above",
      subtitle: "Disputes needing two names",
      value: `RWF ${market.approvalThreshold.amountMinor.toLocaleString("en")}`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
    {
      key: "disputeAnswerHours",
      title: "Dispute answer promise",
      subtitle: "Published on the buyer storefront",
      value: `${market.disputeAnswerHours} hours`,
      parse: (raw) => {
        const n = Number.parseInt(raw.replace(/\D/g, ""), 10);
        return Number.isFinite(n) ? n : null;
      },
    },
  ];
}

export function RuleRow({ market, locked, className }: RuleRowProps) {
  const fields = buildFields(market);
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState(
    Object.fromEntries(fields.map((f) => [f.key, f.value])),
  );

  const save = (key: string, raw: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return;
    const parsed = field.parse(raw);
    if (parsed === null) {
      toast("Invalid value");
      return;
    }

    startTransition(async () => {
      const patch: Record<string, number> = {};
      if (key === "approvalThreshold") {
        patch.approvalThresholdMinor = parsed;
      } else if (key === "newSellerOrderCap") {
        // handled specially below
      } else {
        patch[key] = parsed;
      }

      const result = await updateMarketRulesAction(market.market, {
        confirmationWindowHours:
          key === "confirmationWindowHours" ? parsed : undefined,
        deliverySlaDays: key === "deliverySlaDays" ? parsed : undefined,
        newSellerReservePercent:
          key === "newSellerReservePercent" ? parsed : undefined,
        disputeAnswerHours: key === "disputeAnswerHours" ? parsed : undefined,
        approvalThresholdMinor:
          key === "approvalThreshold" ? parsed : undefined,
        newSellerOrderCap:
          key === "newSellerOrderCap"
            ? {
                amountMinor: parsed,
                currency: market.newSellerOrderCap.currency,
              }
            : undefined,
      });

      if (result.ok) {
        toast("Rule saved · new version, not retroactive");
        router.refresh();
      } else toast("Could not save rule");
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {fields.map((field) => (
        <div key={field.key} className="flex items-start gap-3">
          <span className="min-w-0 flex-1">
            <span className="block text-[0.92rem] font-bold text-ink">
              {field.title}
            </span>
            <span className="block text-[0.74rem] text-ink-45">
              {field.subtitle}
            </span>
          </span>
          <input
            className="max-w-[150px] rounded-xl border border-ink-20 bg-white px-3 py-2.5 text-right text-[0.95rem] outline-none focus:border-sun focus:ring-[3px] focus:ring-sun/20 disabled:opacity-50"
            value={values[field.key]}
            disabled={locked || pending}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
            }
            onBlur={(e) => {
              if (!locked && e.target.value !== field.value) {
                save(field.key, e.target.value);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}
