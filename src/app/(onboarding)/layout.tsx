import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { OnboardingProvider } from "@/providers/onboarding-provider";

export default function OnboardingGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <ThemeToggle className="fixed top-3 right-3 z-[200] size-8 md:hidden" />
      {children}
    </OnboardingProvider>
  );
}
