import { Eye, Globe, Shield } from "lucide-react";
import { PanelStep } from "@/components/molecules/PanelStep";
import { TrustBadgeRow } from "@/components/molecules/TrustBadgeRow";

export function SignUpPanel() {
  return (
    <div>
      <div className="mb-4 font-mono text-[11px] font-medium tracking-[0.08em] text-brand uppercase">
        What happens next
      </div>
      <div className="flex flex-col gap-4">
        <PanelStep
          num="01"
          title="Verify your email"
          description="A 6-digit code lands in your inbox."
        />
        <PanelStep
          num="02"
          title="Connect your store"
          description="OAuth into Shopify, WooCommerce, or paste a product URL."
        />
        <PanelStep
          num="03"
          title="Set your spend cap"
          description="Choose a daily limit. SolAI can never exceed it."
        />
        <PanelStep
          num="04"
          title="Launch"
          description="Upload a product and SolAI builds your first campaign."
        />
      </div>
      <TrustBadgeRow
        className="mt-6"
        items={[
          { icon: <Shield className="size-4" />, label: "Hard spend caps" },
          { icon: <Eye className="size-4" />, label: "100% explainable" },
          { icon: <Globe className="size-4" />, label: "GDPR · Rwanda DPL" },
        ]}
      />
    </div>
  );
}
