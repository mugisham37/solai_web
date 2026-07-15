import { Lock, Shield } from "lucide-react";
import { TrustBadgeRow } from "@/components/molecules/TrustBadgeRow";

export function TwoFactorSetupPanel() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Shield className="size-12 text-brand" strokeWidth={1.5} />
      <h3 className="mt-4 text-lg font-semibold text-text">Secure your account</h3>
      <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-text-muted">
        Two-factor authentication adds a second layer of protection. SolAI handles
        real money — security isn&apos;t optional.
      </p>
      <TrustBadgeRow
        className="mt-6 w-full border-none pt-0"
        items={[
          { icon: <Lock className="size-3.5" />, label: "Encrypted at rest" },
          { icon: <Shield className="size-3.5" />, label: "SOC 2 ready" },
        ]}
      />
    </div>
  );
}
