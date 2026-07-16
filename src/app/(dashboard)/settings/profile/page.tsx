import type { Metadata } from "next";
import { ProfileSettings } from "@/components/organisms/app/settings/ProfileSettings";

export const metadata: Metadata = {
  title: "Profile — Settings",
  description: "Your personal information and account preferences.",
};

export default function ProfileSettingsPage() {
  return <ProfileSettings />;
}
