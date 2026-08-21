# SolAI Web — Landing (Screen 1)

Public marketing site for SolAI, built with Next.js 16 App Router, Tailwind CSS v4, next-intl, GSAP (scroll), and Framer Motion (UI).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Token system

Design tokens live in `src/styles/globals.css` inside `@theme inline`. Colours, radii, shadows, fonts, motion durations, and typography utilities (`text-display`, `section-y`, etc.) are defined once there. Components must use token-backed Tailwind classes (`bg-deep`, `text-ink-70`, `rounded-card`) — not raw hex or arbitrary pixel typography.

To add a token: extend `@theme inline`, use a semantic name, and document the meaning (especially `sea` / `berry` — escrow semantics only).

## Architecture

- **Routes** (`src/app/[locale]/`) — thin; compose the landing template only.
- **Organisms** — one per page section; props from data + `getTranslations`.
- **Molecules / atoms / art** — reusable UI; no page copy hard-coded.
- **Data** (`src/data/`) — structure, ids, money in minor units, icon names, message keys.
- **i18n** (`src/i18n/messages/`) — all user-visible strings; English complete.

**Import direction:** routes → organisms → molecules/atoms/art → ui/lib/types. Nothing imports upward.

**Container queries:** `MoneyFlow`, `StartInput`, `StepCard`, `StatBlock`, `QuoteCard` use `@container` for narrow embeds. Page layout uses viewport breakpoints (`700px`, `1000px`).

## Motion

- **CSS** — hero entrance (`hero-enter` utilities), reduced-motion safe.
- **GSAP + ScrollTrigger** — `ScrollReveal`, proof stat count-ups (via `StatBlock`), loaded dynamically in client boundaries.
- **Framer Motion** — protection stepper, phone mock crossfade, category chip, mobile sheet.

`GsapProvider` registers ScrollTrigger cleanup on unmount.

## Fonts

Six self-hosted woff2 files in `public/fonts/`, loaded via `next/font/local` in `src/app/[locale]/layout.tsx`. Bricolage 800 and Figtree 400 are preloaded.

## Screen 2 — Build (`/build/[draftId]`)

Seller draft-building flow: seven states (`capture`, `uploading`, `generating`, `draft`, `unclear`, `blocked`, `error`), client-side image pipeline (EXIF, optional HEIC, Web Worker downscale), mock generation service with streamed stages, IndexedDB + API autosave, and Framer Motion on this route only (no GSAP).

- **State:** typed reducer in `src/lib/build-reducer.ts`; `?screen=` query tracks the active state for back/forward.
- **Images:** `src/lib/image/` + `src/workers/image-processor.ts`; uploads use presigned URLs via `src/app/api/draft/[draftId]/upload-url/route.ts` (mock URLs in dev).
- **Generation contract:** `src/lib/generation/` — swap `mock.ts` for a real adapter without touching UI.
- **Entry:** landing `StartInput` and `/start?q=` call `createDraftFromQuery` → `/build/[draftId]`.

## Screen 3 — Payout (`/build/[draftId]/payout`)

Phone number, payout destination, shop name, and consent — then OTP verification, optional holder name check, and transactional account creation with draft migration.

- **State:** nine screens in `src/lib/payout-reducer.ts` (`form`, `confirm`, `verify`, `working`, `done`, `locked`, `inuse`, `unsupported`, `error`); `?screen=` reflects the active step.
- **Country / network data:** `src/data/countries.ts` — Rwanda (default), Uganda, Kenya, Tanzania; prefix lists are data, not component conditionals. Validation uses `libphonenumber-js/min`.
- **Form schema:** discriminated union on destination type in `src/lib/schemas/payout.ts` (`wallet-same`, `wallet-other`, `airtel`, `bank`).
- **Payout rails:** typed service in `src/lib/payout/` with mock adapter (`sendOtp`, `verifyOtp`, `nameEnquiry`, `createAccount`). Swap one adapter per real rail at launch.
- **Banks:** illustrative list in `src/lib/payout/banks.ts` — production must load from the payment provider API (cached), never hard-coded in UI.
- **Rate limits:** `src/lib/rate-limit.ts` + `src/app/actions/payout.ts` (per phone and per IP on OTP send/verify).
- **Name enquiry fallback:** when a rail cannot query holder name, re-enter-number confirmation must be used (document per market before go-live).
- **Entry from build:** draft editor **Continue** → `/build/[draftId]/payout`; success → `/build/[draftId]/live`.

## Screen 4 — Live (`/build/[draftId]/live`)

Payoff screen after payout: publishing runs as a transactional five-stage job, then the seller lands on a restrained celebration with shop link, status list (last row deliberately incomplete), money flow, client-side QR, printable poster, and a CTA into share.

- **States:** `publishing` | `live` | `error` only — `src/lib/live-reducer.ts` + `useLiveState` (polls every 400ms, reconnects on `visibilitychange`).
- **Publish service:** `src/lib/publish/` — stage labels are server-sent; swap `mock.ts` for a real adapter. Failures leave nothing half-published.
- **QR:** single encoder in `src/lib/qr.ts` (byte mode, EC level **M**, quiet zone of 4). SVG in the UI; PNG download at 1200×1200 via canvas (never SVG export for print shops). Ink on pure white only.
- **Clipboard:** `src/lib/clipboard.ts` — async Clipboard API in secure contexts, textarea/`execCommand` fallback otherwise; always toast via `CopyButton`.
- **Slug:** one free change; sanitise/validate client-side; reserved list stays server-side (`reserved-slugs.ts`). Old slug keeps resolving permanently.
- **Print:** `PrintablePoster` + `@media print` in `globals.css` hides app chrome; QR sized in mm (~78mm).

### Live screen — confirmed MVP defaults (assumed — confirm before public launch)

- **Paper size** for copy-shop flyers: A4 (`@page { size: A4 }` in `globals.css`).
- **Reserved-word list** owner: Engineering seeds and maintains it (profanity EN/RW/SW/FR, routes,
  brand lookalikes — `reserved-slugs.ts`); Product reviews quarterly.
- **Old slugs**: redirect forever, never expire (`_resolve_shop` in `app/services/buyer.py`).

## Screen 5 — Share (`/build/[draftId]/share`)

Last setup step: WhatsApp-first sharing, caption composer (EN/RW × three tones), channel grid, first-five checklist (server-persisted), on-device story/pack images, Instagram hand-off sheet (no fake post button).

- **States:** `share` | `done` | `error` — `src/lib/share-reducer.ts` + `useShareState`.
- **Share intents:** all platform URLs in `src/lib/share/links.ts` as functions of `(url, text)` — never inlined in components.
- **Captions:** `src/lib/share/caption-data.ts` — data, not i18n keys; shop link always embedded; editing updates every channel.
- **Canvas assets:** `src/lib/share/story-renderer.ts` — 1080×1920 status + four 1080×1080 pack images; waits for `document.fonts.ready` (with timeout); QR drawn from the module matrix (no SVG→Image round-trip).
- **Reuses from screen 4:** `QrCode`, `CopyButton`, toast system — no second clipboard or QR implementation.

### Share screen — outstanding product decisions

- **Kinyarwanda captions**: confirmed default — native-speaker QA pass gates any production AI
  live-flip (`AI_PROVIDER_MODE=live`), not staging; not yet scheduled.
- Whether the first-five checklist drives a **day-two notification**.
- Android versions where **`navigator.share({ files })`** was verified for WhatsApp hand-off.

### Payout screen — confirmed MVP defaults (assumed — confirm before public launch)

- **Account recovery** without email: add a secondary phone number after the first sale.
- **Shop slug collisions**: numeric suffix (`amara` → `amara-2`), never an extra seller-facing
  prompt — implemented in `PayoutService._unique_slug`.
- **Name-enquiry / payout coverage**: MTN + Airtel, Rwanda, at launch; bank and M-Pesa deferred.
  `app/payments/providers/pawapay.py`'s correspondent table and `src/data/countries.ts` already
  cover UG/KE/TZ and M-Pesa — that's ahead-of-schedule backend capability, gated by this decision
  rather than removed.
- **Live bank list**: Flutterwave `/v3/banks`, cached 24h (`src/lib/payout/banks.ts`).
- **Production OTP rate limits**: 3 sends/number/hour, 5 verify attempts, 15-minute lockout
  (`app/otp/service.py`, `app/schemas/payout.py`, mirrored in `src/lib/rate-limit.ts`).

### Build screen — confirmed MVP defaults (assumed — confirm before public launch)

- **Generation allowance**: 5/seller/day (`generation_allowance_per_day` in `Settings`).
- **Anonymous draft retention**: 30 days (`draft_cookie_max_age_seconds`), cleaned up nightly by
  an Arq cron job (`app/workers/cleanup.py::purge_expired_drafts`, registered in
  `app/workers/settings.py`) that deletes the draft row and its S3/R2 uploads together.
- **Description-only drafts**: may reach the draft/live/share screens, but orders are blocked
  until a real seller photo replaces the placeholder — enforced server-side in
  `BuyerService._is_purchasable` via `BuyerProduct.hasOriginalPhoto`, not just a client-side rule.

## Outstanding items (landing)

- **Seller quotes** in `src/data/seller-stories.ts` are design-comp placeholders — replace with consented, attributable quotes before launch.
- **Kinyarwanda, Swahili, French** catalogues are stubbed with `[NEEDS TRANSLATION]` — require a native-speaker pass (headlines were partially exercised in the HTML reference only for EN plumbing).
- **Performance budget (Section 17 of brief):** not measured in CI yet; run Lighthouse on production build and record LCP/JS weight in your deploy checklist.
- **React Compiler:** left off; worth evaluating when more screens land.

## Screen 6–12 — Shop dashboard (`/dashboard`)

Seller control surface after share: Home, Orders, Products, Money, Grow, Settings. Route group: `src/app/[locale]/(dashboard)/`.

### Navigation model

One nav list in `src/data/dashboard-nav.ts`, two renderers:

| Viewport | Chrome |
|---|---|
| &lt;1000px | Bottom bar (5 items: Home, Orders, Products, Money, Grow). Settings via shop chip in the top area / sidebar chip on tablet. FAB “Add a product” → `/start`. |
| ≥1000px | Sidebar (6 items including Settings). No FAB — Products header button instead. |

`matchDashboardRoute` owns titles, back targets, and which section owns nested routes (order detail → Orders, plans → Money, boost → Grow).

### Derived totals (never store a second copy)

| Figure | Source |
|---|---|
| Held balance | Sum of `orderTotal` for `held` + `transit` + `problem` |
| Needs-you badge | Count of `held` + `problem` (not total orders) |
| Lifetime paid | Sum of payout amounts |
| Month sales | Sum of order item amounts |
| Product status | `resolveProductStatus(stock, onSale)` — stock 0 → OOS; off sale → draft |

Adapter: `getDashboardService()` in `src/lib/dashboard/` (mock store today). Swap the adapter without touching UI.

### Revalidation map (mutations)

| Action | Paths refreshed |
|---|---|
| `releaseOrderAction` | layout, home, orders (+ detail/deliver/paid), money |
| `reportOrderProblemAction` | layout, home, orders (+ detail), money |
| `saveProductAction` / `deleteProductAction` | layout, home, products (+ editor), grow |
| `switchPlanAction` | layout, home, money, plans, settings |
| `saveShopSettingsAction` | layout, home, settings, money, grow |
| `startBoostAction` | home, grow, boost, money |

Money release is **never optimistic** — wait for the server result, then navigate to the receipt.

### Motion & a11y

Framer Motion only (`DASHBOARD_MOTION`): view rise on pathname change, nav pill, count-up, meters/sparkline. Respects `prefers-reduced-motion`. Sheets trap focus (Radix). Destructive delete states blast radius in the accessible name. Bottom bar / FAB clear the content padding (`pb-[5.4rem]`).

### Share → dashboard handoff

`SharedDoneState` tiles point at `/dashboard/grow`, `/start`, `/dashboard/grow/boost`, and `/dashboard` (not the live build screen).

### Performance budgets (brief §12)

| Metric | Budget | Status |
|---|---|---|
| Dashboard shell JS (compressed) | &lt; 90 KB | Not measured in CI yet — record on production build |
| Home route total JS | &lt; 150 KB | Same |
| Section navigation first paint | &lt; 200 ms | Shell is shared; pages are RSC |
| INP on filters/toggles | &lt; 200 ms | URL filters + server actions; no chart library |

### Dashboard — confirmed MVP defaults (assumed — confirm before public launch), and what's still open

- **Manual withdrawal**: no — auto-release to the linked wallet only. No withdrawal endpoint
  exists anywhere in `solai_server`; this is the absence of a feature, not a disabled one.
- **Stock-at-zero** mid-order: auto-hide / OOS, no backorder (`resolveProductStatus` in
  `src/lib/dashboard/derive.ts`).
- Still outstanding: **order-history retention** and pagination policy beyond the current page
  size of 20; whether **"report a problem"** opens a dispute case or a support conversation (UI:
  support-first reason sheet; money stays held).

## Screen 13–15 — Buyer (`/{slug}`, checkout, `/order/{id}`)

Buyer purchase flow: storefront → checkout → protected live order. Route group: `src/app/[locale]/(buyer)/`. Closes the loop from seller share links (`solai.shop/{slug}`) to a working purchase path in this app.

### URLs

| Path | Screen | Notes |
|---|---|---|
| `/{slug}` | Shop catalogue | Demo: `/amara` (alias `/amara-beads` → Amara) |
| `/{slug}/p/{productId}` | Product / OOS / gone | Demo: `/amara/p/p1`, `/amara/p/p2` (OOS), `/amara/p/missing` (gone) |
| `/{slug}/checkout?c={sessionId}` | Checkout | Session from Buy now; soft stock reserve during MoMo (~119s) |
| `/order/{orderId}` | Protected order | Demo: `/order/1042` — code `5083`, confirm last-4 `2771` |

Copy / QR / captions still emit the absolute `https://solai.shop/{slug}` URL. Live / Share / dashboard “open shop” and “view as buyer” CTAs use same-origin paths (`inAppShopPath` / `inAppProductPath`) so sellers can preview the buyer flow in this app.

### Status map (buyer ↔ seller escrow)

| Buyer status | Seller dashboard roughly |
|---|---|
| `held` | Held (packing) |
| `transit` | Transit |
| `done` | Paid / released |
| `disputed` | Problem |
| `refunded` | Buyer-only terminal (cancel while held / support refund) |

Shared Amara seed: product `p1`, order `1042`, delivery code `5083`. Money is never released optimistically.

### Motion & a11y

Framer Motion only (`BUYER_MOTION`): view rise on mode/screen/status change. Sheets use Radix Dialog (focus trap). Primary controls use ≥44px targets (`min-h-11` / `size-11`). Respects `prefers-reduced-motion` (including courier track fill).

### i18n

Namespaces `storefront`, `checkout`, `protected` (+ buyer `moneyFlow` labels). English complete; fr / rw / sw stubbed with `[NEEDS TRANSLATION]` where needed.

### Buyer — confirmed MVP defaults (assumed — confirm before public launch), and what's still open

- **Soft-reserve duration**: keep `momo_timeout_seconds=119`; no cooldown on cancel — a released
  reservation is immediately re-checkoutable.
- **CoD refund rail**: support-arranged credit, no automatic MoMo/bank reversal — a COD order has
  no payment rail to auto-reverse in the first place (`BuyerRefund` in `src/types/buyer.ts`).
  Keep copy honest about this per market.
- **Seller dashboard / buyer mock stores**: moot now — both were replaced by the real generated
  HTTP client this round (Phase 5), so there's nothing left to merge.
- Still outstanding: **auto-release window** after delivery if the buyer never confirms
  (informational copy today, no timer enforced).

## Screen A — Admin console (`/console`)

Internal operations console: Overview, Disputes, People, Listings, Ledger, Rules. Route group: `src/app/[locale]/(console)/`. `noindex`. Separate session cookie `solai_console_session` — never shared with seller or buyer.

### Permission matrix (enforced server-side)

| Capability | Support | Finance | Admin | Enforced in |
|---|---|---|---|---|
| See held funds | ✓ | ✓ | ✓ | data reads |
| Resolve a dispute | ✓ | ✓ | ✓ | `resolveCaseAction` |
| Resolve above threshold | — | ✓ | ✓ | `resolveCaseAction` / `approveCaseAction` |
| Take a listing down | ✓ | — | ✓ | `takedownListingAction` |
| Suspend an account | — | — | ✓ | `suspendAccountAction` |
| Unmask a wallet or ID | — | ✓ | ✓ | `unmaskIdentityAction` |
| Change hold rules | — | — | ✓ | `updateMarketRulesAction` |
| **Move money anywhere** | **—** | **—** | **—** | **Absent — no endpoint accepts a payee** |

Source of truth: `src/lib/console/permissions.ts`. Disabled buttons are courtesy; every mutation re-checks the role.

Approval threshold is **per-market configuration** (`MarketRules.approvalThreshold`), not a constant. Rwanda seed: RWF 100,000.

### Mutation → revalidation map

| Action | Paths refreshed |
|---|---|
| `resolveCaseAction` / `approveCaseAction` | layout, overview, disputes (+ case), ledger |
| `unmaskIdentityAction` | person, ledger |
| `setGraduatedControlAction` / watch / suspend | layout, overview, people (+ person), ledger |
| `takedownListingAction` / keep / restore | layout, overview, listings, ledger |
| `retryDisbursementAction` / retry all / recon | layout, overview, ledger |
| `updateMarketRulesAction` | rules, ledger, disputes |

Counts (breach badge, open, frozen, KPIs) are **derived** — never stored twice. No optimistic UI on money-affecting actions. Resolve uses idempotency keys.

### Audit schema

Append-only `ConsoleAuditEntry`: `id`, `timeLabel`, `actorName`, `actorRole`, `action`, `detail`, `tone`, optional `target`. Writer is the only mutation path; no update/delete on the service interface or any endpoint.

### Takedown fan-out

One takedown sets: storefront hidden, WhatsApp catalogue withdrawn, ads paused (budget refunded), paid orders held/refundable — and notifies the seller with the rule + appeal.

### Console — outstanding

- Permanent-ban blocklist keys (verified phone, payout wallet, device fingerprint) must be checked at account creation — mock write exists on suspend; signup check is not wired.
- Who holds the escrow trust account in each market (licensing).
- Reconciliation non-zero difference → page-the-team alerting path (UI treats difference as the alarm today).

## Design notes (built as designed)

- Review-width switcher from the static HTML prototype is intentionally omitted in production Next.js (full viewport only).
- Escrow colours (`sea`, `berry`) appear only on money-state UI, per the design system contract.
