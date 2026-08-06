import { setRequestLocale, getTranslations } from "next-intl/server";
import { ActionButton } from "@/components/atoms/ActionButton";
import { EmptyState } from "@/components/atoms/EmptyState";
import { CheckoutShell } from "@/components/templates/CheckoutShell";
import { Link } from "@/i18n/navigation";
import { getBuyerService } from "@/lib/buyer";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ c?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { c } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");

  if (!c) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
        <EmptyState
          icon="wallet"
          title={t("sessionMissingTitle")}
          description={t("sessionMissingLede")}
          action={
            <ActionButton asChild variant="sun">
              <Link href={`/${slug}`}>{t("sessionMissingCta")}</Link>
            </ActionButton>
          }
        />
      </div>
    );
  }

  const page = await getBuyerService().getCheckoutPage(slug, c);
  if (!page) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center px-4">
        <EmptyState
          icon="clock"
          title={t("sessionMissingTitle")}
          description={t("sessionMissingLede")}
          action={
            <ActionButton asChild variant="sun">
              <Link href={`/${slug}`}>{t("sessionMissingCta")}</Link>
            </ActionButton>
          }
        />
      </div>
    );
  }

  return (
    <CheckoutShell
      shop={page.shop}
      product={page.product}
      session={page.session}
    />
  );
}

export async function generateMetadata() {
  return { title: "Checkout — SolAI" };
}
