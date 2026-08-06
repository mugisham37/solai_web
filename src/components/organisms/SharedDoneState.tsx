"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { DURATION, MOTION_EASE } from "@/lib/motion";
import type { IconName } from "@/types/icon";

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type SharedDoneStateProps = {
  t: TranslateFn;
  /** Where the "while you wait" tiles lead. */
  catalogueHref: string;
  addProductHref: string;
  reachHref: string;
  shopHomeHref: string;
};

const NEXT_TILES: ReadonlyArray<{
  key: string;
  icon: IconName;
  tileClass: string;
  hrefKey: "catalogueHref" | "addProductHref" | "reachHref";
}> = [
  {
    key: "catalogue",
    icon: "whatsapp",
    tileClass: "bg-whatsapp text-white",
    hrefKey: "catalogueHref",
  },
  { key: "addProduct", icon: "spark", tileClass: "bg-sun text-sun-ink", hrefKey: "addProductHref" },
  { key: "reach", icon: "chart", tileClass: "bg-paper-2 text-ink", hrefKey: "reachHref" },
];

/**
 * The end of the setup flow.
 *
 * The copy is warm and finished rather than another call to action: the seller
 * has done the work, and the next useful thing happens when a buyer arrives.
 */
export function SharedDoneState({
  t,
  catalogueHref,
  addProductHref,
  reachHref,
  shopHomeHref,
}: SharedDoneStateProps) {
  const reduceMotion = useReducedMotion();
  const hrefs = { catalogueHref, addProductHref, reachHref };

  return (
    <motion.section
      className="flex flex-1 flex-col px-3.5 py-6 md:px-6 md:py-10"
      aria-label={t("done.title")}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.element, ease: MOTION_EASE }}
    >
      <div className="mx-auto flex w-full max-w-[620px] flex-col gap-5">
        <div className="text-center">
          <motion.span
            className="mx-auto mb-4 grid size-16 place-items-center rounded-[20px] bg-sea text-white"
            aria-hidden
            initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: DURATION.element, ease: MOTION_EASE }}
          >
            <Icon name="check" size="lg" className="size-7 stroke-[2.4]" />
          </motion.span>

          <Heading level={1} size="display" className="text-d1">
            {t("done.title")}
          </Heading>
          <Text className="mx-auto mt-2.5 max-w-[44ch] text-ink-70">{t("done.lede")}</Text>
        </div>

        <section className="rounded-card bg-sun p-4 text-sun-ink">
          <p className="text-[0.96rem] font-bold leading-snug">{t("done.expectTitle")}</p>
          <div className="mt-2 flex flex-col gap-2">
            <p className="m-0 text-[0.88rem] leading-normal">{t("done.expectBody1")}</p>
            <p className="m-0 text-[0.88rem] leading-normal">{t("done.expectBody2")}</p>
          </div>
        </section>

        <section className="rounded-card border border-hair bg-white p-4">
          <Eyebrow variant="quiet" className="mb-2.5">
            {t("done.whileYouWait")}
          </Eyebrow>

          <div className="flex flex-col gap-2">
            {NEXT_TILES.map((tile) => (
              <Link
                key={tile.key}
                href={hrefs[tile.hrefKey]}
                className="flex items-center gap-2.5 rounded-tile border border-hair bg-white p-3 text-left transition-colors hover:bg-paper-2"
              >
                <span
                  className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tile.tileClass)}
                  aria-hidden
                >
                  <Icon name={tile.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.93rem] font-bold leading-snug">
                    {t(`done.${tile.key}Title`)}
                  </span>
                  <span className="mt-0.5 block text-[0.76rem] text-ink-45">
                    {t(`done.${tile.key}Sub`)}
                  </span>
                </span>
                <Icon name="arrowRight" className="text-ink-45" />
              </Link>
            ))}
          </div>
        </section>

        <ActionButton variant="sun" size="lg" block asChild>
          <Link href={shopHomeHref}>
            {t("done.shopHome")}
            <Icon name="arrowRight" />
          </Link>
        </ActionButton>
      </div>
    </motion.section>
  );
}
