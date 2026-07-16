"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Conversation } from "@/types/app";
import { ChannelDot } from "@/components/atoms/app/ChannelChip";
import { ConversationStatusPill } from "@/components/atoms/app/StatePill";
import { FilterPills } from "@/components/molecules/app/FilterPills";
import { conversations, threadMessages } from "@/lib/data/app/conversations";
import { cn } from "@/lib/utils";
import { ThreadView } from "./ThreadView";

type InboxFilter = "all" | "needs" | "handling" | "won" | "quarantine";

function avatarInitials(name: string) {
  return name.replace("@", "").slice(0, 2).toUpperCase();
}

function matchesFilter(
  conversation: Conversation,
  filter: InboxFilter
): boolean {
  if (filter === "needs") return conversation.status === "needs-human";
  if (filter === "handling") return conversation.status === "agent-handling";
  if (filter === "won") return conversation.status === "closed";
  if (filter === "quarantine") return conversation.status === "quarantine";
  return true;
}

function matchesSearch(conversation: Conversation, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    conversation.name.toLowerCase().includes(q) ||
    conversation.preview.toLowerCase().includes(q) ||
    conversation.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function InboxView() {
  const router = useRouter();
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);

  const counts = useMemo(
    () => ({
      all: conversations.length,
      needs: conversations.filter((c) => c.status === "needs-human").length,
      handling: conversations.filter((c) => c.status === "agent-handling")
        .length,
      won: conversations.filter((c) => c.status === "closed").length,
      quarantine: conversations.filter((c) => c.status === "quarantine")
        .length,
    }),
    []
  );

  const filtered = useMemo(
    () =>
      conversations.filter(
        (c) => matchesFilter(c, filter) && matchesSearch(c, search)
      ),
    [filter, search]
  );

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];
  const activeMessages = activeConversation
    ? (threadMessages[activeConversation.id] ?? [])
    : [];

  const handleFilterChange = (id: string) => {
    if (id === "quarantine") {
      router.push("/conversations/quarantine");
      return;
    }
    setFilter(id as InboxFilter);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveId(conversation.id);
    setMobileThreadOpen(true);
  };

  const filterOptions = [
    { id: "all", label: "All", count: counts.all },
    { id: "needs", label: "Needs you", count: counts.needs },
    { id: "handling", label: "Agent", count: counts.handling },
    { id: "won", label: "Won", count: counts.won },
    { id: "quarantine", label: "Quarantine", count: counts.quarantine },
  ];

  return (
    <div className="flex h-[calc(100dvh-56px)] min-h-0">
      <div className="grid h-full w-full grid-cols-[380px_1fr] max-[1100px]:grid-cols-1">
        <aside
          className={cn(
            "flex min-h-0 flex-col overflow-hidden border-r border-border bg-surface",
            mobileThreadOpen && "max-[1100px]:hidden"
          )}
        >
          <div className="border-b border-border px-[18px] pt-[18px] pb-3">
            <h1 className="mb-1 text-[22px] font-bold tracking-tight">
              Conversations
            </h1>
            <p className="text-[13px] text-text-muted">
              {counts.all} threads · {counts.needs} need you · last 24h
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-bg px-3">
              <Search className="size-3.5 shrink-0 text-text-subtle" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, message, order ID…"
                className="w-full border-0 bg-transparent py-2 text-[13px] text-text outline-none placeholder:text-text-subtle"
              />
            </div>
          </div>

          <FilterPills
            options={filterOptions}
            value={filter}
            onChange={handleFilterChange}
            className="overflow-x-auto border-b border-border px-3.5 py-2.5"
          />

          <div className="flex-1 overflow-y-auto p-1.5">
            {filtered.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleSelectConversation(conversation)}
                className={cn(
                  "flex w-full gap-3 rounded-md p-3 text-left transition-colors hover:bg-surface-2",
                  activeId === conversation.id && "bg-brand-soft",
                  conversation.unread && "[&_strong]:text-text [&_p]:text-text"
                )}
              >
                <div className="relative flex size-[38px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-text-muted">
                  {avatarInitials(conversation.name)}
                  <ChannelDot channel={conversation.channel} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-baseline justify-between gap-1.5">
                    <strong className="truncate text-[13px] font-medium text-text-muted">
                      {conversation.name}
                    </strong>
                    <span className="shrink-0 font-mono text-[11px] text-text-subtle tnum">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="mb-1.5 line-clamp-2 text-xs leading-snug text-text-subtle">
                    {conversation.preview}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    <ConversationStatusPill status={conversation.status} />
                    {conversation.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section
          className={cn(
            "flex min-h-0 flex-col overflow-hidden bg-bg",
            !mobileThreadOpen && "max-[1100px]:hidden",
            "min-[1101px]:flex"
          )}
        >
          {activeConversation ? (
            <ThreadView
              conversation={activeConversation}
              messages={activeMessages}
              onBack={() => setMobileThreadOpen(false)}
              showTyping={activeConversation.id === "cv1"}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
              Select a conversation
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
