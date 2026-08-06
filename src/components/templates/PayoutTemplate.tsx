import { Suspense } from "react";
import { PayoutShell } from "@/components/templates/PayoutShell";

type PayoutTemplateProps = {
  draftId: string;
};

export function PayoutTemplate({ draftId }: PayoutTemplateProps) {
  return (
    <Suspense fallback={null}>
      <PayoutShell draftId={draftId} />
    </Suspense>
  );
}
