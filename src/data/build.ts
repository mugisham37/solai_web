import type { SceneStyle } from "@/types/build";

export const BUILD_STEPS = [
  { id: "sell", number: 1, labelKey: "build.steps.sell" },
  { id: "build", number: 2, labelKey: "build.steps.build" },
  { id: "paid", number: 3, labelKey: "build.steps.paid" },
  { id: "live", number: 4, labelKey: "build.steps.live" },
  { id: "share", number: 5, labelKey: "build.steps.share" },
] as const;

export const SCENE_STYLE_OPTIONS: ReadonlyArray<{
  id: SceneStyle;
  labelKey: string;
}> = [
  { id: "clean-white", labelKey: "build.scenes.cleanWhite" },
  { id: "market-stall", labelKey: "build.scenes.marketStall" },
  { id: "on-the-wrist", labelKey: "build.scenes.onTheWrist" },
  { id: "flat-lay", labelKey: "build.scenes.flatLay" },
  { id: "outdoors-kigali", labelKey: "build.scenes.outdoorsKigali" },
  { id: "held-in-hand", labelKey: "build.scenes.heldInHand" },
] as const;

export const TONE_OPTIONS = [
  { id: "plain" as const, labelKey: "build.tones.plain" },
  { id: "warm" as const, labelKey: "build.tones.warm" },
  { id: "short" as const, labelKey: "build.tones.short" },
] as const;

export const PHOTO_TIPS = [
  { id: "daylight", good: true, titleKey: "build.tips.daylight.title", bodyKey: "build.tips.daylight.body" },
  { id: "frame", good: true, titleKey: "build.tips.frame.title", bodyKey: "build.tips.frame.body" },
  { id: "screenshot", good: false, titleKey: "build.tips.screenshot.title", bodyKey: "build.tips.screenshot.body" },
] as const;

export const DEFAULT_ALLOWANCE_PER_DAY = 5;

export const BLOCKED_POLICY_KEYWORDS = [/nike|adidas|brand.*original|counterfeit/i];
