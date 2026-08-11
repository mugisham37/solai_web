import type {
  BuyerDeliveryArea,
  BuyerProduct,
  BuyerShop,
} from "@/types/buyer";
import type { CurrencyCode, Money } from "@/types/money";

const CURRENCY: CurrencyCode = "RWF";

function rwf(amountMinor: number): Money {
  return { amountMinor, currency: CURRENCY };
}

/** Seed mirrored from `13-storefront.html` — aligned with dashboard Amara ids. */
export function createBuyerSeed(): {
  shop: BuyerShop;
  products: BuyerProduct[];
} {
  const deliveryAreas: readonly BuyerDeliveryArea[] = [
    { id: "kimironko", label: "Kimironko", fee: rwf(1200) },
    { id: "nyamirambo", label: "Nyamirambo", fee: rwf(1200) },
    { id: "kacyiru", label: "Kacyiru", fee: rwf(1500) },
    { id: "remera", label: "Remera", fee: rwf(1500) },
    { id: "outside", label: "Outside Kigali", fee: rwf(2500) },
    { id: "pickup", label: "I'll collect it myself", fee: rwf(0) },
  ];

  const shop: BuyerShop = {
    id: "shop_amara",
    name: "Amara Beads",
    slug: "amara",
    city: "Kigali",
    currency: CURRENCY,
    tagline:
      "Handmade beadwork, made to order in any colour. Every order is held by SolAI until you confirm you have it.",
    whatsappPrefillName: "Amara Beads",
    seller: {
      initials: "AB",
      sellingSinceLabel: "selling since June",
      deliveredLabel: "3 of 3",
      confirmedPctLabel: "100%",
      shipsLabel: "Same day",
      repliesLabel: "Under 1 hour",
      isNewerSeller: true,
      verifiedWallet: true,
    },
    recentDeliveries: [
      { id: "d1", buyerInitial: "J", area: "Kimironko", whenLabel: "2 days ago" },
      { id: "d2", buyerInitial: "S", area: "Remera", whenLabel: "4 days ago" },
      { id: "d3", buyerInitial: "G", area: "Kacyiru", whenLabel: "last week" },
    ],
    deliveryAreas,
    deliveryFrom: rwf(1200),
  };

  const products: BuyerProduct[] = [
    {
      id: "p1",
      shopId: shop.id,
      title: "Hand-strung beaded bracelet",
      eyebrow: "Handmade in Nyamirambo",
      description:
        "Glass beads strung by hand, one at a time. Adjustable, so it fits most wrists. Made to order in any colour — say which one at checkout or ask first.",
      price: rwf(8500),
      stock: 12,
      status: "live",
      variants: ["Blue", "Terracotta", "Cream", "Mixed"],
      shortLabel: "Bracelet",
      images: [
        { kind: "own", label: "Taken by the seller", palette: 0, beads: 15 },
        { kind: "ai", label: "Styled · clean white", palette: 4, beads: 13 },
        { kind: "ai", label: "Styled · market stall", palette: 1, beads: 12 },
        { kind: "ai", label: "Styled · on the wrist", palette: 2, beads: 14 },
        { kind: "ai", label: "Styled · flat lay", palette: 3, beads: 11 },
        { kind: "ai", label: "Styled · outdoors", palette: 5, beads: 13 },
      ],
    },
    {
      id: "p2",
      shopId: shop.id,
      title: "Beaded anklet, adjustable",
      eyebrow: "Handmade in Nyamirambo",
      description:
        "Amara has sold out of this one. She makes them to order, so it is usually back within a few days.",
      price: rwf(6000),
      stock: 0,
      status: "oos",
      variants: ["Blue", "Terracotta", "Cream"],
      shortLabel: "Anklet",
      images: [{ kind: "own", label: "Taken by the seller", palette: 1, beads: 12 }],
    },
    {
      id: "p3",
      shopId: shop.id,
      title: "Waist beads, terracotta",
      eyebrow: "Handmade in Nyamirambo",
      description: "Traditional waist beads, sized to measure.",
      price: rwf(11500),
      stock: 5,
      status: "live",
      variants: ["Terracotta", "Cream", "Mixed"],
      shortLabel: "Waist beads",
      images: [
        { kind: "own", label: "Taken by the seller", palette: 2, beads: 14 },
        { kind: "ai", label: "Styled · clean white", palette: 4, beads: 12 },
      ],
    },
  ];

  return { shop, products };
}

export const CHECKOUT_SESSION_TTL_MS = 30 * 60 * 1000;
