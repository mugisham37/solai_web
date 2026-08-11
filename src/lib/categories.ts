import type { CategoryLabel } from "@/types/category";

const RULES: ReadonlyArray<[RegExp, CategoryLabel]> = [
  [/bracelet|bead|jewel|neckla|earring|ring/i, "Jewellery · handmade"],
  [/repair|fix|screen|phone|laptop|electric/i, "Repairs · service"],
  [/cake|bread|food|cook|meal|juice|snack/i, "Food · made to order"],
  [/kitenge|cloth|dress|shirt|shoe|fashion/i, "Clothing · resale"],
  [/braid|hair|salon|nail|makeup/i, "Beauty · service"],
  [/photo|design|print|logo|poster/i, "Creative · service"],
  [/class|lesson|course|training|tutor/i, "Classes · booking"],
];

export function inferCategory(input: string): CategoryLabel {
  const value = input.trim();
  for (const [pattern, label] of RULES) {
    if (pattern.test(value)) {
      return label;
    }
  }
  return "General goods";
}

export const PLACEHOLDER_SAMPLES = [
  "hand-strung beaded bracelets",
  "phone screen repairs",
  "sunday cake orders",
  "second-hand kitenge",
  "hair braiding at home",
  "passport photos",
] as const;
