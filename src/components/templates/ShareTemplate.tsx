import { Suspense } from "react";
import { ShareShell } from "@/components/templates/ShareShell";

type ShareTemplateProps = {
  draftId: string;
};

export function ShareTemplate({ draftId }: ShareTemplateProps) {
  return (
    <Suspense fallback={null}>
      <ShareShell draftId={draftId} />
    </Suspense>
  );
}
