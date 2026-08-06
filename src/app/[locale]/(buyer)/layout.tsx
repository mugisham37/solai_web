import { setRequestLocale } from "next-intl/server";

type BuyerLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function BuyerLayout({ children, params }: BuyerLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
