import { createDraftFromQuery } from "@/app/actions/create-draft";

type StartPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function StartPage({ searchParams }: StartPageProps) {
  const { q } = await searchParams;
  await createDraftFromQuery(q);
}
