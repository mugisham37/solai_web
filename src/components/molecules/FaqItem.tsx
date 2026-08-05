"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/cn";

type FaqItemProps = {
  id: string;
  question: string;
  answer: string;
};

export function FaqItem({ id, question, answer }: FaqItemProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger>
        <span className="flex-1">{question}</span>
        <span
          className={cn(
            "ml-auto grid size-[26px] place-items-center rounded-full border border-ink-20 transition group-data-[state=open]:rotate-45 group-data-[state=open]:border-sun group-data-[state=open]:bg-sun",
          )}
        >
          <Icon name="plus" size="sm" />
        </span>
      </AccordionTrigger>
      <AccordionContent>{answer}</AccordionContent>
    </AccordionItem>
  );
}
