import { ThemeToggle } from "@/components/atoms/ThemeToggle";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeToggle className="fixed top-3 right-3 z-[200] size-8" />
      {children}
    </>
  );
}
