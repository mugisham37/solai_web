import { z } from "zod";
import { getCountryByCode } from "@/data/countries";
import { isValidNationalPhone } from "@/lib/phone/format";

const countryCodeSchema = z.enum(["RW", "UG", "KE", "TZ"]);

const baseFields = {
  countryCode: countryCodeSchema,
  phoneNational: z.string().min(1),
  shopName: z.string().trim().min(1, "Shop name is required").max(40),
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required" }),
};

function phoneRefine(countryCode: z.infer<typeof countryCodeSchema>, national: string) {
  return isValidNationalPhone(countryCode, national);
}

export const payoutFormSchema = z.discriminatedUnion("destinationType", [
  z.object({
    ...baseFields,
    destinationType: z.literal("wallet-same"),
    destinationKind: z.literal("wallet"),
    walletMode: z.literal("same"),
  }),
  z.object({
    ...baseFields,
    destinationType: z.literal("wallet-other"),
    destinationKind: z.literal("wallet"),
    walletMode: z.literal("other"),
    walletPhoneNational: z.string().min(1),
  }),
  z.object({
    ...baseFields,
    destinationType: z.literal("airtel"),
    destinationKind: z.literal("airtel"),
    walletMode: z.literal("same"),
    airtelPhoneNational: z.string().min(1),
  }),
  z.object({
    ...baseFields,
    destinationType: z.literal("bank"),
    destinationKind: z.literal("bank"),
    walletMode: z.literal("same"),
    bankId: z.string().min(1),
    accountNumber: z.string().min(6),
  }),
]);

export type PayoutFormValues = z.infer<typeof payoutFormSchema>;

export function validatePayoutForm(values: unknown): {
  success: true;
  data: PayoutFormValues;
} | {
  success: false;
  errors: Record<string, string>;
} {
  const parsed = payoutFormSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!errors[key]) errors[key] = issue.message;
    }
    return { success: false, errors };
  }
  const data = parsed.data;
  const country = getCountryByCode(data.countryCode);
  if (!phoneRefine(data.countryCode, data.phoneNational)) {
    return {
      success: false,
      errors: { phoneNational: `Enter a valid ${country.dial} number.` },
    };
  }
  if (data.destinationType === "wallet-other") {
    if (!phoneRefine(data.countryCode, data.walletPhoneNational)) {
      return { success: false, errors: { walletPhoneNational: "Enter a valid wallet number." } };
    }
  }
  if (data.destinationType === "airtel") {
    if (!phoneRefine(data.countryCode, data.airtelPhoneNational)) {
      return { success: false, errors: { airtelPhoneNational: "Enter a valid Airtel number." } };
    }
  }
  return { success: true, data };
}

export function destinationTypeFromForm(
  destinationKind: "wallet" | "airtel" | "bank",
  walletMode: "same" | "other",
): PayoutFormValues["destinationType"] {
  if (destinationKind === "bank") return "bank";
  if (destinationKind === "airtel") return "airtel";
  return walletMode === "other" ? "wallet-other" : "wallet-same";
}
