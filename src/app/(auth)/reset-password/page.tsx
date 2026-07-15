import type { Metadata } from "next";
import {
  ResetPasswordSetForm,
} from "@/components/organisms/auth/ResetPasswordFlow";
import { ExpiredLinkScreen } from "@/components/organisms/auth/ExpiredLinkScreen";

export const metadata: Metadata = {
  title: "Set new password",
  description: "Choose a new password for your SolAI account.",
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <ExpiredLinkScreen type="reset" />;
  }

  return <ResetPasswordSetForm token={token} />;
}
