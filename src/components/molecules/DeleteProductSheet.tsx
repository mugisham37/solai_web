"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  deleteProductAction,
} from "@/app/actions/dashboard/product";
import { ActionButton } from "@/components/atoms/ActionButton";
import { useToastContext } from "@/components/providers/ToastProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/cn";

type DeleteProductSheetProps = {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProductSheet({
  productId,
  productName,
  open,
  onOpenChange,
}: DeleteProductSheetProps) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { toast } = useToastContext();
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.ok) {
        toast(t("products.delete.failed"));
        return;
      }
      toast(t("products.delete.done"));
      onOpenChange(false);
      router.push("/dashboard/products");
      router.refresh();
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "inset-auto right-0 bottom-0 left-0 max-h-[85vh] rounded-t-[22px] border border-hair bg-paper p-5 text-ink",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "@[700px]/app:inset-auto @[700px]/app:top-1/2 @[700px]/app:left-1/2 @[700px]/app:max-h-[min(90vh,560px)] @[700px]/app:w-[min(100%-2rem,420px)] @[700px]/app:-translate-x-1/2 @[700px]/app:-translate-y-1/2 @[700px]/app:rounded-card",
        )}
      >
        <SheetTitle className="font-display text-d3 font-bold text-ink uppercase">
          {t("products.delete.title")}
        </SheetTitle>
        <SheetDescription className="mt-2 text-sm text-ink-70">
          {t("products.delete.lede", { name: productName })}
        </SheetDescription>
        <div className="mt-5 flex flex-col gap-2 @[480px]:flex-row">
          <ActionButton
            type="button"
            variant="deep"
            className="bg-clay text-white hover:brightness-105"
            disabled={pending}
            onClick={confirm}
            aria-label={t("products.delete.confirmAria", { name: productName })}
          >
            {pending ? t("products.delete.deleting") : t("products.delete.confirm")}
          </ActionButton>
          <ActionButton
            type="button"
            variant="line"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            {t("products.delete.keep")}
          </ActionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
