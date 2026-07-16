import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { ComplianceBadgeGroup } from "@/components/molecules/ComplianceBadgeGroup";
import { footerGroups } from "@/lib/data/nav";
import { siteConfig } from "@/lib/data/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface px-4 pt-12 pb-6 md:px-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo className="mb-3" size={24} />
          <p className="max-w-[280px] text-[13px] text-text-subtle">
            {siteConfig.tagline}
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h4 className="mb-3 text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
              {group.title}
            </h4>
            {group.links.map((link) =>
              link.disabled || !link.href ? (
                <span
                  key={link.label}
                  aria-disabled="true"
                  className="mb-2 block cursor-not-allowed text-[13px] text-text-muted/50"
                >
                  {link.label}
                </span>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="mb-2 block text-[13px] text-text-muted no-underline hover:text-text hover:no-underline"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-[1280px] flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
        <span className="text-xs text-text-subtle">{siteConfig.copyright}</span>
        <ComplianceBadgeGroup badges={siteConfig.complianceBadges} />
      </div>
    </footer>
  );
}
