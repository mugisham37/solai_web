import type { Metadata } from "next";
import { ProfileSettings } from "@/components/organisms/app/settings/ProfileSettings";
import { requireOnboardedSession } from "@/lib/auth/require-onboarded-session";

export const metadata: Metadata = {
  title: "Profile — Settings",
  description: "Your personal information and account preferences.",
};

export default async function ProfileSettingsPage() {
  await requireOnboardedSession();

  return <ProfileSettings />;
}
