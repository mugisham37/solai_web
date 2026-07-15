# Cursor Build Prompt — SolAI Dashboard App (Flows 4–7: Dashboard, Campaigns, Conversations, Settings) + Product Tour

Paste this entire document into Cursor as your task prompt. It is self-contained. This is the largest and most important integration pass in the project — the authenticated app a seller lives in every day after signup and onboarding. Do not invent content, palettes, or routes beyond what's specified here or present in the referenced source files. Read Section 2 before touching any code — most of the foundation already exists.

---

## 1. Mission

Unlike the marketing site, auth, and onboarding flows before it, this one is not four separate sequential documents — it's **one application** with four tabs (Dashboard, Campaigns, Conversations, Settings) sharing one navigation shell, one theme, one data layer. Treat shell-level correctness (navigation, responsiveness, theming) as the foundation everything else sits on — a bug in the shell breaks all four tabs at once. This is also where several genuinely unbuilt destinations and a first-run product tour need to be designed from scratch, not just translated. Work in the phased order given in Section 20.

---

## 2. Continuity — reuse, don't rebuild

Read `/CURSOR_PROMPT_FLOW1_MARKETING.md`, `/CURSOR_PROMPT_FLOW2_AUTH.md`, and `/CURSOR_PROMPT_FLOW3_ONBOARDING.md` in the project root before starting. Reuse:

- **Design tokens** in `app/globals.css` — identical across every reference file in this project, no new tokens needed here either.
- **shadcn/ui primitives, `lucide-react`, the atoms/molecules/organisms folders, Next.js 16 constraints** (Turbopack default, `proxy.ts` not `middleware.ts`, async dynamic APIs, Cache Components off, Tailwind v4 CSS-first, no `next lint`) — all unchanged, all still apply.
- **The Drizzle + SQLite dev database** from Flow 2 (Better-Auth) and Flow 3 (onboarding drafts) — this scope adds many more tables to that same database (Section 13), it does not stand up a second one.
- **`next-themes`** — critically, this scope must *stop* the dashboard shell from reimplementing its own theme state (Section 3) and use the one shared provider everywhere.
- **`lucide-react` icon mapping** — delete `f4-shell.jsx`'s `ShIcon`, `f5-campaigns.jsx`'s inline icon references, `f6-conversations.jsx`'s `CIcon`, and `f7-settings.jsx`'s `SIcon` helpers, mapping every icon name used across all four files to its real lucide-react export (e.g. `home→Home, target→Target, messageCircle→MessageCircle, shoppingBag→ShoppingBag, clock→Clock, shield→Shield, pieChart→PieChart, settings→Settings, bell→Bell, search→Search, chevronRight/Left→ChevronRight/Left, sun→Sun, moon→Moon, alertTriangle→AlertTriangle, users→Users, whatsapp/instagram/meta` need brand-appropriate icons since lucide has no brand icons — for these three specifically, keep small hand-drawn brand SVGs as a dedicated `ChannelIcon` atom rather than forcing lucide, `filter→Filter, moreVertical→MoreVertical, paperclip→Paperclip, sparkles→Sparkles, hand→Hand, pause→Pause, play→Play, file→File, plug→Plug, card→CreditCard, log→FileText, download→Download, plus→Plus, box→Package, cash→Banknote, chart→LineChart, key→KeyRound, zap→Zap`).

---

## 3. Required shell fixes — before building any screen content

`f4-shell.jsx`'s `AppShell`/`AppSidebar`/`AppTopbar` is reused by all four flows, so fix it first and fix it once:

- **The mobile sidebar is actually broken, not just unpolished.** `AppShell` tracks a `mobileMenu` boolean and renders a dark overlay (`app-mobile-overlay`) when true, but never applies the `app-sidebar-mobile-open` class the CSS requires to slide `.app-sidebar` into view from its off-screen `left:-240px` position. Tapping the hamburger currently shows a dark overlay over an unchanged page with no visible sidebar — the mobile nav does nothing. Fix this properly: apply the open class conditionally, lock body scroll while open, close on backdrop click (already partially there) and on route change, and animate the slide with Framer Motion or the existing CSS transition, properly wired this time.
- **Theme state is reimplemented locally inside `AppShell`** (`React.useState('dark')` plus its own `document.documentElement.setAttribute` effect) — entirely disconnected from the `next-themes` provider established in Flow 1 and used everywhere since. Remove this local state entirely and use the shared `useTheme()` hook, so toggling theme anywhere in the dashboard behaves identically to toggling it on the marketing site.
- **No content max-width anywhere in the dashboard shell.** `.app-content`/`.dash-page` have no width constraint at all, while Campaigns' own `.cmp-page` does (`max-width:1320px; margin:0 auto`). On a large or ultra-wide monitor, the 6-column KPI grid and other dashboard content stretch edge-to-edge with awkward gaps — this is the "stretched out, no space on left or right" problem. Fix: give the shared content area a sensible max-width (something in the 1400–1680px range reads well for a dense analytics dashboard — pick a value and apply it consistently) centered within the sidebar+topbar frame, applied at the shell level so every screen inherits it rather than each page re-deriving its own.
- **Prefer fluid, `auto-fit`/`minmax`-based grid patterns over fixed hardcoded column-count breakpoints** wherever the reference uses `grid-template-columns: repeat(N, 1fr)` with a couple of hardcoded `@media` overrides (the KPI grid, stat grids, integration/role/creative card grids). A `minmax(220px, 1fr)`-style auto-fit pattern degrades gracefully at any width instead of only looking right at the three specific breakpoints the reference happens to hardcode — this directly addresses the "must be capable of fitting all screens" requirement, not just the handful of sizes that were tested.
- **Convert navigation to real routing.** `AppSidebar`'s `NAV_ITEMS` and `onNav(id)` callback pattern, and every flow's internal screen-picker-style state switching (`CampaignsList`'s `onOpen`, `ConversationsInbox`'s `onOpen`, Settings' `screen` state) become real `next/link` navigation with `usePathname()`-driven active-state, per the route list in Section 17.
- **Persist sidebar collapsed state** (cookie or localStorage, read before paint to avoid a layout flash) rather than resetting to expanded on every reload.
- **Wire the dead search button.** `AppTopbar`'s search button and its `title="⌘K"` hint currently call `onSearch={()=>{}}` — nothing happens. Build the real command palette described in Section 10 and open it from this button and the global keyboard shortcut.

---

## 4. Resolve the Audit Log IA conflict

`f4-shell.jsx`'s `NAV_ITEMS` includes a top-level `audit` destination ("Audit Log"), and Settings (`f7-settings.jsx`) separately has its own nested "Audit log" screen under its Workspace group with real content (`AuditView`). Don't build two audit log pages — the sidebar's top-level Audit Log item should route to the same page Settings' own audit log exposes (`/settings/audit`, Section 17). Pick one, link both entry points to it.

---

## 5. New screens to design from scratch

`NAV_ITEMS` lists 8 destinations — `dashboard, campaigns, conversations, orders, audit, safety, reports, settings` — but only 4 have any screen designed anywhere in the reference material. `audit` is resolved by Section 4. The remaining three have **zero reference design** and must be designed now, to the same standard as everything else — not left as placeholder pages:

- **Orders** (`/orders`) — the natural home for every closed sale referenced throughout the other flows (Dashboard's timeline, Conversations' "Won" threads, Campaigns' order counts). Build: a filterable, searchable order table (customer, channel the sale closed on, product, amount with currency, payment rail used, payment status, fulfillment status, and — specific to this product's African payment rails — a MoMo/Airtel settlement countdown since the reference elsewhere notes ~24h settlement lag) with filters by status/channel/date range; an order detail view reachable from any row, showing a full order timeline (ordered → paid → shipped → delivered, or the equivalent failure/refund path) plus direct links out to the conversation thread that closed the sale (Section 8) and the campaign that drove it (Section 7) — this cross-linking is what makes Orders feel integrated rather than bolted on.
- **Safety Center** (`/safety`) — Conversations already has a per-message Quarantine view (Section 8); Safety Center is the aggregate, cross-channel security surface a "Safety Center" nav item implies. Build: trend charts (via shadcn/Recharts, Section 6) of quarantine volume over time and a breakdown of top block reasons (prompt injection, phishing, bulk-bot pattern, PII exfiltration — the four reasons already seeded in the reference's quarantine data), a blocked-sender management list (add/remove/review), a direct link into Conversations' Quarantine view for message-level detail, and a link to the Safety Agent's row in Settings → Agent Permissions — Safety Center is the overview, Quarantine and Permissions are where you act.
- **Reports** (`/reports`) — deeper, exportable analytics beyond the Dashboard Home snapshot. Build: a date-range picker, channel/campaign/product performance breakdowns rendered with real shadcn/Recharts charts (not sparklines — proper time-series and comparison charts), CSV export, and a small set of saved report presets (e.g. "This month vs last month," "Channel comparison"). Scheduled/emailed reports can be noted as a documented future enhancement rather than built now — don't wire real email delivery for this.

---

## 6. Dashboard Home (Flow 4)

Rebuild `DashboardHome`, `CopilotSidebar`, and `EmptyDashboard` from `f4-dashboard.jsx`:

- **Replace every hand-computed inline `<polyline>` sparkline** (`dash-sparkline`) with a real shadcn/Recharts sparkline component (`ChartContainer` + a minimal line chart, no axes/legend needed for a sparkline) — this directly addresses the "graphs look weak / AI-generated" feedback. Feed it the same shape of data the reference already models (`spark: number[]`), just rendered through a real charting library that composes cleanly with the existing theme tokens (Recharts-based shadcn charts pick up light/dark automatically from the same CSS variables already in `app/globals.css`).
- **Consolidate the "Why?" popover.** This exact pattern appears as `dash-why-popover` here, `cv-why` in Conversations, and was already specified as a first-class `ds-why-popover` component in Flow 1's original design system document — and never actually built as one reusable thing. Build **one** `WhyPopover` organism (trigger button + positioned panel with headline, reasoning bullets, agent/run-id metadata, and a "view full decision" link) and use it everywhere a "Why?" button appears across all four flows in this scope, instead of three different bespoke implementations.
- Keep the existing Needs-Attention list, Agent Status table, and the Copilot sidebar's collapsed-FAB/expanded-panel pattern — these are reasonably well-designed already; port them faithfully, just through the shared component layers (Section 14) and against real seeded data (Section 13) instead of hardcoded arrays.
- Keep `EmptyDashboard`'s skeleton-preview pattern for the zero-data state — genuinely good, matching-final-shape skeletons rather than generic spinners, consistent with the design system's own stated principle.

---

## 7. Campaigns (Flow 5)

`f5-campaigns.jsx` has real problems worth fixing, not preserving:

- **Fix the tab/navigation inconsistency.** `CampaignDetail`'s tab row presents Plan/Creatives/Audiences/Experiments/History as one control, but clicking Creatives or Experiments calls `onCreatives`/`onABTest` and navigates to an entirely different full-page view with its own separate back button, while Plan/Audiences/History just swap content in place. Fix by converting the whole detail view to real nested routes — `/campaigns/[id]` (Plan tab as the default), `/campaigns/[id]/creatives`, `/campaigns/[id]/experiments`, and Audiences/History either as further nested routes or true in-page tabs (pick one consistently) — so all five behave identically and are deep-linkable, and the stat-grid header/tab bar persists across all of them via a shared layout rather than being rebuilt per screen.
- **Design real content for Audience and History**, which are explicitly placeholder text in the source (`"Audience tab content (placeholder for this prototype)"`, `"History tab content (placeholder for this prototype)"`). Audience: go deeper than the Plan tab's summary list — per-audience demographic breakdown, overlap analysis between the active audiences, and expansion suggestions (e.g., lookalike opportunities). History: a campaign-scoped slice of the same agent/human audit-event pattern used in Settings → Audit Log (Section 9) — reuse that component, filtered to this campaign, rather than inventing a new history format.
- **Wire the Approval Modal to a real Server Action** that actually transitions a campaign's state (draft → live) and persists it, rather than just closing the modal with no effect. The consent checkbox gate is already correctly modeled — keep it.
- Replace the hand-coded `cmp-alloc-bar`/`cmp-variant-bar` flexbox segments with real shadcn/Recharts components (a stacked/segmented bar for channel allocation, a comparison bar or grouped bar for A/B variants) — same charting-quality fix as Section 6.
- Consolidate `StatePill` into the shared `StatusBadge` molecule (Section 11).

---

## 8. Conversations (Flow 6)

This is the most operationally complex screen in the reference — the user specifically called out how powerful a real chat/inbox application is, and how much of this is currently unbuilt beyond the visual layer:

- **Real-time architecture**: layer an Ably-style (or equivalent managed pub/sub) channel per conversation on top of the existing Drizzle/SQLite persistence — messages are written to and read from the database as the source of truth; the pub/sub layer only pushes "something changed" events so an open inbox updates live without polling. Since there is no live WhatsApp/Instagram/Meta webhook ingestion in this pass (that requires developer-app approval this session cannot obtain, same reasoning as Flow 3's OAuth providers), build a **demo-mode simulated publisher** — a small background job or triggerable action that injects realistic inbound messages/typing events on an interval or on demand, so the real-time UI is genuinely demonstrable in `npm run dev` without a live integration. Document the swap point clearly for when real webhook ingestion is built later.
- **Wire search** (both the inbox list's search input and Templates'/Quarantine's dormant search affordances) to real filtering against the persisted data, not a decorative input.
- **Make the composer and "Take over" real.** Sending a message should persist it and (in demo mode) simulate the AI agent's next turn or hand off to a human-authored reply if "Take over" is active; "Take over" should visibly and functionally suspend the Sales Agent's auto-reply for that thread until released. The static hardcoded "Aline is typing…" indicator becomes a real state driven by the simulated publisher, not a permanently-rendered element.
- **Wire Quarantine's actions** ("Mark as legit / release," "Block sender," "Report to Meta") to real Server Actions that mutate the quarantined item's state and, for "release," actually forward it into the normal inbox — matching the description already in the reference's own helper text ("Releasing forwards the message to the relevant agent").
- **Unread counts and filter-pill counts** become derived from real persisted state rather than hardcoded numbers.
- Consolidate `StatusPill` into the shared `StatusBadge` molecule (Section 11), and the message-bubble avatar-with-channel-dot pattern into the shared `Avatar` atom's channel-badge slot.

---

## 9. Settings (Flow 7)

`f7-settings.jsx` covers Profile, Team & roles, Agent Permissions (correctly noted in its own source comment as "the star screen" — the granular per-agent capability matrix is genuinely well-designed, keep its structure), Integrations, Billing & usage, and Audit log:

- **Wire Team's invite flow.** "Invite member" currently has no handler at all. Build a real invite modal (email + role selection) and a pending-invite state in the members table (already partially modeled via the `status: 'invited'` row) — reuse the email-stub pattern from Flow 2 (console-log the invite in dev, no real delivery required this pass) rather than building a new email path.
- **Wire Permissions' envelope-edit links.** Rows like "Edit envelope: $400/wk →" and "Edit limit: 10% off, 5 codes/day →" currently render as dead links. Build a small edit affordance (inline field or a lightweight dialog) that actually updates the stored limit, and reflect the change in the "Trust budget" summary banner at the top of the screen.
- **Reuse Flow 3's connection/payment-rail adapters for Integrations — do not rebuild them.** `IntegrationsView`'s Channels and Payments categories re-present largely the same providers (WhatsApp, Instagram, Meta, Stripe, MTN MoMo, Airtel Money) that Onboarding's Connections and Payments steps already built connector adapters for. Settings → Integrations is simply a second UI surface over the same underlying `ConnectionState`/`PaymentRailState` data and adapters — wire it to the same source of truth so connecting or disconnecting a platform here and in onboarding stay consistent, rather than maintaining two independent connection states for the same platforms. New categories not covered by onboarding (Inventory & shipping, Data & analytics — Sol Inventory, DHL Express, Sendwave, Meta Ads read-only, Google Ads, GA4) get their own adapters following the same pattern.
- **Wire Billing's usage and envelope bars, and Permissions' envelope links, through one shared `EnvelopeBar`/`UsageBar` molecule** (Section 11) — the reference currently reimplements this progress-bar-with-threshold-coloring pattern independently in Onboarding's budget sliders, here in Permissions, and again in Billing.
- **Give Audit's filter chips and search real behavior**, and replace the "Load more" button's no-op with real pagination against the (much larger, per the reference's own "Showing 9 of 18,420 events") persisted event log.
- Consolidate `Pill` into the shared `StatusBadge` molecule (Section 11).

---

## 10. Command palette

Build a global command palette using shadcn's `Command` component (built on `cmdk`), opened by `⌘K`/`Ctrl+K` from anywhere in the dashboard and from the topbar's search button (Section 3) — this directly fulfills the `title="⌘K"` hint already present on that dead button, and matches the `⌘K` "Command palette" keyboard-shortcut sample already shown (but never built) in Flow 1's original design-system document. Search across campaigns, conversations/contacts, and settings pages, plus a set of quick actions ("New campaign," "Invite member," "New template," etc.).

---

## 11. Cross-cutting component consolidation

The reference reimplements the same handful of concepts independently across all four flows — consolidate each into one shared component rather than porting the duplication:

- **`StatusBadge` molecule** (built on shadcn's `badge`) replacing `StatePill` (Campaigns), `StatusPill` (Conversations), and `Pill` (Settings) — one component, a `tone`/`variant` prop, used everywhere a colored status label appears.
- **`WhyPopover` organism** (Section 6) replacing every ad hoc why-popover implementation across Dashboard, Campaigns, and Conversations.
- **`EnvelopeBar`/`UsageBar` molecule** (Section 9) replacing the independently-built progress bars in Onboarding's budget controls, Settings' Permissions envelope links, and Settings' Billing usage section.
- **`Avatar` atom** with an optional channel-badge slot, replacing the separate avatar implementations in Conversations (with channel dot), Settings' team table (plain), and the sidebar's user avatar (plain).
- **Shared `lib/currency.ts`** from Flow 3, reused wherever money is formatted across Campaigns, Orders, Billing, and anywhere else a price appears.

---

## 12. The product tour

This does not exist anywhere in the reference material — design and build it from scratch, per the user's explicit request that first-time dashboard visitors get walked through the software:

- **Trigger**: automatically on a user's first visit to `/dashboard` after completing (or skipping) onboarding — track this with a `hasSeenTour` flag on the user/account record, following the same persisted-flag pattern already established for onboarding completion in Flow 3.
- **Controls**: Skip visible on every single step (never buried in a menu), Next/Back navigation, a step-progress indicator (e.g. "3 of 7" or a dot sequence), and Escape-to-close — all standard, expected tour affordances.
- **Completion semantics**: mark `hasSeenTour = true` on either full completion *or* explicit skip — both count as "seen," so the tour never nags a user who's already dismissed it once. Keep it re-triggerable on demand via a "Restart product tour" action (a reasonable home for this is a help/question-mark affordance in the topbar, or a link within Settings).
- **Steps** (roughly 6–8): sidebar/navigation orientation, the KPI grid and its "Why?" explainability pattern (this is the product's signature differentiator per the marketing site — the tour should say so), the activity timeline, the Needs-Attention panel, the Agent Status table, the Copilot sidebar, and the new command palette.
- **Motion & accessibility**: honor `prefers-reduced-motion`, keep each step's tooltip focus-trapped and keyboard-navigable, and don't let the spotlight/backdrop block interaction with controls the step itself needs to reference.
- **Library choice**: prefer **Onborda** (built specifically for Next.js App Router, powered by Framer Motion — already part of this stack) if it's actively maintained at the time of building; if it isn't healthy, fall back to **Shepherd.js** with a thin custom React wrapper (it uses real CSS files rather than inline styles, so it integrates more cleanly with this project's token system than React Joyride does — avoid React Joyride as the default choice given its inline-style-first API fights a Tailwind/token-based project unless every sub-component is overridden). Verify current library health before committing, the same "check before you rely on it" discipline already applied to Better-Auth and Stripe elsewhere in this project.

---

## 13. Data layer & real-time

No real agent-execution backend exists anywhere in this project — the KPIs, timeline, agent statuses, campaigns, conversations, and quarantine items in the reference are all illustrative. Build a real, typed, seeded data layer instead of hardcoded arrays in components:

- Add tables to the existing Drizzle/SQLite database for: campaigns, campaign channel allocations, audiences, creatives, A/B experiments, conversations, messages, quarantine items, orders, audit events, and notifications.
- Seed each table with data realistic enough to demonstrate every state described in this document (live/learning/paused/draft campaigns; winning/live/paused creatives; running/completed/queued experiments; agent-handling/needs-human/closed/quarantine conversation statuses; paid/shipped/refunded orders).
- Write typed, repository-style data-access functions (e.g. `getKpis()`, `getTimeline()`, `getAgentStatus()`, `getCampaigns()`, `getConversation(id)`, `getQuarantineItems()`, `getOrders()`, `getAuditEvents()`) that the pages call — this is what makes the data shape genuinely swappable for a real agent-execution backend later, matching the same "frontend must match what the backend will require" discipline already applied in Onboarding.
- Build real Server Actions for every human-performed mutation described throughout this document: sending/taking-over a conversation reply, approving/pausing a campaign, releasing/blocking a quarantined message, inviting a team member, changing an agent permission or envelope limit, connecting/disconnecting an integration.
- Layer the demo-mode pub/sub publisher (Section 8) on top of this data, not in place of it.

---

## 14. Component architecture

Extend the atoms/molecules/organisms folders from Flows 1–3. Name these explicitly rather than leaving them implicit:

- **Atoms**: `StatusBadge`, `Avatar` (with channel-badge slot), `SparklineChart`, `EnvelopeBar`.
- **Molecules**: `KpiCard`, `TimelineItem`, `AttentionCard`, `AgentStatusRow`, `CampaignTableRow`, `CreativeCard`, `ABVariantCard`, `ConversationListItem`, `MessageBubble`, `Composer`, `TemplateCard`, `QuarantineListItem`, `OrderRow`, `SafetyTrendCard`, `ReportChartCard`, `IntegrationCard`, `RoleCard`, `TourStepTooltip`.
- **Organisms**: `AppShell`/`AppSidebar`/`AppTopbar`/`NotificationsDrawer` (fixed), `CommandPalette`, `WhyPopover`, `CampaignDetailLayout`, `ConversationsInbox`, `ConversationThread`, `ComposeForm`, `PermissionsMatrix`, `ProductTour`.

---

## 15. Animation

Use Framer Motion for shell-level and interaction-driven motion: sidebar collapse/expand and the mobile drawer's slide-in, the notifications drawer, the command palette's open/close, the tour's step-to-step transitions, and every modal/dialog open (approval modal, invite modal, envelope-edit dialog). GSAP is not needed for this scope — this is an application shell with contained, state-driven UI, not a scrolling marketing page with content reveals; don't force it in for consistency with Flow 1's landing page.

---

## 16. Accessibility & responsiveness bar

Same discipline as Flows 1–3 (focus rings, label/helper/error on every field, status never color-alone, reduced motion honored, dark/light parity, tabular numerals on every financial/numeric figure), plus shell-specific requirements: focus-trap the mobile sidebar, notifications drawer, command palette, and tour tooltips; make the command palette fully keyboard-operable (arrow keys, Enter, Escape); give every dense table (Campaigns list, Team members, Audit log) a responsive card-based fallback at narrow widths rather than a horizontally-scrolling table with no alternative; and explicitly re-verify the Section 3 max-width fix at an ultra-wide viewport (1920px+) as well as 375/768/1280px, since the original complaint was specifically about large-screen stretching.

---

## 17. Route list

Under the existing authenticated app area (protected the same way `/2fa-setup` and `/onboarding` were protected in Flows 2–3):

- `/dashboard` — Dashboard Home.
- `/campaigns` — Campaigns list.
- `/campaigns/[id]` — Plan tab (default detail view).
- `/campaigns/[id]/creatives`
- `/campaigns/[id]/experiments`
- `/conversations` — Inbox (list + thread split).
- `/conversations/[id]` — Thread, standalone (used on narrow viewports where the split collapses, per the reference's own existing `max-width:1100px` behavior).
- `/conversations/compose`
- `/conversations/templates`
- `/conversations/quarantine`
- `/orders`
- `/safety`
- `/reports`
- `/settings/profile`
- `/settings/team`
- `/settings/permissions`
- `/settings/integrations`
- `/settings/billing`
- `/settings/audit`

---

## 18. Verification / definition of done

- Walk every route above in `npm run dev`, in both themes, at 375px / 768px / 1280px / 1920px+ — explicitly re-test the ultra-wide width, since that's where the original "stretched out" complaint lives.
- Confirm the mobile sidebar genuinely opens and closes (the Section 3 fix), and that theme toggling is single-source-of-truth across marketing, auth, onboarding, and dashboard (no more independent theme state anywhere).
- Confirm the product tour triggers exactly once for a fresh user coming out of onboarding, is skippable, and is restartable afterward.
- Confirm every previously dead interactive element identified in this document (invite member, envelope edit links, audit filters/search/load-more, quarantine actions, approval modal, composer send/take-over) now does something real against persisted data.
- Confirm `/settings` and the sidebar's top-level Audit Log both land on the same page (Section 4).
- `npm run lint` and `npm run build` both pass cleanly.
- Regression check: Flows 1–3 (marketing, auth, onboarding) still work correctly after this pass's shell and data-layer changes.

---

## 19. Explicit non-goals for this pass

- No live WhatsApp/Instagram/Meta webhook ingestion — conversations run on the demo-mode simulated publisher (Section 8) until a real integration pass is scoped separately.
- No live ad-platform metric syncing (Meta/Google Ads real spend/performance data) — the seeded data layer (Section 13) stands in for this.
- No real agent-execution engine. Nothing in this pass makes an actual AI agent research audiences, generate creative, or optimize a live ad campaign — that is a distinct, much larger backend/AI-systems effort outside the scope of a frontend integration pass, and everything in Sections 6–9 should be built against the realistic, typed, seeded data layer described in Section 13, not against a live agent backend that doesn't exist yet.

---

## 20. Suggested phased execution order

1. **Research** — read all four flow files (`f4-dashboard.jsx`, `f5-campaigns.jsx`, `f6-conversations.jsx`, `f7-settings.jsx`) and the shared `f4-shell.jsx` in full, read all three prior prompts, and check current shadcn Charts, tour-library, and Ably (or chosen equivalent) documentation before wiring anything.
2. **Shell fixes** (Sections 3–4) — mobile sidebar, theme unification, max-width, routing conversion, command-palette scaffold. Verify Flows 1–3 still render correctly before moving on, since the shell and theme changes are shared infrastructure.
3. **Data layer** (Section 13) — schema, seed data, repository functions, Server Actions — before building any page against it.
4. **Component consolidation** (Sections 11, 14) — build the shared `StatusBadge`, `WhyPopover`, `EnvelopeBar`, `Avatar` once, before the four flow areas need them.
5. **Command palette** (Section 10).
6. **The four flow areas in turn** — Dashboard Home (6), Campaigns (7), Conversations (8), Settings (9) — each wired to the real data layer and shared components from steps 3–4.
7. **The three newly-designed screens** (Section 5) — Orders, Safety Center, Reports.
8. **The product tour** (Section 12) — built last, since it references UI elements (KPI grid, command palette, etc.) that need to be finished and stable first.
9. **Animation pass** (Section 15).
10. **Accessibility/responsive/regression QA** (Sections 16, 18).
