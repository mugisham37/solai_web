"use client";

import { Suspense } from "react";
import { ResetPasswordSetForm } from "@/components/organisms/auth/ResetPasswordFlow";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordSetForm />
    </Suspense>
  );
}
