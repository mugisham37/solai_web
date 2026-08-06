import { Suspense } from "react";
import { BuildShell } from "@/components/templates/BuildShell";

type BuildTemplateProps = {
  draftId: string;
  initialQuery?: string;
};

export function BuildTemplate({ draftId, initialQuery }: BuildTemplateProps) {
  return (
    <Suspense fallback={null}>
      <BuildShell draftId={draftId} initialQuery={initialQuery} />
    </Suspense>
  );
}
