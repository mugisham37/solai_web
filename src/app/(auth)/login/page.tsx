import type { Metadata } from "next";
import { SignInForm } from "@/components/organisms/auth/SignInForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your SolAI dashboard.",
};

export default function LoginPage() {
  return <SignInForm />;
}
