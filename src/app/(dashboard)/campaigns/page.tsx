import type { Metadata } from "next";
import { CampaignsTable } from "@/components/organisms/app/campaigns/CampaignsTable";
import { campaigns } from "@/lib/data/app/campaigns";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Manage and monitor your SolAI campaigns.",
};

export default async function CampaignsPage() {
  await requireOnboardedSession();

  return <CampaignsTable campaigns={campaigns} />;
}
