"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerformanceDataPoint } from "@/types/app";
import { cn } from "@/lib/utils";

type PerformanceRange = "7d" | "30d" | "90d";

const ranges: { value: PerformanceRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];

interface PerformanceChartProps {
  data: Record<PerformanceRange, PerformanceDataPoint[]>;
  className?: string;
}

function formatCurrency(value: number) {
  return `US$ ${value.toLocaleString()}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--e3)]">
      <p className="mb-1.5 font-mono text-xs text-text-subtle">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 font-mono text-xs"
          >
            <span className="text-text-muted capitalize">{entry.name}</span>
            <span className="tnum font-medium text-text">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  const [range, setRange] = useState<PerformanceRange>("7d");
  const chartData = data[range];

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-5",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-text">
          Revenue &amp; Spend
        </h2>
        <div
          className="inline-flex rounded-md border border-border bg-surface-2 p-0.5"
          role="group"
          aria-label="Performance range"
        >
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRange(item.value)}
              className={cn(
                "rounded-sm px-2.5 py-1 font-mono text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                range === item.value
                  ? "bg-brand text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--info)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--text-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: "var(--text-subtle)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) =>
                value >= 1000
                  ? `$${Math.round(value / 1000)}k`
                  : `$${value}`
              }
              width={48}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="var(--brand)"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
            <Area
              type="monotone"
              dataKey="spend"
              name="spend"
              stroke="var(--info)"
              strokeWidth={2}
              fill="url(#spendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
