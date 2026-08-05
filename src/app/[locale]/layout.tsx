import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { GsapProvider } from "@/components/providers/GsapProvider";
import { routing } from "@/i18n/routing";
import { siteMeta } from "@/data/site-meta";
import "@/styles/globals.css";

const bricolage = localFont({
  src: [
    {
      path: "../../../public/fonts/bricolage-grotesque-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/bricolage-grotesque-latin-800-normal.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-bricolage",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

const figtree = localFont({
  src: [
    {
      path: "../../../public/fonts/figtree-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/figtree-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/figtree-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/figtree-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-figtree",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default as {
    meta: { title: string; description: string };
  };
  const base = siteMeta.canonicalBase;

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    metadataBase: new URL(base),
    alternates: {
      canonical: locale === routing.defaultLocale ? base : `${base}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [
          loc,
          loc === routing.defaultLocale ? base : `${base}/${loc}`,
        ]),
      ),
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: messages.meta.title,
      description: messages.meta.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#024241",
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${bricolage.variable} ${figtree.variable}`}>
      <body className="bg-deep">
        <NextIntlClientProvider messages={messages}>
          <GsapProvider>
            <div className="mx-auto min-h-screen w-full bg-paper">{children}</div>
          </GsapProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
