import { Link } from "@/i18n/navigation";

type FooterLinkGroupProps = {
  title: string;
  links: readonly { id: string; href: string; label: string }[];
};

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <p className="mb-2 text-[0.96rem] font-bold text-on-deep">{title}</p>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className="block py-1 text-[0.88rem] text-on-deep-60 transition hover:text-sun"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
