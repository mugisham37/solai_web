"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { TeamMember, TeamRole } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { roleDefinitions, teamMembers } from "@/lib/data/app/settings";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleTone(role: TeamRole) {
  switch (role) {
    case "Owner":
      return "bg-brand-soft text-brand";
    case "Admin":
      return "bg-info/10 text-info";
    case "Operator":
      return "bg-surface-2 text-text-muted";
    default:
      return "border border-border bg-transparent text-text-subtle";
  }
}

function RolePill({ role }: { role: TeamRole }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-pill px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide uppercase",
        roleTone(role)
      )}
    >
      {role}
    </span>
  );
}

function matchesSearch(member: TeamMember, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    member.name.toLowerCase().includes(q) ||
    member.email.toLowerCase().includes(q)
  );
}

export function TeamSettings() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => teamMembers.filter((member) => matchesSearch(member, search)),
    [search]
  );

  const invitedCount = teamMembers.filter((m) => m.status === "invited").length;
  const adminCount = teamMembers.filter(
    (m) => m.role === "Owner" || m.role === "Admin"
  ).length;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Team & roles
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {teamMembers.length} members · {adminCount} admins
            {invitedCount > 0 ? ` · ${invitedCount} pending invite` : ""}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">Manage roles</Button>
          <Button variant="default">
            <Plus className="size-4" />
            Invite member
          </Button>
        </div>
      </header>

      <section className="mb-4 overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-[18px] py-3.5">
          <h2 className="text-sm font-semibold text-text">Members</h2>
          <div className="relative min-w-[240px] flex-1 sm:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-text-subtle" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-surface-2 hover:bg-surface-2">
              <TableHead className="px-[18px]">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((member) => (
              <TableRow key={member.email}>
                <TableCell className="px-[18px]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-semibold text-text-muted">
                      {initials(member.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        {member.name}
                      </p>
                      <p className="text-[11.5px] text-text-subtle">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RolePill role={member.role} />
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-text-muted">
                    {member.scope}
                  </span>
                </TableCell>
                <TableCell>
                  {member.mfa ? (
                    <Badge className="border-0 bg-success/10 font-mono text-[10px] text-success uppercase">
                      On
                    </Badge>
                  ) : (
                    <Badge className="border-0 bg-warning/10 font-mono text-[10px] text-warning uppercase">
                      Off
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-text-muted">
                    {member.last}
                  </span>
                </TableCell>
                <TableCell>
                  {member.status === "invited" ? (
                    <Badge className="border-0 bg-warning/10 font-mono text-[10px] text-warning uppercase">
                      Invite pending
                    </Badge>
                  ) : (
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Manage
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-[18px] py-3.5">
          <h2 className="text-sm font-semibold text-text">Role definitions</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 p-[18px] sm:grid-cols-2 xl:grid-cols-4">
          {roleDefinitions.map((role) => (
            <div
              key={role.role}
              className="rounded-md border border-border bg-bg p-3.5"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <strong className="text-sm text-text">{role.role}</strong>
              </div>
              <p className="text-xs leading-relaxed text-text-muted">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
