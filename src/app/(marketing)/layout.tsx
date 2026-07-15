import { MarketingNav } from "@/components/organisms/MarketingNav";
import { MarketingFooter } from "@/components/organisms/MarketingFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </>
  );
}
