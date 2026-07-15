import { DynamicIcon } from "@/components/atoms/DynamicIcon";
import { contactMethods, legalLinks } from "@/lib/data/contact";

export function ContactInfo() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-text">
        Other ways to reach us
      </h3>
      {contactMethods.map((method) => (
          <div
            key={method.title}
            className="mb-4 flex gap-3 text-sm text-text-muted"
          >
            <DynamicIcon name={method.icon} className="mt-0.5 size-[18px] shrink-0 text-brand" />
            <div>
              <strong className="mb-0.5 block text-text">{method.title}</strong>
              {method.value}
            </div>
          </div>
        ))}
      <div className="mt-8 border-t border-border pt-5">
        <h4 className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-text-subtle uppercase">
          Legal
        </h4>
        {legalLinks.map((link) => (
          <span
            key={link}
            aria-disabled="true"
            className="mb-1.5 block cursor-not-allowed text-[13px] text-text-muted/50"
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}
