import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/organisms/app/campaigns/CampaignDetail";
import {
  abTests,
  agentActions,
  audiences,
  channelAllocations,
  creatives,
  getCampaignById,
} from "@/lib/data/app/campaigns";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CampaignDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);

  return {
    title: campaign?.name ?? "Campaign",
    description: campaign
      ? `Campaign detail for ${campaign.name}.`
      : "Campaign not found.",
  };
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { id } = await params;
  const campaign = getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <CampaignDetail
      campaign={campaign}
      allocations={channelAllocations}
      audiences={audiences}
      agentActions={agentActions}
      creatives={creatives}
      abTests={abTests}
    />
  );
}
