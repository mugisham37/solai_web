import type {
  DashboardNotification,
  DashboardOrder,
  DashboardPayout,
  DashboardProduct,
  DashboardShop,
} from "@/types/dashboard";
import type { CurrencyCode, Money } from "@/types/money";

const CURRENCY: CurrencyCode = "RWF";

function rwf(amountMinor: number): Money {
  return { amountMinor, currency: CURRENCY };
}

/** Seed data mirrored from `06-12-dashboard.html` — Amara Beads shop. */
export function createDashboardSeed(): {
  shop: DashboardShop;
  products: DashboardProduct[];
  orders: DashboardOrder[];
  payouts: DashboardPayout[];
  notifications: DashboardNotification[];
} {
  const shop: DashboardShop = {
    id: "shop_amara",
    draftId: "demo-amara-beads",
    name: "Amara Beads",
    slug: "amara",
    city: "Kigali",
    currency: CURRENCY,
    plan: "free",
    lang: "en",
    walletLabel: "MTN Mobile Money",
    walletMasked: "+250 788 ••• 456",
    holderName: "U. AMARA",
    deliveryEnabled: true,
    pickupEnabled: false,
    notifySms: true,
    notifyWa: true,
    availableBalance: rwf(24500),
  };

  const products: DashboardProduct[] = [
    {
      id: "p1",
      name: "Hand-strung beaded bracelet",
      price: rwf(8500),
      stock: 12,
      status: "live",
      views: 312,
      sold: 4,
      palette: 0,
      description:
        "Glass beads strung by hand in Nyamirambo. Adjustable, fits most wrists.",
    },
    {
      id: "p2",
      name: "Beaded anklet, adjustable",
      price: rwf(6000),
      stock: 0,
      status: "oos",
      views: 118,
      sold: 2,
      palette: 1,
      description: "Same beads, shorter. Made to order in any colour.",
    },
    {
      id: "p3",
      name: "Waist beads, terracotta",
      price: rwf(11500),
      stock: 5,
      status: "draft",
      views: 0,
      sold: 0,
      palette: 2,
      description: "Traditional waist beads, sized to measure.",
    },
  ];

  const orders: DashboardOrder[] = [
    {
      id: "1042",
      buyerName: "Jean-Paul K.",
      buyerArea: "Kimironko",
      productId: "p1",
      qty: 1,
      item: rwf(8500),
      delivery: rwf(1200),
      fee: rwf(255),
      disbursement: rwf(100),
      status: "held",
      whenLabel: "6 min ago",
      courierLabel: "Moto · MT-114",
      deliveryCode: "5083",
    },
    {
      id: "1041",
      buyerName: "Aline M.",
      buyerArea: "Nyamirambo",
      productId: "p2",
      qty: 2,
      item: rwf(12000),
      delivery: rwf(1200),
      fee: rwf(360),
      disbursement: rwf(100),
      status: "transit",
      whenLabel: "2 hours ago",
      courierLabel: "Moto · MT-097",
      deliveryCode: "7741",
    },
    {
      id: "1039",
      buyerName: "Grace U.",
      buyerArea: "Kacyiru",
      productId: "p1",
      qty: 1,
      item: rwf(8500),
      delivery: rwf(1200),
      fee: rwf(255),
      disbursement: rwf(100),
      status: "paid",
      whenLabel: "Yesterday",
      courierLabel: "Moto · MT-114",
      deliveryCode: "2210",
      settledSeconds: 4,
    },
    {
      id: "1036",
      buyerName: "Samuel K.",
      buyerArea: "Remera",
      productId: "p1",
      qty: 1,
      item: rwf(8500),
      delivery: rwf(1200),
      fee: rwf(255),
      disbursement: rwf(100),
      status: "paid",
      whenLabel: "3 days ago",
      courierLabel: "Moto · MT-060",
      deliveryCode: "9014",
      settledSeconds: 6,
    },
    {
      id: "1033",
      buyerName: "Claudine N.",
      buyerArea: "Gikondo",
      productId: "p2",
      qty: 1,
      item: rwf(6000),
      delivery: rwf(1200),
      fee: rwf(180),
      disbursement: rwf(100),
      status: "problem",
      whenLabel: "5 days ago",
      courierLabel: "Moto · MT-031",
      deliveryCode: "4408",
    },
  ];

  const payouts: DashboardPayout[] = [
    {
      id: "PO-99401",
      whenLabel: "Yesterday 16:41",
      amount: rwf(8145),
      orderId: "1039",
      settledSeconds: 4,
    },
    {
      id: "PO-99388",
      whenLabel: "3 days ago",
      amount: rwf(8145),
      orderId: "1036",
      settledSeconds: 6,
    },
    {
      id: "PO-99341",
      whenLabel: "Last week",
      amount: rwf(5720),
      orderId: "1029",
      settledSeconds: 5,
    },
  ];

  const notifications: DashboardNotification[] = [
    {
      id: "n1",
      title: "New order from Jean-Paul K.",
      subtitle: "RWF 9,700 paid and held · 6 min ago",
      subject: { type: "order", orderId: "1042" },
      kind: "berry",
      read: false,
    },
    {
      id: "n2",
      title: "Order 1041 picked up",
      subtitle: "Courier MT-097 is on the way · 2 hours ago",
      subject: { type: "order", orderId: "1041" },
      kind: "sea",
      read: false,
    },
    {
      id: "n3",
      title: "RWF 8,145 landed in your wallet",
      subtitle: "Order 1039 released · yesterday",
      subject: { type: "money" },
      kind: "sea",
      read: false,
    },
    {
      id: "n4",
      title: "Beaded anklet is out of stock",
      subtitle: "Buyers cannot order it right now",
      subject: { type: "product", productId: "p2" },
      kind: "clay",
      read: false,
    },
  ];

  return { shop, products, orders, payouts, notifications };
}

/** Home sparkline from the HTML prototype (views, last 7 days). */
export const HOME_SPARKLINE = [42, 58, 35, 70, 64, 88, 52] as const;
export const HOME_SPARKLINE_HIGHLIGHT = 5;
export const DEFAULT_ORDER_PAGE_SIZE = 20;
