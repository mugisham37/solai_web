import type { Metadata } from "next";
import { CampaignsTable } from "@/components/organisms/app/campaigns/CampaignsTable";
import { campaigns } from "@/lib/data/app/campaigns";

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Manage and monitor your SolAI campaigns.",
};

export default function CampaignsPage() {
  return <CampaignsTable campaigns={campaigns} />;
}
