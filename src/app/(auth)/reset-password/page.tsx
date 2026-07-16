import type { Metadata } from "next";
import { ResetPasswordSetForm } from "@/components/organisms/auth/ResetPasswordFlow";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your SolAI account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordSetForm />;
}
