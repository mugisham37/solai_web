"use client";

import { useState } from "react";
import { Send, X, Zap } from "lucide-react";
import type { CopilotMessage } from "@/types/app";
import { cn } from "@/lib/utils";

interface CopilotWidgetProps {
  messages: CopilotMessage[];
  className?: string;
}

export function CopilotWidget({ messages, className }: CopilotWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className={cn(
          "fixed right-6 bottom-6 z-60 flex size-12 items-center justify-center rounded-full bg-brand text-white shadow-[0_4px_16px_rgba(91,124,255,0.3)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          className
        )}
        aria-label="Open SolAI Copilot"
      >
        <Zap className="size-5" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-6 bottom-6 z-60 flex h-[520px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.2)] max-[640px]:h-[70vh]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-text">
          <Zap className="size-4 text-brand" strokeWidth={1.5} />
          <span>SolAI Copilot</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="rounded-sm p-1 text-text-subtle transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Close Copilot"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "flex gap-2",
              message.role === "user" && "justify-end"
            )}
          >
            {message.role === "ai" && (
              <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Zap className="size-3.5" strokeWidth={1.5} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed",
                message.role === "ai"
                  ? "rounded-bl-sm bg-surface-2 text-text-muted"
                  : "rounded-br-sm bg-brand text-white"
              )}
            >
              <p>{message.text}</p>
              {message.agent && (
                <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-1.5 text-[11px]">
                  <span className="font-medium text-brand">{message.agent}</span>
                  {message.runId && (
                    <code className="font-mono text-[10px] text-text-subtle">
                      {message.runId}
                    </code>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-border px-4 py-3">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask SolAI anything…"
          className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-[13px] text-text placeholder:text-text-subtle focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          disabled={!input.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Send message"
        >
          <Send className="size-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
