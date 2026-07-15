import { SettingsLayout } from "@/components/organisms/app/settings/SettingsLayout";

export default function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}
