"use client";

import { useTransition } from "react";
import {
  reinstateAccountAction,
  suspendAccountAction,
} from "@/app/actions/console/person";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Icon } from "@/components/atoms/Icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useRouter } from "@/i18n/navigation";

type SuspendDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
  personName: string;
  suspended: boolean;
};

export function SuspendDialog({
  open,
  onOpenChange,
  personId,
  personName,
  suspended,
}: SuspendDialogProps) {
  const { toast } = useToastContext();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const result = suspended
        ? await reinstateAccountAction(personId)
        : await suspendAccountAction(personId);
      if (!result.ok) {
        toast(
          result.error === "forbidden"
            ? "Only an administrator can do this"
            : "Could not update account",
        );
        return;
      }
      toast(suspended ? "Account reinstated" : "Account suspended");
      onOpenChange(false);
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-auto top-1/2 left-1/2 z-[60] max-h-[90vh] w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-card bg-paper p-5 text-ink shadow-lift">
        <SheetTitle className="font-display text-d3 text-ink">
          {suspended ? "Reinstate" : "Suspend"} {personName}?
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-ink-70">
          {suspended
            ? "New orders become possible again. Nothing about held funds changes."
            : "New orders stop immediately. Money already held is not touched — buyers in flight are still refunded or released under the normal rules."}
        </SheetDescription>
        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton
            type="button"
            variant={suspended ? "sun" : "clay"}
            size="sm"
            disabled={pending}
            aria-label={
              suspended
                ? `Confirm reinstate ${personName}`
                : `Confirm suspend ${personName}. Held funds are not touched.`
            }
            onClick={confirm}
          >
            <Icon name={suspended ? "check" : "ban"} size="sm" />
            Yes, do it
          </ActionButton>
          <SheetClose asChild>
            <ActionButton type="button" variant="line" size="sm">
              Cancel
            </ActionButton>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
