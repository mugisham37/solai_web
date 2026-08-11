"use client";

import { useTransition } from "react";
import { loginConsoleAction } from "@/app/actions/console/session";
import { ActionButton } from "@/components/atoms/ActionButton";
import { ConsoleBrand } from "@/components/atoms/ConsoleBrand";
import { Lockbar } from "@/components/atoms/Lockbar";
import type { ConsoleRole } from "@/types/console";

const ROLES: { role: ConsoleRole; title: string; lede: string }[] = [
  {
    role: "support",
    title: "Support agent",
    lede: "Resolve disputes under the threshold. Take listings down.",
  },
  {
    role: "finance",
    title: "Finance",
    lede: "Approve above-threshold cases. Unmask identity.",
  },
  {
    role: "admin",
    title: "Administrator",
    lede: "Suspend accounts. Change hold rules. Full console.",
  },
];

export function ConsoleLoginView() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-5 bg-paper px-5 py-12">
      <ConsoleBrand />
      <div>
        <h1 className="font-display text-d1 font-extrabold tracking-tight text-ink uppercase">
          Console
        </h1>
        <p className="mt-2 text-sm text-ink-70">
          Internal operations. Every action is signed with your name. Demo
          login — pick the role you are acting as.
        </p>
      </div>

      <Lockbar>
        Nobody in this console can move money to a destination they choose.
        There is no “send funds” field at any role.
      </Lockbar>

      <div className="flex flex-col gap-2">
        {ROLES.map((r) => (
          <ActionButton
            key={r.role}
            type="button"
            variant="line"
            block
            disabled={pending}
            className="h-auto flex-col items-start gap-1 px-4 py-4 text-left"
            onClick={() => {
              startTransition(async () => {
                await loginConsoleAction(r.role);
              });
            }}
          >
            <span className="text-[0.95rem] font-bold text-ink">{r.title}</span>
            <span className="text-[0.78rem] font-normal text-ink-45">
              {r.lede}
            </span>
          </ActionButton>
        ))}
      </div>
    </div>
  );
}
