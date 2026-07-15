"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Campaign } from "@/types/app";
import { ChannelChip } from "@/components/atoms/app/ChannelChip";
import { approvalDetails } from "@/lib/data/app/campaigns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ApprovalModalProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovalModal({
  campaign,
  open,
  onOpenChange,
}: ApprovalModalProps) {
  const [accepted, setAccepted] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) setAccepted(false);
    onOpenChange(next);
  };

  if (!campaign) return null;

  const dailyBudget = Math.round(campaign.cap / 30);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review campaign plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-3.5 py-3 text-sm text-text">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
            <span>
              This campaign needs your approval before launch. SolAI built the
              plan — you sign off on the budget and audience.
            </span>
          </div>

          <h3 className="text-base font-semibold text-text">{campaign.name}</h3>

          <dl className="grid gap-3 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Channels</dt>
              <dd className="flex flex-wrap gap-1">
                {campaign.channels.map((channel) => (
                  <ChannelChip key={channel} channel={channel} />
                ))}
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Budget cap</dt>
              <dd>
                <strong>US$ {campaign.cap.toLocaleString()}</strong> total ·{" "}
                <strong>US$ {dailyBudget}/day</strong>
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Duration</dt>
              <dd>{approvalDetails.duration}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Audience</dt>
              <dd>{approvalDetails.audience}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Goal</dt>
              <dd>{approvalDetails.goal}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-text-subtle">Built by</dt>
              <dd>{approvalDetails.builtBy}</dd>
            </div>
          </dl>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-text">
              What SolAI will do automatically
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-text-muted">
              {approvalDetails.autoActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold text-text">
              What it will NOT do without you
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-warning">
              {approvalDetails.neverActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border bg-bg p-3.5">
            <Checkbox
              id="approval-consent"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <Label
              htmlFor="approval-consent"
              className="text-sm leading-relaxed text-text-muted"
            >
              I authorise SolAI to spend up to{" "}
              <strong className="text-text">
                US$ {campaign.cap.toLocaleString()}
              </strong>{" "}
              on this campaign with the constraints above. I understand budget
              caps are hard limits and the campaign auto-pauses on the
              conditions listed.
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Send back to Planner
          </Button>
          <Button
            variant="cta"
            disabled={!accepted}
            onClick={() => handleOpenChange(false)}
          >
            Approve & launch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
