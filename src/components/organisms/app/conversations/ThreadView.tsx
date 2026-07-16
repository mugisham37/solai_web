"use client";

import {
  ChevronLeft,
  Hand,
  MoreVertical,
  Paperclip,
  Send,
  Shield,
  Sparkles,
} from "lucide-react";
import type { Conversation, ThreadMessage } from "@/types/app";
import { ChannelDot } from "@/components/atoms/app/ChannelChip";
import { ConversationStatusPill } from "@/components/atoms/app/StatePill";
import { WhyPopover } from "@/components/molecules/app/WhyPopover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const channelLabels: Record<Conversation["channel"], string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  meta: "Meta Messenger",
  google: "Google",
};

function avatarInitials(name: string) {
  return name.replace("@", "").slice(0, 2).toUpperCase();
}

interface ThreadViewProps {
  conversation: Conversation;
  messages: ThreadMessage[];
  onBack?: () => void;
  showTyping?: boolean;
  suggestions?: string[];
}

export function ThreadView({
  conversation,
  messages,
  onBack,
  showTyping = false,
  suggestions = [
    "Confirm waitlist #4823",
    "Send size guide",
    "Offer 10% off bundle",
  ],
}: ThreadViewProps) {
  const metaParts = [
    conversation.phone,
    conversation.location,
    channelLabels[conversation.channel],
  ].filter(Boolean);

  const agentLabel =
    conversation.agent === "sales"
      ? "Sales"
      : conversation.agent === "support"
        ? "Support"
        : "Agent";

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex size-8 items-center justify-center rounded-sm text-text-muted hover:bg-surface-2 hover:text-text max-[1100px]:flex min-[1101px]:hidden"
            aria-label="Back to inbox"
          >
            <ChevronLeft className="size-[18px]" />
          </button>
        )}
        <div className="relative flex size-[42px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-[13px] font-semibold text-text-muted">
          {avatarInitials(conversation.name)}
          <ChannelDot channel={conversation.channel} />
        </div>
        <div className="min-w-0 flex-1">
          <strong className="block truncate text-sm">{conversation.name}</strong>
          <span className="font-mono text-[11px] text-text-subtle">
            {metaParts.join(" · ")}
          </span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <ConversationStatusPill status={conversation.status} />
          {conversation.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-sm text-text-muted hover:bg-surface-2 hover:text-text"
          title="Take over"
        >
          <Hand className="size-4" />
        </button>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-sm text-text-muted hover:bg-surface-2 hover:text-text"
          title="More"
        >
          <MoreVertical className="size-4" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 py-5">
        <div className="my-2 flex items-center justify-center">
          <span className="rounded-pill border border-border bg-bg px-2.5 py-0.5 font-mono text-[11px] text-text-subtle">
            Today · 10:42 EAT
          </span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[75%] gap-2",
              message.who === "them" ? "self-start" : "self-end flex-row-reverse"
            )}
          >
            {message.who === "agent" && (
              <div className="mb-0.5 flex size-6 shrink-0 items-center justify-center self-end rounded-full bg-brand-soft text-brand">
                <Sparkles className="size-3" />
              </div>
            )}
            <div className="min-w-0">
              <div
                className={cn(
                  "rounded-lg px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                  message.who === "them"
                    ? "rounded-bl-sm border border-border bg-surface text-text"
                    : "rounded-br-sm bg-brand text-white"
                )}
              >
                {message.who === "agent" && message.agent && (
                  <div className="mb-1 block text-[10px] font-semibold tracking-wide text-white/70 uppercase">
                    {message.agent} Agent
                  </div>
                )}
                <p className="m-0">{message.msg}</p>
                <div
                  className={cn(
                    "mt-1.5 flex items-center gap-2 font-mono text-[10px]",
                    message.who === "them" ? "text-text-subtle" : "text-white/60"
                  )}
                >
                  {message.t}
                  {message.who === "agent" && message.why && (
                    <WhyPopover
                      decision={message.why}
                      title="Why this reply?"
                      className="[&_button]:bg-white/15 [&_button]:text-white [&_button]:hover:bg-white/25"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex items-center gap-2 self-start px-3.5 py-1.5 text-[11px] text-text-subtle">
            <span className="size-1.5 animate-bounce rounded-full bg-text-subtle [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-text-subtle [animation-delay:200ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-text-subtle [animation-delay:400ms]" />
            <span>{conversation.name.split(" ")[0]} is typing…</span>
          </div>
        )}
      </div>

      <footer className="border-t border-border bg-surface">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-border px-5 py-2.5">
          <span className="shrink-0 text-[11px] font-semibold tracking-wide text-brand uppercase">
            {agentLabel} Agent suggests:
          </span>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="shrink-0 rounded-pill border border-transparent bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand hover:border-brand hover:bg-brand hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 px-3.5 py-2.5">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-text-muted hover:bg-surface-2 hover:text-text"
          >
            <Paperclip className="size-[18px]" />
          </button>
          <Textarea
            rows={1}
            placeholder={`Type a message — or let ${agentLabel} Agent respond…`}
            className="min-h-9 flex-1 resize-none border-border bg-bg text-[13px] focus-visible:border-brand focus-visible:ring-brand/30"
          />
          <button
            type="button"
            className="h-9 shrink-0 rounded-md border border-border px-2.5 text-xs font-medium text-text-muted hover:bg-surface-2 hover:text-text"
          >
            Take over
          </button>
          <Button size="sm" className="h-9 gap-1.5 px-3.5">
            <Send className="size-4" />
            Send
          </Button>
        </div>
        <div className="flex items-center gap-1.5 px-5 pb-2.5 text-[10.5px] text-text-subtle">
          <Shield className="size-3 text-success" />
          <span>
            End-to-end encrypted via WhatsApp Business · Logged to audit trail
          </span>
        </div>
      </footer>
    </div>
  );
}
