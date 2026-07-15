import { PanelQuote } from "@/components/molecules/PanelQuote";
import { PanelStat } from "@/components/molecules/PanelStat";

export function SignInPanel() {
  return (
    <div>
      <PanelQuote
        quote="I uploaded my ceramics, set a RWF 50,000 daily cap, and walked away. Two weeks later — 340 orders."
        author="Marie Uwimana"
        subtitle="Inema Boutique · Kigali"
        initials="MU"
      />
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
        <PanelStat value="15 min" label="Optimisation cycle" />
        <PanelStat value="5" label="Autonomous agents" />
        <PanelStat value="100%" label="Decisions explained" />
      </div>
    </div>
  );
}
