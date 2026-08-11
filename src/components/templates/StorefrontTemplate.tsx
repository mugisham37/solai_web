import { StorefrontShell } from "@/components/templates/StorefrontShell";

export function StorefrontTemplate({
  mode,
}: {
  mode: React.ComponentProps<typeof StorefrontShell>["mode"];
}) {
  return <StorefrontShell mode={mode} />;
}
