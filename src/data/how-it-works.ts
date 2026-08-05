import type { StepContent } from "@/types/landing";

export const howItWorksSteps: readonly StepContent[] = [
  {
    id: "step-photo",
    number: 1,
    titleKey: "how.steps.one.title",
    bodyKey: "how.steps.one.body",
    timeKey: "how.steps.one.time",
  },
  {
    id: "step-build",
    number: 2,
    titleKey: "how.steps.two.title",
    bodyKey: "how.steps.two.body",
    timeKey: "how.steps.two.time",
  },
  {
    id: "step-number",
    number: 3,
    titleKey: "how.steps.three.title",
    bodyKey: "how.steps.three.body",
    timeKey: "how.steps.three.time",
  },
] as const;

export const howItWorksKeys = {
  eyebrowKey: "how.eyebrow",
  titleKey: "how.title",
  titleMarkKey: "how.titleMark",
  ledeKey: "how.lede",
  calloutKey: "how.callout",
  calloutStrongKey: "how.calloutStrong",
  ctaKey: "how.cta",
} as const;
