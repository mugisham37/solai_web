import { formatMoney } from "@/lib/money";
import type { CaptionSet, ShareProductSummary } from "@/types/share";

/**
 * The captions the generation service writes.
 *
 * They ship as data keyed by language and tone rather than as UI strings,
 * because they are content the seller edits and sends, not interface copy. They
 * are deliberately not part of the i18n bundle: the seller picks the language
 * the message goes out in, independently of the language they read the app in.
 *
 * OUTSTANDING: the Kinyarwanda below is a working draft and needs a native pass
 * before launch. It goes out under the seller's name to people who know them,
 * so an awkward phrasing costs more here than anywhere else in the product.
 */

export type CaptionInput = Readonly<{
  shopName: string;
  product: ShareProductSummary;
  city: string;
  shopUrl: string;
  /** Locale used to format the price inside the caption text. */
  locale: string;
}>;

/**
 * Builds all six captions at once.
 *
 * The link is embedded in every one of them, because SMS, WhatsApp and email
 * have no separate link field and a caption that arrives without a link is a
 * dead end.
 */
export function buildCaptions({ product, city, shopUrl, locale }: CaptionInput): CaptionSet {
  const price = formatMoney({ amountMinor: product.priceMinor, currency: product.currency }, locale);
  const item = product.title;

  return {
    en: {
      friendly: [
        `I've opened my shop! ${item} — ${price}, made to order in any colour.`,
        "",
        `Pay with MoMo or Airtel, and SolAI holds your money until it's in your hands. Delivery in ${city}.`,
        "",
        shopUrl,
      ].join("\n"),

      short: [`${item} — ${price}. MoMo accepted, delivery in ${city}.`, shopUrl].join("\n"),

      offer: [
        `My shop is open 🎉 First five orders get free delivery in ${city}.`,
        "",
        `${item} — ${price}, any colour.`,
        "Pay by MoMo. Your money is held until you receive it.",
        "",
        shopUrl,
      ].join("\n"),
    },

    rw: {
      friendly: [
        `Nafunguye iduka ryanjye! ${item} — ${price}, nkorera mu mabara yose ushaka.`,
        "",
        `Wishyura na MoMo cyangwa Airtel, kandi SolAI ibika amafaranga kugeza ubonye ibicuruzwa. Tugeza i ${city}.`,
        "",
        shopUrl,
      ].join("\n"),

      short: [`${item} — ${price}. Wishyura na MoMo, tugeza i ${city}.`, shopUrl].join("\n"),

      offer: [
        `Iduka ryanjye rirakinguye 🎉 Abantu batanu ba mbere ntibishyura ubwikorezi i ${city}.`,
        "",
        `${item} — ${price}.`,
        "Wishyura na MoMo. Amafaranga yawe arabikwa kugeza ubonye ibyo waguze.",
        "",
        shopUrl,
      ].join("\n"),
    },
  };
}

/** Subject line for the email intent; the caption itself becomes the body. */
export function emailSubject(shopName: string): string {
  return `${shopName} is open`;
}
