import type { BuyerBulletContent } from "@/types/landing";

export const buyerBullets: readonly BuyerBulletContent[] = [
  { id: "buyer-record", icon: "shield", bodyKey: "buyers.bullets.record" },
  { id: "buyer-hold", icon: "key", bodyKey: "buyers.bullets.hold" },
  { id: "buyer-track", icon: "truck", bodyKey: "buyers.bullets.track" },
] as const;

export const buyerBandKeys = {
  eyebrowKey: "buyers.eyebrow",
  titleKey: "buyers.title",
  bodyKey: "buyers.body",
} as const;
