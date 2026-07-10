"use client";

import { useState } from "react";

import { FeatureCard } from "@/components/molecules/feature-card";
import { StaggerGroup } from "@/components/motion/stagger-group";
import { FEATURES } from "@/data/marketing/features";

export function FeaturesGridSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-8 md:py-16">
      <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.06}>
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            isExpanded={expandedIndex === index}
            onToggle={() =>
              setExpandedIndex((current) => (current === index ? null : index))
            }
          />
        ))}
      </StaggerGroup>
    </section>
  );
}
