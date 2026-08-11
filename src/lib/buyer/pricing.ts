import type { BuyerDeliveryArea, BuyerProduct } from "@/types/buyer";
import type { Money } from "@/types/money";

export type PriceBreakdown = Readonly<{
  itemLine: Money;
  ship: Money;
  total: Money;
  isPickup: boolean;
}>;

/** Single place for storefront + checkout price maths. */
export function calcLineTotal(
  unit: Money,
  qty: number,
  ship: Money,
): PriceBreakdown {
  const itemLine: Money = {
    amountMinor: unit.amountMinor * qty,
    currency: unit.currency,
  };
  return {
    itemLine,
    ship,
    total: {
      amountMinor: itemLine.amountMinor + ship.amountMinor,
      currency: unit.currency,
    },
    isPickup: ship.amountMinor === 0,
  };
}

export function findArea(
  areas: readonly BuyerDeliveryArea[],
  areaId: string,
): BuyerDeliveryArea | undefined {
  return areas.find((a) => a.id === areaId);
}

export function defaultAreaId(areas: readonly BuyerDeliveryArea[]): string {
  return areas[0]?.id ?? "pickup";
}

export function clampQty(qty: number, stock: number): number {
  if (stock <= 0) return 0;
  return Math.min(Math.max(1, Math.floor(qty)), stock);
}

export function isPurchasable(product: BuyerProduct): boolean {
  return product.status === "live" && product.stock > 0;
}
