import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
};

export function NavLink({ href, children, className, onDark = true }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-semibold transition",
        onDark ? "text-on-deep-60 hover:text-on-deep" : "text-ink-70 hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}
