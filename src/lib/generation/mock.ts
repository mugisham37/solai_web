import { nanoid } from "nanoid";
import { BRACELET_PALETTES } from "@/data/bracelet-palettes";
import { DEFAULT_ALLOWANCE_PER_DAY, BLOCKED_POLICY_KEYWORDS } from "@/data/build";
import { analyseAndBuildResultSchema } from "@/lib/schemas/build";
import type {
  AnalyseAndBuildResult,
  GenerationService,
  GenerationStreamEvent,
} from "@/types/generation";
import type {
  Draft,
  DraftGeneratedImage,
  DraftImageCollection,
  DraftOriginalImage,
  PriceSuggestion,
  SceneStyle,
} from "@/types/build";

const MOCK_STAGES: ReadonlyArray<{ id: string; label: string; subLabel: string; ms: number }> = [
  {
    id: "read",
    label: "Reading your photo",
    subLabel: "Identifying the item, the material and the colour",
    ms: 1200,
  },
  {
    id: "write",
    label: "Writing the listing",
    subLabel: "In English and Kinyarwanda, from what it can see",
    ms: 1400,
  },
  {
    id: "scenes",
    label: "Generating five scenes",
    subLabel: "Your item, placed in settings buyers respond to",
    ms: 1600,
  },
  {
    id: "price",
    label: "Checking Kigali prices",
    subLabel: "Comparing 340 similar listings from the last 90 days",
    ms: 1200,
  },
  {
    id: "link",
    label: "Reserving your shop link",
    subLabel: "solai.shop/amara",
    ms: 900,
  },
];

function svgPlaceholder(paletteIndex: number, beads = 12): string {
  const p = BRACELET_PALETTES[paletteIndex % BRACELET_PALETTES.length];
  if (!p) return "";
  const id = `g${paletteIndex}`;
  let circles = "";
  for (let k = 0; k < beads; k++) {
    circles += `<circle cx="0" cy="-27" r="6" fill="url(#${id})" transform="rotate(${(k * 360) / beads})"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="${id}" cx="35%" cy="30%"><stop offset="0" stop-color="${p.light}"/><stop offset="1" stop-color="${p.dark}"/></radialGradient></defs><rect width="100" height="100" fill="${p.bg}"/><g transform="translate(50 50)"><circle r="27" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1"/>${circles}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makeProvenance(sceneLabel: string) {
  return {
    generator: "solai-mock",
    model: "mock-scene-v1",
    timestamp: new Date().toISOString(),
    parameters: { sceneLabel, aspectRatio: "1:1" },
    signature: `mock-${nanoid(8)}`,
  };
}

function buildPrice(): PriceSuggestion {
  return {
    amountMinor: 8500,
    currency: "RWF",
    confidence: "medium",
    comparisonCount: 340,
    soldCount: 118,
    medianMinor: 8200,
    closestMatchMinor: 8900,
    rangeLowMinor: 4000,
    rangeHighMinor: 14000,
    explanation:
      "We found fewer than 50 listings that matched closely on materials, so the estimate leans on the wider category.",
    feeMinor: 255,
    payoutMinor: 8145,
  };
}

function makeOriginal(url: string, fileName: string): DraftOriginalImage {
  return {
    id: nanoid(),
    kind: "original",
    locked: true,
    url,
    thumbnailUrl: url,
    originalFileSize: 1_400_000,
    compressedFileSize: 168_000,
    fileName,
    exifApplied: true,
    galleryOrder: 0,
  };
}

function makeGenerated(sceneLabel: string, order: number, palette: number): DraftGeneratedImage {
  const url = svgPlaceholder(palette, 11 + (order % 4));
  return {
    id: nanoid(),
    kind: "generated",
    locked: false,
    url,
    thumbnailUrl: url,
    sceneLabel,
    provenanceMetadata: makeProvenance(sceneLabel),
    galleryOrder: order,
  };
}

export function createMockDraft(
  draftId: string,
  primaryUrl: string,
  fileName = "photo.jpg",
): Draft {
  const original = makeOriginal(primaryUrl, fileName);
  const generated: DraftGeneratedImage[] = [
    makeGenerated("Clean white", 1, 4),
    makeGenerated("Market stall", 2, 1),
    makeGenerated("On the wrist", 3, 2),
    makeGenerated("Flat lay", 4, 3),
    makeGenerated("Outdoors", 5, 5),
  ];
  const images: DraftImageCollection = {
    original,
    additionalOriginals: [],
    generated,
  };
  const now = new Date().toISOString();
  return {
    id: draftId,
    images,
    title: { en: "Hand-strung beaded bracelet", rw: "Imikufi y'amabuye" },
    description: {
      en: "Glass beads strung by hand in Nyamirambo. Adjustable, fits most wrists. Made to order in any colour — tell me what you want and I'll string it the same day.",
      rw: "Imikufi y'amasaro yakozwe n'intoki i Nyamirambo. Irahinduka ngo ikwire ukuboko kose.",
    },
    price: buildPrice(),
    category: "Jewellery · handmade",
    stock: 12,
    madeToOrder: false,
    variants: ["Blue", "Terracotta", "Cream"],
    condition: "new",
    leadTimeDays: 2,
    weightGrams: 120,
    courierEnabled: true,
    pickupEnabled: false,
    coverImageId: original.id,
    sceneStyles: ["clean-white", "market-stall", "on-the-wrist"],
    aspectRatio: "1:1",
    createdAt: now,
    updatedAt: now,
  };
}

async function streamStages(
  onEvent: (event: GenerationStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const total = MOCK_STAGES.length;
  for (let i = 0; i < total; i++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const stage = MOCK_STAGES[i];
    if (!stage) continue;
    onEvent({
      type: "stage",
      stageId: stage.id,
      label: stage.label,
      subLabel: stage.subLabel,
      index: i,
      total,
    });
    onEvent({ type: "progress", progress: Math.round(((i + 0.5) / total) * 100) });
    await new Promise((r) => setTimeout(r, stage.ms));
  }
  onEvent({ type: "progress", progress: 100 });
}

function policyBlocked(hint?: string): boolean {
  const text = hint ?? "";
  return BLOCKED_POLICY_KEYWORDS.some((re) => re.test(text));
}

export const mockGenerationService: GenerationService = {
  async analyseAndBuild(input, onEvent, signal) {
    let allowance = DEFAULT_ALLOWANCE_PER_DAY;
    onEvent({ type: "allowance", remaining: allowance });

    if (policyBlocked(input.hint)) {
      const result: AnalyseAndBuildResult = {
        outcome: "blocked",
        reason: "The photo looks like branded footwear being sold as original.",
        rule: "Counterfeit or unlicensed brand goods.",
      };
      return result;
    }

    await streamStages(onEvent, signal);

    if (input.descriptionOnly && input.imageUrls.length === 0) {
      const placeholder = svgPlaceholder(0);
      const draft = createMockDraft(nanoid(), placeholder, "description-only.svg");
      allowance -= 1;
      onEvent({ type: "allowance", remaining: allowance });
      const parsed = analyseAndBuildResultSchema.safeParse({
        outcome: "draft",
        draft,
        allowanceRemaining: allowance,
      });
      if (!parsed.success) {
        return { outcome: "error", message: "Invalid generation response.", chargedAllowance: false };
      }
      return parsed.data as AnalyseAndBuildResult;
    }

    const primary = input.imageUrls[0];
    if (!primary) {
      return {
        outcome: "unclear",
        imageUrl: svgPlaceholder(4),
        issues: ["Low light", "More than one item"],
      };
    }

    const draft = createMockDraft(nanoid(), primary);
    allowance -= 1;
    onEvent({ type: "allowance", remaining: allowance });
    const result = {
      outcome: "draft" as const,
      draft,
      allowanceRemaining: allowance,
    };
    const parsed = analyseAndBuildResultSchema.safeParse(result);
    if (!parsed.success) {
      return { outcome: "error", message: "Invalid generation response.", chargedAllowance: false };
    }
    return parsed.data as AnalyseAndBuildResult;
  },

  async regenerateScenes(input, onEvent, signal) {
    await streamStages(onEvent, signal);
    const startOrder = 10;
    const images = input.sceneStyles.map((style, i) =>
      makeGenerated(
        SCENE_LABELS[style] ?? style,
        startOrder + i,
        i + 1,
      ),
    );
    return { images, allowanceRemaining: DEFAULT_ALLOWANCE_PER_DAY - 1 };
  },

  async rewriteDescription(input) {
    const tone = input.tone;
    const en =
      tone === "plain"
        ? "Beaded bracelet, hand-strung. Adjustable. Any colour, made to order."
        : tone === "warm"
          ? "Every bracelet is strung by hand at my table in Nyamirambo, one bead at a time."
          : "Hand-strung glass beads. Adjustable. Any colour.";
    return {
      description: { ...input.draft.description, en },
      allowanceRemaining: DEFAULT_ALLOWANCE_PER_DAY - 1,
    };
  },
};

const SCENE_LABELS: Record<SceneStyle, string> = {
  "clean-white": "Clean white",
  "market-stall": "Market stall",
  "on-the-wrist": "On the wrist",
  "flat-lay": "Flat lay",
  "outdoors-kigali": "Outdoors, Kigali",
  "held-in-hand": "Held in hand",
};

let generationService: GenerationService = mockGenerationService;

export function getGenerationService(): GenerationService {
  return generationService;
}

export function setGenerationService(service: GenerationService): void {
  generationService = service;
}
