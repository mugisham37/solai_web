import type { Metadata } from "next";
import { SignUpForm } from "@/components/organisms/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your SolAI account — start free, no credit card required.",
};

export default function SignupPage() {
  return <SignUpForm />;
}
