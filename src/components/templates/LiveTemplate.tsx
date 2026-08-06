import { Suspense } from "react";
import { LiveShell } from "@/components/templates/LiveShell";

type LiveTemplateProps = {
  draftId: string;
};

export function LiveTemplate({ draftId }: LiveTemplateProps) {
  return (
    <Suspense fallback={null}>
      <LiveShell draftId={draftId} />
    </Suspense>
  );
}
