import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 min-[900px]:px-9">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          Your personal information and account preferences.
        </p>
      </header>

      <SettingsCard title="Personal information">
        <div className="flex flex-col gap-[18px] p-[18px]">
          <div className="flex items-center gap-3.5">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand">
              CN
            </div>
            <div>
              <p className="text-sm font-semibold text-text">
                Claudine Niyongabo
              </p>
              <p className="font-mono text-xs text-text-subtle">
                claudine@inema-boutique.rw · Owner
              </p>
              <div className="mt-2 flex gap-1.5">
                <Button variant="secondary" size="sm">
                  Upload photo
                </Button>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Full name
              </Label>
              <Input defaultValue="Claudine Niyongabo" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Display name
              </Label>
              <Input defaultValue="Claudine" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Email
              </Label>
              <Input
                type="email"
                defaultValue="claudine@inema-boutique.rw"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Phone (MoMo)
              </Label>
              <Input defaultValue="+250 788 102 884" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Language
              </Label>
              <Select defaultValue="en">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="rw">Kinyarwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11.5px] font-semibold tracking-wide text-text-muted uppercase">
                Timezone
              </Label>
              <Select defaultValue="eat">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eat">Africa/Kigali (EAT)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="cet">Europe/Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Security">
        <ul className="divide-y divide-border">
          {[
            {
              title: "Password",
              desc: "Last changed 47 days ago.",
              action: "Change",
            },
            {
              title: "Two-factor authentication",
              desc: "Authenticator app + SMS backup to +250 788•••884.",
              action: "Manage",
              badge: "On",
            },
            {
              title: "Active sessions",
              desc: "3 devices · last active 2 minutes ago in Kigali.",
              action: "View sessions",
            },
            {
              title: "Recovery codes",
              desc: "10 unused. Stored offline since signup.",
              action: "Regenerate",
            },
          ].map((row) => (
            <li
              key={row.title}
              className="flex flex-wrap items-center justify-between gap-3 px-[18px] py-3.5"
            >
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-text">
                  {row.title}
                  {row.badge && (
                    <Badge className="border-0 bg-success/10 font-mono text-[10px] text-success uppercase">
                      {row.badge}
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-text-subtle">{row.desc}</p>
              </div>
              <Button variant="secondary" size="sm">
                {row.action}
              </Button>
            </li>
          ))}
        </ul>
      </SettingsCard>

      <footer className="mt-6 flex justify-end gap-2 border-t border-border pt-[18px]">
        <Button variant="ghost">Cancel</Button>
        <Button variant="default">Save changes</Button>
      </footer>
    </div>
  );
}
