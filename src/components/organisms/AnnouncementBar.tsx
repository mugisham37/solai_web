"use client";

import { useState } from "react";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";

type AnnouncementBarProps = {
  highlight: string;
  message: string;
  dismissLabel: string;
};

export function AnnouncementBar({ highlight, message, dismissLabel }: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-sun text-sun-ink">
      <div className="mx-auto flex max-w-[1180px] items-center gap-2.5 px-[1.15rem] py-2 md:px-8">
        <Icon name="signal" size="sm" />
        <Text size="small" className="text-sun-ink">
          <span className="font-bold">{highlight}</span> {message}
        </Text>
        <button
          type="button"
          className="ml-auto grid place-items-center rounded-md p-1 hover:bg-black/10"
          aria-label={dismissLabel}
          onClick={() => setVisible(false)}
        >
          <Icon name="x" size="sm" />
        </button>
      </div>
    </div>
  );
}
