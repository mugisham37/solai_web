"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { ChangeWalletSheet } from "@/components/molecules/ChangeWalletSheet";

type ChangeWalletButtonProps = {
  draftId: string;
  walletMasked: string;
  label: string;
  size?: "sm" | "default" | "lg";
  block?: boolean;
};

/** Opens the wallet-change sheet that routes into the existing payout flow. */
export function ChangeWalletButton({
  draftId,
  walletMasked,
  label,
  size = "sm",
  block,
}: ChangeWalletButtonProps) {
  const t = useTranslations("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton
        type="button"
        variant="line"
        size={size}
        block={block}
        onClick={() => setOpen(true)}
        aria-label={t("settings.wallet.sheetTitle")}
      >
        {label}
      </ActionButton>
      <ChangeWalletSheet
        draftId={draftId}
        walletMasked={walletMasked}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
