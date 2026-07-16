"use client";

import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import type { FAQItem } from "@/lib/data/faq";

interface FAQSectionProps {
  items: FAQItem[];
}

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section className="border-y border-border bg-surface px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1280px]">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="mb-6 text-[clamp(26px,3.5vw,36px)] font-semibold tracking-[-0.02em] text-text">
          Frequently asked.
        </h2>
        <Accordion
          type="single"
          collapsible
          className="mx-auto max-w-[720px]"
        >
          {items.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="border-b border-border data-[state=open]:border-warning"
            >
              <AccordionTrigger className="py-4.5 hover:no-underline [&>svg]:hidden">
                <span className="w-7 shrink-0 font-mono text-[13px] text-text-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-left text-base font-medium text-text">
                  {item.q}
                </span>
                <ChevronDown className="size-5 shrink-0 text-text-subtle transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
              </AccordionTrigger>
              <AccordionContent className="pb-4.5 pl-7 text-sm leading-relaxed text-text-muted">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
