"use client";

import { useTranslations } from "next-intl";
import { BuyerTopBar } from "@/components/molecules/BuyerTopBar";
import { BuyerRise } from "@/components/molecules/BuyerRise";
import { ListingGoneView } from "@/components/organisms/ListingGoneView";
import { OutOfStockView } from "@/components/organisms/OutOfStockView";
import { ShopCatalogueView } from "@/components/organisms/ShopCatalogueView";
import { StorefrontProductView } from "@/components/organisms/StorefrontProductView";
import { ToastProvider, useToastContext } from "@/components/providers/ToastProvider";
import { buyerAskWhatsAppUrl, shopPublicUrl } from "@/lib/buyer";
import { copyText } from "@/lib/clipboard";
import type {
  BuyerCatalogueItem,
  BuyerProduct,
  BuyerShop,
} from "@/types/buyer";
import { useLocale } from "next-intl";

export type StorefrontMode =
  | Readonly<{ kind: "shop"; shop: BuyerShop; catalogue: readonly BuyerCatalogueItem[]; liveCount: number }>
  | Readonly<{ kind: "product"; shop: BuyerShop; product: BuyerProduct }>
  | Readonly<{ kind: "oos"; shop: BuyerShop; product: BuyerProduct }>
  | Readonly<{ kind: "gone"; shop: BuyerShop }>;

type StorefrontShellProps = {
  mode: StorefrontMode;
};

function StorefrontShellInner({ mode }: StorefrontShellProps) {
  const t = useTranslations("storefront");
  const locale = useLocale();
  const { toast } = useToastContext();
  const shop = mode.shop;

  const askProduct =
    mode.kind === "product" || mode.kind === "oos"
      ? mode.product
      : mode.kind === "shop"
        ? mode.catalogue.find((c) => c.status === "live") ?? mode.catalogue[0]
        : null;

  const onAsk = () => {
    const title =
      askProduct && "title" in askProduct
        ? askProduct.title
        : shop.name;
    const price =
      askProduct && "price" in askProduct
        ? askProduct.price
        : shop.deliveryFrom;
    const url = buyerAskWhatsAppUrl({
      shopName: shop.whatsappPrefillName,
      slug: shop.slug,
      productTitle: title,
      price,
      locale,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const onShare = async () => {
    const url = shopPublicUrl(shop.slug);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shop.name,
          text: askProduct && "title" in askProduct ? askProduct.title : shop.tagline,
          url,
        });
        return;
      } catch {
        // Fall through to clipboard.
      }
    }
    const outcome = await copyText(url);
    toast(outcome === "copied" ? t("shareCopied") : t("shareFailed"));
  };

  return (
    <div className="build-app-shell mx-auto flex min-h-screen w-full max-w-[1240px] flex-col bg-paper">
      <BuyerTopBar
        shopName={shop.name}
        secureLabel={t("secure")}
        shareLabel={t("shareShop")}
        onShare={onShare}
      />

      <BuyerRise motionKey={mode.kind} className="flex flex-1 flex-col">
        {mode.kind === "shop" ? (
          <ShopCatalogueView
            shop={shop}
            catalogue={mode.catalogue}
            liveCount={mode.liveCount}
            onAsk={onAsk}
            onShare={onShare}
          />
        ) : null}

        {mode.kind === "product" ? (
          <StorefrontProductView shop={shop} product={mode.product} onAsk={onAsk} />
        ) : null}

        {mode.kind === "oos" ? (
          <OutOfStockView shop={shop} product={mode.product} onAsk={onAsk} />
        ) : null}

        {mode.kind === "gone" ? <ListingGoneView shopSlug={shop.slug} /> : null}
      </BuyerRise>
    </div>
  );
}

export function StorefrontShell(props: StorefrontShellProps) {
  return (
    <ToastProvider>
      <StorefrontShellInner {...props} />
    </ToastProvider>
  );
}
