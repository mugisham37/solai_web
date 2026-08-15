import type { SceneStyle } from "@/types/build";

/**
 * Two key conventions live here on purpose.
 *
 * `BUILD_STEPS` is rendered by shells that hold a root translator (the stepper
 * appears on build, payout and share alike), so its keys are fully qualified.
 * Everything below is rendered by screens scoped to the `build` namespace, so
 * those keys are relative — qualifying them would resolve to `build.build.*`
 * and print the key itself on screen.
 */
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
  { id: "clean-white", labelKey: "scenes.cleanWhite" },
  { id: "market-stall", labelKey: "scenes.marketStall" },
  { id: "on-the-wrist", labelKey: "scenes.onTheWrist" },
  { id: "flat-lay", labelKey: "scenes.flatLay" },
  { id: "outdoors-kigali", labelKey: "scenes.outdoorsKigali" },
  { id: "held-in-hand", labelKey: "scenes.heldInHand" },
] as const;

export const TONE_OPTIONS = [
  { id: "plain" as const, labelKey: "tones.plain" },
  { id: "warm" as const, labelKey: "tones.warm" },
  { id: "short" as const, labelKey: "tones.short" },
] as const;

export const PHOTO_TIPS = [
  { id: "daylight", good: true, titleKey: "tips.daylight.title", bodyKey: "tips.daylight.body" },
  { id: "frame", good: true, titleKey: "tips.frame.title", bodyKey: "tips.frame.body" },
  { id: "screenshot", good: false, titleKey: "tips.screenshot.title", bodyKey: "tips.screenshot.body" },
] as const;

export const DEFAULT_ALLOWANCE_PER_DAY = 5;

export const BLOCKED_POLICY_KEYWORDS = [/nike|adidas|brand.*original|counterfeit/i];
