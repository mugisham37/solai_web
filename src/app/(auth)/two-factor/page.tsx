import type { Metadata } from "next";
import { TwoFactorChallengeForm } from "@/components/organisms/auth/TwoFactorChallengeForm";

export const metadata: Metadata = {
  title: "Two-factor authentication",
  description: "Complete two-factor authentication to sign in.",
};

export default function TwoFactorPage() {
  return <TwoFactorChallengeForm />;
}
