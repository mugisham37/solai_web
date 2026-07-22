"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrorBanner } from "@/components/molecules/FormErrorBanner";
import { PasswordField } from "@/components/molecules/PasswordField";
import { formatRetryMessage, parseApiError } from "@/lib/api/errors";
import * as sessionsService from "@/lib/api/services/sessions";
import * as twoFactorService from "@/lib/api/services/twoFactor";
import * as usersService from "@/lib/api/services/users";
import { useSession } from "@/providers/session-provider";

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border px-[18px] py-3.5">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ProfileSettings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, workspace, updateUser } = useSession();
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: usersService.getProfile,
    enabled: Boolean(user),
  });

  const twoFactorQuery = useQuery({
    queryKey: ["two-factor-status"],
    queryFn: twoFactorService.getTwoFactorStatus,
    enabled: Boolean(user),
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsService.listSessions,
    enabled: sessionsOpen,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setFullName(profileQuery.data.full_name);
      updateUser(profileQuery.data);
    }
  }, [profileQuery.data, updateUser]);

  const saveProfile = useMutation({
    mutationFn: () => usersService.updateProfile({ full_name: fullName }),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setError("");
    },
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const changePassword = useMutation({
    mutationFn: () =>
      usersService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    onSuccess: () => {
      setPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    },
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const regenerateRecovery = useMutation({
    mutationFn: () =>
      twoFactorService.regenerateRecoveryCodes({ password: recoveryPassword }),
    onSuccess: (data) => {
      setRecoveryCodes(data.recovery_codes);
      queryClient.invalidateQueries({ queryKey: ["two-factor-status"] });
      setRecoveryPassword("");
    },
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const revokeSession = useMutation({
    mutationFn: sessionsService.revokeSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const revokeOthers = useMutation({
    mutationFn: sessionsService.revokeOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const disableMethod = useMutation({
    mutationFn: twoFactorService.disableTwoFactorMethod,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["two-factor-status"] }),
    onError: (err) => setError(formatRetryMessage(parseApiError(err))),
  });

  const profile = profileQuery.data ?? user;
  const twoFactor = twoFactorQuery.data;
  const initials = useMemo(
    () =>
      profile?.full_name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "?",
    [profile?.full_name],
  );

  const twoFactorDesc =
    twoFactor && twoFactor.methods.length > 0
      ? twoFactor.methods
          .map((method) =>
            method.method_type === "sms" && method.phone_last_four
              ? `SMS •••${method.phone_last_four}`
              : method.method_type.toUpperCase(),
          )
          .join(" + ")
      : "Not enabled";

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your personal information and account preferences.
        </p>
      </header>

      <FormErrorBanner message={error} className="mb-4" />

      <SettingsCard title="Personal information">
        <div className="flex flex-col gap-[18px] p-[18px]">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{profile.full_name}</p>
              <p className="font-mono text-xs text-text-subtle">
                {profile.email}
                {workspace ? ` · ${workspace.plan}` : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Full name
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Email
              </Label>
              <Input type="email" value={profile.email} disabled />
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Security">
        <ul className="divide-y divide-border">
          <li className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5">
            <div>
              <p className="text-sm font-medium text-text">Password</p>
              <p className="text-xs text-text-subtle">
                Change your account password.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setPasswordOpen(true)}>
              Change
            </Button>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-text">
                Two-factor authentication
                {twoFactor && twoFactor.methods.length > 0 ? (
                  <Badge className="border-0 bg-success/10 font-mono text-[10px] text-success uppercase">
                    On
                  </Badge>
                ) : null}
              </p>
              <p className="text-xs text-text-subtle">{twoFactorDesc}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/2fa-setup">Manage</Link>
              </Button>
              {twoFactor?.methods.map((method) => (
                <Button
                  key={method.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => disableMethod.mutate(method.id)}
                >
                  Disable {method.method_type}
                </Button>
              ))}
            </div>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5">
            <div>
              <p className="text-sm font-medium text-text">Active sessions</p>
              <p className="text-xs text-text-subtle">
                Review and revoke signed-in devices.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setSessionsOpen(true)}>
              View sessions
            </Button>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5">
            <div>
              <p className="text-sm font-medium text-text">Recovery codes</p>
              <p className="text-xs text-text-subtle">
                {twoFactor
                  ? `${twoFactor.unused_recovery_codes} unused recovery codes.`
                  : "Enable 2FA to generate recovery codes."}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={!twoFactor || twoFactor.methods.length === 0}
              onClick={() => setRecoveryOpen(true)}
            >
              Regenerate
            </Button>
          </li>
        </ul>
      </SettingsCard>

      <footer className="mt-6 flex justify-end gap-2 border-t border-border pt-[18px]">
        <Button variant="ghost" onClick={() => router.refresh()}>
          Cancel
        </Button>
        <Button
          variant="default"
          disabled={saveProfile.isPending}
          onClick={() => saveProfile.mutate()}
        >
          {saveProfile.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
      </footer>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <PasswordField
              id="current-password"
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              id="new-password-settings"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              showStrength
            />
            <PasswordField
              id="confirm-password-settings"
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <Button
              disabled={
                changePassword.isPending ||
                !currentPassword ||
                !newPassword ||
                newPassword !== confirmPassword
              }
              onClick={() => changePassword.mutate()}
            >
              Update password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={sessionsOpen} onOpenChange={setSessionsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Active sessions</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {sessionsQuery.isLoading ? (
              <Loader2 className="mx-auto size-5 animate-spin" />
            ) : (
              sessionsQuery.data?.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text">
                      {session.device_label ?? "Unknown device"}
                      {session.is_current ? " (this device)" : ""}
                    </p>
                    <p className="text-xs text-text-subtle">
                      {session.ip_address ?? "Unknown IP"} ·{" "}
                      {session.last_used_at
                        ? new Date(session.last_used_at).toLocaleString()
                        : "Never used"}
                    </p>
                  </div>
                  {!session.is_current ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revokeSession.mutate(session.id)}
                    >
                      Revoke
                    </Button>
                  ) : null}
                </div>
              ))
            )}
          </div>
          <Button
            variant="secondary"
            onClick={() => revokeOthers.mutate()}
            disabled={revokeOthers.isPending}
          >
            Sign out all other devices
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate recovery codes</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <PasswordField
              id="recovery-password"
              label="Current password"
              value={recoveryPassword}
              onChange={setRecoveryPassword}
            />
            <Button
              disabled={regenerateRecovery.isPending || !recoveryPassword}
              onClick={() => regenerateRecovery.mutate()}
            >
              Regenerate codes
            </Button>
            {recoveryCodes.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {recoveryCodes.map((code) => (
                  <code
                    key={code}
                    className="rounded-md border border-border px-2 py-1 font-mono text-xs"
                  >
                    {code}
                  </code>
                ))}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
