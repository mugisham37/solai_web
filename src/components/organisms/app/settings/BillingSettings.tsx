import { Download } from "lucide-react";
import { UsageBar } from "@/components/molecules/app/BudgetBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  invoices,
  spendEnvelopes,
  usageMetrics,
} from "@/lib/data/app/settings";
import { workspace } from "@/lib/data/app/nav";

function formatUsageValue(value: number, unit: string) {
  if (unit === "GB") return `${value} GB`;
  return value.toLocaleString();
}

export function BillingSettings() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Billing & usage
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Plan, agent runs, and spend envelopes for July 2026.
          </p>
        </div>
        <Button variant="secondary">
          <Download className="size-4" />
          Download invoices
        </Button>
      </header>

      <section className="mb-4 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-brand/8 to-transparent">
        <div className="grid grid-cols-1 items-center gap-6 p-[22px] min-[900px]:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold tracking-wider text-brand uppercase">
              Current plan
            </p>
            <h2 className="mb-1.5 text-[28px] font-bold tracking-tight text-text">
              {workspace.plan}
            </h2>
            <p className="mb-3.5 max-w-[480px] text-sm text-text-muted">
              For shops doing $10K–$80K/mo. Up to 4 agents, 200K runs, 5
              channels.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">Compare plans</Button>
              <Button variant="default">Upgrade to Scale</Button>
            </div>
          </div>
          <div className="min-[900px]:text-right">
            <p className="font-mono text-[38px] leading-none font-semibold tracking-tight text-text">
              <span className="mr-1 text-sm font-medium text-text-muted">
                US$
              </span>
              89
              <span className="ml-1 text-sm font-medium text-text-muted">
                /mo
              </span>
            </p>
            <p className="mt-1.5 text-xs text-text-subtle">
              Billed monthly · Next charge 1 Aug · Visa •• 4421
            </p>
          </div>
        </div>
      </section>

      <div className="mb-4 grid grid-cols-1 gap-4 min-[900px]:grid-cols-2">
        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-[18px] py-3.5">
            <h2 className="text-sm font-semibold text-text">
              Usage this period
            </h2>
            <span className="font-mono text-xs text-text-muted">
              1–15 Jul · resets in 16 days
            </span>
          </div>
          <div className="flex flex-col gap-3.5 px-[18px] py-[18px]">
            {usageMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text">{metric.label}</span>
                  <span className="font-mono text-xs text-text-muted tnum">
                    {formatUsageValue(metric.used, metric.unit)} /{" "}
                    {formatUsageValue(metric.max, metric.unit)}
                  </span>
                </div>
                <UsageBar used={metric.used} max={metric.max} />
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between gap-2 border-b border-border px-[18px] py-3.5">
            <h2 className="text-sm font-semibold text-text">Spend envelopes</h2>
            <Button variant="link" size="sm" className="h-auto p-0">
              Edit →
            </Button>
          </div>
          <p className="px-[18px] pb-3 text-xs text-text-subtle">
            Caps that prevent agents from over-spending. They auto-pause when
            hit.
          </p>
          <div className="flex flex-col gap-3.5 px-[18px] pb-[18px]">
            {spendEnvelopes.map((envelope) => (
              <div key={envelope.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-text">{envelope.label}</span>
                  <span className="font-mono text-xs text-text-muted tnum">
                    {envelope.currency === "US$"
                      ? `${envelope.currency} ${envelope.used.toLocaleString()} / ${envelope.currency} ${envelope.max.toLocaleString()}`
                      : envelope.currency === "RWF"
                        ? `${envelope.used.toLocaleString()} / ${envelope.max.toLocaleString()} ${envelope.currency}`
                        : `${envelope.used.toLocaleString()} / ${envelope.max.toLocaleString()} ${envelope.currency}`}
                  </span>
                </div>
                <UsageBar used={envelope.used} max={envelope.max} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-[18px] py-3.5">
          <h2 className="text-sm font-semibold text-text">Recent invoices</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-2 hover:bg-surface-2">
              <TableHead className="px-[18px]">Period</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.period}>
                <TableCell className="px-[18px] font-medium text-text">
                  {invoice.period}
                </TableCell>
                <TableCell>{invoice.plan}</TableCell>
                <TableCell className="font-mono text-xs text-text-muted">
                  {invoice.amount}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      invoice.status === "paid"
                        ? "border-0 bg-success/10 font-mono text-[10px] text-success uppercase"
                        : "border-0 bg-warning/10 font-mono text-[10px] text-warning uppercase"
                    }
                  >
                    {invoice.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Download PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
