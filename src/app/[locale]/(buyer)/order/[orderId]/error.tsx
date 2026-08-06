"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ActionButton } from "@/components/atoms/ActionButton";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OrderError({ error, reset }: Props) {
  const t = useTranslations("protected");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-start justify-center bg-paper px-5 py-10">
      <Heading level={1} size="h2" className="mb-2">
        {t("notFoundTitle")}
      </Heading>
      <Text size="small" className="mb-6">
        {t("notFoundLede")}
      </Text>
      <div className="flex w-full flex-col gap-2">
        <ActionButton variant="sun" size="lg" block onClick={reset}>
          {t("tryAgain")}
        </ActionButton>
        <ActionButton variant="line" size="lg" block asChild>
          <Link href="/amara">{t("notFoundCta")}</Link>
        </ActionButton>
      </div>
    </div>
  );
}
