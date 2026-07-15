import type { Metadata } from "next";
import { ExpiredLinkScreen } from "@/components/organisms/auth/ExpiredLinkScreen";

export const metadata: Metadata = {
  title: "Link expired",
  description: "This authentication link is no longer valid.",
};

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function LinkExpiredPage({ searchParams }: PageProps) {
  const { type } = await searchParams;
  return (
    <ExpiredLinkScreen
      type={type === "reset" ? "reset" : "magic"}
    />
  );
}
