"use client";

import { useState } from "react";
import { Clock, Zap } from "lucide-react";
import type { AbTest, AbTestState } from "@/types/app";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stateStyles: Record<
  AbTestState,
  { bg: string; color: string; label: string }
> = {
  running: {
    bg: "rgba(122,167,255,0.12)",
    color: "var(--info)",
    label: "running",
  },
  completed: {
    bg: "rgba(52,211,153,0.12)",
    color: "var(--success)",
    label: "completed",
  },
  queued: {
    bg: "var(--surface-2)",
    color: "var(--text-muted)",
    label: "queued",
  },
};

interface ExperimentsViewProps {
  tests: AbTest[];
}

export function ExperimentsView({ tests }: ExperimentsViewProps) {
  const [selectedId, setSelectedId] = useState(
    tests.find((t) => t.state === "completed")?.id ?? tests[0]?.id ?? ""
  );
  const selected = tests.find((t) => t.id === selectedId) ?? tests[0];

  if (!selected) {
    return (
      <p className="py-10 text-center text-sm text-text-subtle">
        No experiments yet.
      </p>
    );
  }

  const stateStyle = stateStyles[selected.state];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {tests.length} tests · Min sample 10K per variant
        </p>
        <Button variant="cta" size="sm">
          <Zap className="size-3.5" />
          New experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-2">
          {tests.map((test) => {
            const style = stateStyles[test.state];
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setSelectedId(test.id)}
                className={cn(
                  "rounded-lg border border-border bg-surface p-3.5 text-left transition-colors hover:border-text-subtle",
                  selectedId === test.id && "border-brand bg-brand-soft/30"
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <strong className="text-sm text-text">{test.name}</strong>
                  <span
                    className="shrink-0 rounded-sm px-2 py-0.5 text-[11px] font-medium capitalize"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
                {test.state === "completed" && test.winner && (
                  <span className="text-xs text-success">
                    Variant {test.winner} won · {test.lift}
                  </span>
                )}
                {test.state === "running" && (
                  <span className="text-xs text-text-muted">
                    {test.confidence}% confidence · need{" "}
                    {100 - test.confidence}% more samples
                  </span>
                )}
                {test.state === "queued" && (
                  <span className="text-xs text-text-subtle">
                    Awaiting capacity
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h3 className="mb-2 text-base font-semibold text-text">
            {selected.name}
          </h3>
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <span>
              Metric: <strong className="text-text">{selected.metric}</strong>
            </span>
            <span className="text-text-subtle">·</span>
            <span>
              State:{" "}
              <strong
                className="capitalize"
                style={{ color: stateStyle.color }}
              >
                {selected.state}
              </strong>
            </span>
            {selected.state !== "queued" && (
              <>
                <span className="text-text-subtle">·</span>
                <span>
                  Confidence:{" "}
                  <strong className="text-text">{selected.confidence}%</strong>
                </span>
              </>
            )}
          </div>

          {selected.state !== "queued" ? (
            <div className="mb-5 grid grid-cols-1 gap-3 min-[600px]:grid-cols-[1fr_auto_1fr]">
              {(["a", "b"] as const).map((variant) => {
                const data = selected[variant];
                const isWinner = selected.winner === variant.toUpperCase();
                return (
                  <div key={variant} className="contents min-[600px]:contents">
                    {variant === "b" && (
                      <div className="flex items-center justify-center text-sm font-medium text-text-subtle min-[600px]:flex">
                        vs
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg border border-border bg-bg p-4",
                        isWinner && "border-success/40"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-text-muted uppercase">
                          Variant {variant.toUpperCase()}
                        </span>
                        {isWinner && (
                          <span className="rounded-sm bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success uppercase">
                            Winner
                          </span>
                        )}
                      </div>
                      <strong className="mb-3 block text-sm text-text">
                        {data.name}
                      </strong>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-xs text-text-subtle">
                          {selected.metric}
                        </span>
                        <strong className="font-mono text-lg text-text tnum">
                          {data.val}
                        </strong>
                      </div>
                      <div className="mb-2 font-mono text-xs text-text-subtle tnum">
                        {data.sample.toLocaleString()} samples
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-pill bg-surface-2">
                        <div
                          className={cn(
                            "h-full rounded-pill",
                            isWinner ? "bg-success" : "bg-brand"
                          )}
                          style={{
                            width: `${Math.min(
                              data.sample > 0 ? (data.sample / 25000) * 100 : 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-bg p-5 text-sm text-text-muted">
              <Clock className="size-5 shrink-0 text-text-subtle" />
              <p>Queued. Will start when current experiment completes.</p>
            </div>
          )}

          {selected.state === "completed" && selected.winner && (
            <div className="rounded-lg border border-border bg-bg p-4">
              <strong className="mb-1 block text-sm text-text">Decision</strong>
              <p className="mb-2 text-sm leading-relaxed text-text-muted">
                SolAI rolled Variant <strong>{selected.winner}</strong> to 100%
                after sustained improvement of{" "}
                <strong>{selected.lift}</strong> on {selected.metric}.
              </p>
              <button
                type="button"
                className="text-sm font-medium text-brand hover:underline"
              >
                View audit entry →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
