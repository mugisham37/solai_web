"use client";

import { useState } from "react";

import { FaqItem } from "@/components/molecules/faq-item";
import { FAQS } from "@/data/marketing/faqs";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-6 max-w-[720px]">
      {FAQS.map((faq, index) => (
        <FaqItem
          key={faq.question}
          faq={faq}
          index={index}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex((current) => (current === index ? null : index))
          }
        />
      ))}
    </div>
  );
}
