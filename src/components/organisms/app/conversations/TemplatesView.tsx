"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { messageTemplates } from "@/lib/data/app/conversations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChannelIcon } from "./ChannelIcon";

function parseTemplateVariables(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g);
  return matches ? [...new Set(matches)] : [];
}

const channelLabels = {
  whatsapp: "whatsapp",
  instagram: "instagram",
  meta: "meta",
  google: "google",
} as const;

export function TemplatesView() {
  const [selectedId, setSelectedId] = useState(messageTemplates[0]?.id ?? "");
  const selected =
    messageTemplates.find((t) => t.id === selectedId) ?? messageTemplates[0];
  const variables = useMemo(
    () => (selected ? parseTemplateVariables(selected.body) : []),
    [selected]
  );

  if (!selected) return null;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      <Link
        href="/conversations"
        className="mb-3 inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-text"
      >
        <ChevronLeft className="size-3.5" />
        Conversations
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-[22px] font-bold tracking-tight">
            Message templates
          </h1>
          <p className="max-w-2xl text-[13px] text-text-muted">
            Reusable scripts approved for automated send. Sales Agent uses these
            as starting points and adapts per recipient.
          </p>
        </div>
        <Button className="gap-1.5">
          <Plus className="size-3.5" />
          New template
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[1101px]:grid-cols-[1fr_380px]">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {messageTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedId(template.id)}
              className={cn(
                "flex flex-col gap-2 rounded-lg border-[1.5px] border-border bg-surface p-3.5 text-left transition-colors hover:border-text-subtle",
                selected.id === template.id && "border-brand bg-brand-soft"
              )}
            >
              <div className="flex items-center justify-between">
                <strong className="text-[13px]">{template.name}</strong>
                <ChannelIcon
                  channel={template.channel}
                  size={14}
                  className="text-text-subtle"
                />
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-text-muted">
                {template.body}
              </p>
              <div className="flex gap-1.5 font-mono text-[11px] text-text-subtle tnum">
                <span>{template.uses.toLocaleString()} uses</span>
                <span>·</span>
                <span>Reply: {template.reply}%</span>
              </div>
            </button>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-[18px] min-[1101px]:sticky min-[1101px]:top-20">
          <h3 className="mb-1.5 text-[15px] font-semibold">{selected.name}</h3>
          <div className="mb-3.5 flex items-center gap-1.5 font-mono text-[11.5px] text-text-subtle">
            <ChannelIcon channel={selected.channel} size={14} />
            {channelLabels[selected.channel]} · {selected.uses.toLocaleString()}{" "}
            uses · Reply rate {selected.reply}%
          </div>

          <div className="mb-3.5 rounded-md border border-border bg-bg p-3 text-[13px] leading-relaxed">
            <p>{selected.body}</p>
          </div>

          <h4 className="mt-3 mb-1.5 text-[11px] font-semibold tracking-wide text-text-subtle uppercase">
            Variables used
          </h4>
          {variables.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {variables.map((variable) => (
                <li key={variable}>
                  <code className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px] text-brand">
                    {variable}
                  </code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-subtle">No variables</p>
          )}

          <h4 className="mt-3 mb-1.5 text-[11px] font-semibold tracking-wide text-text-subtle uppercase">
            Permission
          </h4>
          <p className="text-xs text-text-subtle">
            Sales Agent may use this template on any matching segment without
            further approval. Auto-pauses if reply rate drops below 5%.
          </p>

          <div className="mt-3 flex gap-1.5">
            <Button variant="secondary" className="flex-1">
              Edit
            </Button>
            <Button variant="secondary" className="flex-1">
              Duplicate
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
