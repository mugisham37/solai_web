import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("meta");

  return (
    <main className="section-y mx-auto max-w-lg px-6 text-center">
      <h1 className="text-heading-2 font-display uppercase">{t("title")}</h1>
      <p className="mt-4 text-ink-70">404</p>
      <Link href="/" className="mt-6 inline-block text-sun-deep underline">
        Home
      </Link>
    </main>
  );
}
