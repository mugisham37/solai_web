import { NavLink } from "@/components/atoms/nav-link";
import { MARKETING_ICONS } from "@/lib/marketing-icons";
import { CONTACT_LEGAL_LINKS, CONTACT_METHODS } from "@/data/marketing/contact";

export function ContactInfo() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-text">Other ways to reach us</h3>
      {CONTACT_METHODS.map((method) => {
        const Icon = MARKETING_ICONS[method.icon];
        return (
          <div key={method.label} className="mb-4 flex gap-3 text-sm text-text-muted">
            <Icon size={18} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <strong className="mb-0.5 block text-text">{method.label}</strong>
              {method.value}
            </div>
          </div>
        );
      })}

      <div className="mt-8 border-t border-border pt-5">
        <h4 className="mb-2 font-mono text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
          Legal
        </h4>
        {CONTACT_LEGAL_LINKS.map((link) => (
          <div key={link.label} className="mb-1.5">
            <NavLink link={link} variant="plain" />
          </div>
        ))}
      </div>
    </div>
  );
}
