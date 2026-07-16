"use client";

import { useState } from "react";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import type { Feature } from "@/lib/data/features";

interface FeaturesGridProps {
  features: Feature[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {features.map((feature, i) => (
        <FeatureCard
          key={feature.title}
          {...feature}
          expanded={expanded === i}
          onToggle={() => setExpanded(expanded === i ? null : i)}
        />
      ))}
    </div>
  );
}
