"use client";

import { useState } from "react";
import { CategoryChip } from "@/components/molecules/CategoryChip";
import { StartInput } from "@/components/molecules/StartInput";
import { Text } from "@/components/atoms/Text";

type HeroStartGroupProps = {
  sellQuestion: string;
  startLabel: string;
  cameraLabel: string;
  readsAsLabel: string;
  categoryHint: string;
};

export function HeroStartGroup({
  sellQuestion,
  startLabel,
  cameraLabel,
  readsAsLabel,
  categoryHint,
}: HeroStartGroupProps) {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <StartInput
        label={sellQuestion}
        submitLabel={startLabel}
        cameraLabel={cameraLabel}
        id="hero-start"
        onValueChange={setDraft}
      />
      <p className="m-0 flex flex-wrap items-center gap-2">
        <Text size="tiny" surface="dark">
          {readsAsLabel}
        </Text>
        <CategoryChip value={draft} />
        <Text size="tiny" surface="dark">
          {categoryHint}
        </Text>
      </p>
    </div>
  );
}
