export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export type ConnectionProvider =
  | "shopify"
  | "woo"
  | "meta"
  | "google"
  | "whatsapp";

export type PaymentRail = "stripe" | "momo" | "airtel" | "flutterwave";

export type LaunchStatus = "idle" | "launching" | "success" | "failed";

export type OnboardingStepIndex = 0 | 1 | 2 | 3 | 4;

export interface ConnectionState {
  status: ConnectionStatus;
  accountName?: string;
  accountId?: string;
  errorReason?: string;
}

export interface PaymentRailState {
  enabled: boolean;
  status: ConnectionStatus;
  merchantId?: string;
  accountId?: string;
  errorReason?: string;
}

export interface ProductDraft {
  name: string;
  description: string;
  price: string;
  currency: string;
  productUrl: string;
  imageNames: string[];
  importedFrom?: "shopify" | "woo";
}

export interface AudienceTargeting {
  idealCustomer: string;
  regions: string[];
  languages: string[];
}

export interface BudgetCaps {
  dailyCap: number;
  totalCap: number;
  currency: string;
}

export interface LaunchResult {
  status: LaunchStatus;
  launchedAt?: string;
  errorReason?: string;
}

export interface OnboardingDraft {
  currentStep: OnboardingStepIndex;
  connections: Record<ConnectionProvider, ConnectionState>;
  payments: Record<PaymentRail, PaymentRailState>;
  product: ProductDraft;
  audience: AudienceTargeting;
  budget: BudgetCaps;
  launch: LaunchResult;
  completedAt?: string | null;
}

export const ONBOARDING_STEPS = [
  "Welcome",
  "Connections",
  "Payments",
  "Product & Budget",
  "Review & Launch",
] as const;

export const STEP_ROUTES = [
  "/onboarding",
  "/onboarding/connections",
  "/onboarding/payments",
  "/onboarding/product-budget",
  "/onboarding/review",
] as const;
