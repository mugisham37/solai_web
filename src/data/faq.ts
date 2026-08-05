import type { FaqItemContent } from "@/types/landing";

export const faqItems: readonly FaqItemContent[] = [
  {
    id: "faq-bank",
    questionKey: "faq.items.bank.question",
    answerKey: "faq.items.bank.answer",
  },
  {
    id: "faq-when",
    questionKey: "faq.items.when.question",
    answerKey: "faq.items.when.answer",
  },
  {
    id: "faq-lie",
    questionKey: "faq.items.lie.question",
    answerKey: "faq.items.lie.answer",
  },
  {
    id: "faq-edit",
    questionKey: "faq.items.edit.question",
    answerKey: "faq.items.edit.answer",
  },
  {
    id: "faq-free",
    questionKey: "faq.items.free.question",
    answerKey: "faq.items.free.answer",
  },
  {
    id: "faq-holding",
    questionKey: "faq.items.holding.question",
    answerKey: "faq.items.holding.answer",
  },
] as const;

export const faqSectionKeys = {
  eyebrowKey: "faq.eyebrow",
  titleKey: "faq.title",
  ledeKey: "faq.lede",
  ctaKey: "faq.cta",
} as const;
