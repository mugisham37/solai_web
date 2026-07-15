import type { Metadata } from "next";
import { ResetPasswordRequestFlow } from "@/components/organisms/auth/ResetPasswordFlow";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your SolAI account password.",
};

export default function ForgotPasswordPage() {
  return <ResetPasswordRequestFlow />;
}
