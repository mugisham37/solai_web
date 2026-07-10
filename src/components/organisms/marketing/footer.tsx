import { Logo } from "@/components/atoms/logo";
import { NavLink } from "@/components/atoms/nav-link";
import { COMPLIANCE_BADGES, FOOTER_COLUMNS } from "@/data/marketing/footer-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface px-4 pt-12 pb-6 sm:px-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3">
            <Logo iconSize={24} />
          </div>
          <p className="max-w-[280px] text-[13px] text-text-subtle">
            The autonomous revenue engine for e-commerce sellers. Built by Digisi
            Rwanda.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
              {column.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <NavLink link={link} variant="plain" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <span className="text-xs text-text-subtle">
          © {year} Digisi Rwanda. All rights reserved.
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMPLIANCE_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded border border-border bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.04em] text-text-subtle uppercase"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
