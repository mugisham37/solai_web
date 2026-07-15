import type { OnboardingDraft } from "@/types/onboarding";

export function createDefaultDraft(): OnboardingDraft {
  return {
    currentStep: 0,
    connections: {
      shopify: { status: "idle" },
      woo: { status: "idle" },
      meta: { status: "idle" },
      google: { status: "idle" },
      whatsapp: { status: "idle" },
    },
    payments: {
      stripe: { enabled: false, status: "idle" },
      momo: { enabled: false, status: "idle" },
      airtel: { enabled: false, status: "idle" },
      flutterwave: { enabled: false, status: "idle" },
    },
    product: {
      name: "",
      description: "",
      price: "",
      currency: "US$",
      productUrl: "",
      imageNames: [],
    },
    audience: {
      idealCustomer: "",
      regions: ["Rwanda", "Kenya", "South Africa", "EU (diaspora)"],
      languages: ["English", "French", "Kinyarwanda"],
    },
    budget: {
      dailyCap: 500,
      totalCap: 5000,
      currency: "US$",
    },
    launch: { status: "idle" },
    completedAt: null,
  };
}
