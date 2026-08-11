import { z } from "zod";

export const provenanceMetadataSchema = z.object({
  generator: z.string(),
  model: z.string(),
  timestamp: z.string(),
  parameters: z.record(z.string(), z.unknown()),
  c2paManifest: z.string().optional(),
  signature: z.string(),
});

export const draftOriginalImageSchema = z.object({
  id: z.string(),
  kind: z.literal("original"),
  locked: z.literal(true),
  url: z.string(),
  thumbnailUrl: z.string(),
  originalFileSize: z.number().nonnegative(),
  compressedFileSize: z.number().nonnegative(),
  fileName: z.string(),
  exifApplied: z.boolean(),
  galleryOrder: z.number().int(),
});

export const draftGeneratedImageSchema = z.object({
  id: z.string(),
  kind: z.literal("generated"),
  locked: z.literal(false),
  url: z.string(),
  thumbnailUrl: z.string(),
  sceneLabel: z.string(),
  provenanceMetadata: provenanceMetadataSchema,
  galleryOrder: z.number().int(),
});

export const draftImageCollectionSchema = z.object({
  original: draftOriginalImageSchema,
  additionalOriginals: z.array(draftOriginalImageSchema),
  generated: z.array(draftGeneratedImageSchema),
});

export const priceSuggestionSchema = z.object({
  amountMinor: z.number().positive(),
  currency: z.enum(["RWF", "UGX", "KES", "TZS"]),
  confidence: z.enum(["high", "medium", "low"]),
  comparisonCount: z.number().int().nonnegative(),
  soldCount: z.number().int().nonnegative(),
  medianMinor: z.number().nonnegative(),
  closestMatchMinor: z.number().nonnegative(),
  rangeLowMinor: z.number().nonnegative(),
  rangeHighMinor: z.number().nonnegative(),
  explanation: z.string(),
  feeMinor: z.number().nonnegative(),
  payoutMinor: z.number().nonnegative(),
});

export const draftSchema = z.object({
  id: z.string(),
  images: draftImageCollectionSchema,
  title: z.record(z.string(), z.string()),
  description: z.record(z.string(), z.string()),
  price: priceSuggestionSchema,
  category: z.enum([
    "Jewellery · handmade",
    "Repairs · service",
    "Food · made to order",
    "Clothing · resale",
    "Beauty · service",
    "Creative · service",
    "Classes · booking",
    "General goods",
  ]),
  stock: z.number().int().nonnegative(),
  madeToOrder: z.boolean(),
  variants: z.array(z.string()),
  condition: z.enum(["new", "used-good", "used-fair"]),
  leadTimeDays: z.number().int().nonnegative(),
  weightGrams: z.number().nonnegative(),
  courierEnabled: z.boolean(),
  pickupEnabled: z.boolean(),
  coverImageId: z.string(),
  sceneStyles: z.array(
    z.enum([
      "clean-white",
      "market-stall",
      "on-the-wrist",
      "flat-lay",
      "outdoors-kigali",
      "held-in-hand",
    ]),
  ),
  aspectRatio: z.enum(["1:1", "4:5"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const generationStageEventSchema = z.object({
  type: z.literal("stage"),
  stageId: z.string(),
  label: z.string(),
  subLabel: z.string(),
  index: z.number().int(),
  total: z.number().int(),
});

export const analyseAndBuildResultSchema = z.discriminatedUnion("outcome", [
  z.object({
    outcome: z.literal("draft"),
    draft: draftSchema,
    allowanceRemaining: z.number().int().nonnegative(),
  }),
  z.object({
    outcome: z.literal("unclear"),
    imageUrl: z.string(),
    issues: z.array(z.string()),
  }),
  z.object({
    outcome: z.literal("blocked"),
    reason: z.string(),
    rule: z.string(),
  }),
  z.object({
    outcome: z.literal("error"),
    message: z.string(),
    chargedAllowance: z.boolean(),
  }),
]);
