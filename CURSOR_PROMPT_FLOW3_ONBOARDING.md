# Cursor Build Prompt — SolAI Flow 3: Onboarding Wizard

Paste this entire document into Cursor as your task prompt. It is self-contained: every value, path, and decision you need is inside it. Do not invent content, palettes, or routes that aren't specified here or present in the referenced source files. This flow is a **continuation** of Flows 1 (Marketing) and 2 (Authentication) — read Section 2 before touching any code, and note Section 3 requires a small fix to already-generated Flow 2 code.

---

## 1. Mission

You are building the step where SolAI collects the real data a future campaign-generation backend will consume: which platforms the seller connected, how customers will pay, what's being sold, who it's for, and how much to spend. Treat data-shape correctness as seriously as visual polish — this flow's whole purpose is producing a clean, typed, backend-ready record, not just a pretty 5-step form. Work in the phased order given in Section 21.

---

## 2. Continuity with Flows 1 & 2 — reuse, don't rebuild

Read `/CURSOR_PROMPT_FLOW1_MARKETING.md` and `/CURSOR_PROMPT_FLOW2_AUTH.md` in the project root before starting. Reuse, do not re-derive:

- **Design tokens** in `app/globals.css` — this flow's reference CSS (`refrence/flow-3-onboarding.html`) uses the identical SolAI token values already ported (`--bg/--surface/--surface-2/--border/--text/--text-muted/--text-subtle/--brand/--brand-soft/--success/--warning/--danger/--info/--r-sm/--r-md/--r-lg/--r-xl/--r-pill/--ease`), again without `--accent-rwanda`. **No new tokens needed.**
- **shadcn/ui primitives** already installed (`button`, `input`, `label`, `textarea`, `select`, `badge`, `separator`, plus whatever Flow 2 added). This flow adds `switch` and `slider` (Section 13) via the same `npx shadcn@latest add` pattern.
- **`lucide-react`** as the icon library — delete the reference's hand-rolled `OIcon` helper (`refrence/f3-onboarding.jsx`) and map its names `check, arrowRight, arrowLeft, link, store, creditCard, target, rocket, shield, globe, users, sliders, zap, messageCircle, x, info, upload` to lucide-react's `Check, ArrowRight, ArrowLeft, Link2, Store, CreditCard, Target, Rocket, Shield, Globe, Users, SlidersHorizontal, Zap, MessageCircle, X, Info, Upload`.
- **Atoms/molecules/organisms folders** — this flow adds to `components/atoms`, `components/molecules`, `components/organisms`, it does not introduce a parallel structure.
- **Next.js 16 constraints** documented in the Flow 1 prompt (Turbopack default, `proxy.ts` not `middleware.ts`, async dynamic APIs, Cache Components off, Tailwind v4 CSS-first, no `next lint`) — unchanged, still apply.
- **The Drizzle + SQLite dev database Flow 2 set up for Better-Auth** — this flow adds its own table(s) to that *same* database (Section 7), it does not stand up a second database.
- **`next-themes`** — this flow's reference has its own fixed-position corner theme toggle (`.ob-theme-toggle`), same pattern as Flow 2's auth pages (no nav bar to host one here either). Reuse the existing `ThemeToggle` atom.

---

## 3. Required fix to already-generated Flow 2 code

`CURSOR_PROMPT_FLOW2_AUTH.md` (Section 10 of that prompt) sent users to a `/dashboard` stub immediately after 2FA setup completed or was skipped. Now that onboarding exists, that's the wrong destination — a brand-new user hasn't provided any of the data this flow collects yet. **Find and update that redirect** (in `TwoFactorSetupFlow`'s "done" state and its "skip" path) so it points to `/onboarding` instead of `/dashboard`. `/dashboard` remains a stub for now, but becomes the destination this flow's Review & Launch step leads to on completion (Section 17). Since `/dashboard` is still just a placeholder, make it onboarding-aware while you're there: check whether the current user has a completed onboarding draft (Section 7), and if not, show a simple "Finish setting up your account" link back to `/onboarding` instead of (or alongside) the generic "coming soon" message — a small, cheap addition that closes the loop between these two flows correctly.

---

## 4. Route-group placement & session protection

Onboarding needs its own minimal chrome — a header with logo, step indicator, and "Save & exit," a footer with Back/Continue — distinct from both the marketing nav/footer (Flow 1) and the auth 60/40 split (Flow 2). Create `app/(onboarding)/onboarding/` as its own route group with its own `layout.tsx` carrying that header/footer shell (Section 13's `OnboardingLayout` organism renders inside it). Onboarding is inherently something a signed-up user does — protect it with the same server-side session-check-and-redirect-to-`/login` pattern Flow 2 established for `/2fa-setup`.

---

## 5. Source-of-truth reference files

- `refrence/flow-3-onboarding.html` — the shell: fonts, the full `.ob-*` CSS class set, and the `<App>`/screen-array/`.ob-screen-picker` harness. **The harness is not to be ported** — same reasoning as the previous two flows' dev-only screen switchers: it exists only because the static prototype has no real router.
- `refrence/f3-onboarding.jsx` — the real component logic and copy for all 5 steps: `OnboardingStepper`, `OnboardingLayout`, `WelcomeStep`, `ConnectionsStep`, `PaymentsStep`, `ProductBudgetStep`, `ReviewLaunchStep`. Read it in full and copy every string verbatim (the welcome cards' copy, the trust-item lines, the info-banner text, the launch timeline's messages) — do not paraphrase.

---

## 6. The state-sharing bug — fix this, do not preserve it

**This is the single most important structural fix in this flow.** In the reference, every step component owns fully independent, local `React.useState` — nothing is shared between steps. The clearest symptom: `ReviewLaunchStep` never reads anything from the other four steps at all. Its entire summary — "Ankara Print Tee — Indigo," "Shopify — Inema Boutique," "US$ 500.00/day" — is hardcoded demo text that has no connection to whatever the user actually entered in Connections, Payments, or Product & Budget. Ship this and Review & Launch would show the same fake summary to every single user regardless of what they did in the previous four steps.

Fix this properly: build one shared onboarding wizard state — a server-persisted draft record scoped to the authenticated user (Section 7) — that every step reads from and writes to. Review & Launch must render the **actual** persisted data: the real connections the user made, the real payment rails they enabled, the real product name/price/description/budget they entered. There must be no hardcoded demo values anywhere in the final build of this flow.

---

## 7. Persistence & making "Save & exit" real

Add a table (e.g. `onboarding_drafts`) to the same Drizzle/SQLite database Flow 2 set up for Better-Auth — one row per user, storing the current step index plus every field collected across all five steps (connection states, enabled payment rails, product/audience/budget data, launch status). Build a small set of Server Actions — one per step, or one generic "save draft" action parameterized by step — that persist that step's data before navigating to the next one, and are also what the header's "Save & exit" button calls before routing to `/dashboard`. When a user returns to `/onboarding` later (new session, refreshed page, or via the `/dashboard` stub's "Finish setting up" link from Section 3), load their existing draft and resume at the correct step automatically rather than restarting at Welcome — this is what makes the reference's already-present "Save & exit" button actually mean something, instead of being a dead-end button that discards everything.

---

## 8. Mandatory vs. optional step gating

The user's instruction was: gate the steps that are genuinely required, leave alone the ones that aren't. Apply this reasoning, derived from what the product structurally needs to function, not from arbitrary preference:

- **Welcome** — no gating needed, it's pure information.
- **Connections** — **stays non-blocking.** The reference's own info banner ("You can connect more platforms later in Settings → Integrations") establishes this as intentional product design — keep the Continue button always enabled here, matching the reference. Optionally add a soft, non-blocking warning banner if the user has connected literally nothing by the time they hit Continue ("SolAI can't launch campaigns until you connect at least one platform — you can do this later"), but do not disable the button over it.
- **Payments — require at least one enabled rail before Continue is enabled.** Reasoning: without any payment rail connected, the Sales Agent (per the marketing site's own description) has no way to generate a payment link, so the core revenue loop — closing a sale in chat — is structurally broken. Show a clear inline reason next to the disabled Continue button explaining why.
- **Product & Budget — require product name, a valid positive price, and a minimum-length description before Continue.** SolAI cannot build a campaign with no product to advertise. Product URL and product images stay optional (nice-to-have, not blocking). Additionally — and this is a real validation gap in the reference, not a style choice — **enforce total budget cap ≥ daily spend cap.** The reference computes campaign duration as `Math.ceil(totalCap / dailyCap)` with zero validation that this produces a sane number; if a user sets, say, a $500/day cap with only a $100 total cap, the math silently implies the campaign can't even run for a full day. Block Continue with a clear inline error in that case.
- **Review & Launch** — the existing consent checkbox already correctly gates the "Launch campaign" button in the reference (`nextDisabled={!agreed}`) — keep this gate exactly as designed.

---

## 9. Smart defaults from Connections

The Welcome step's own copy promises "OAuth into Shopify or WooCommerce, then link Meta and Google Ads" as step 1, and separately promises the Product step will let users "import products" — but the reference's `ProductBudgetStep` never actually follows through on this; every field just has a static hardcoded `defaultValue`. Fix this gap: if Shopify or WooCommerce was connected in step 1, the Product step should offer a picker to import an existing product (pre-filling name, price, description, and images) as an alternative to typing everything from scratch. In demo mode (Section 10), simulate this with a small set of realistic imported-product options rather than leaving the promised feature unbuilt.

---

## 10. Payment-rail connection architecture

Current provider integration patterns are **not uniform** across the four rails in this reference — don't build one generic "Connect" button pattern and assume it fits all of them:

- **Stripe** — Stripe's current recommendation is the **Account Links** hosted-onboarding pattern (not classic OAuth): create a connected account server-side, request an onboarding link, redirect the user out to Stripe's hosted flow, handle the return via a callback route, and reflect the resulting account status (connected/pending/restricted) back in the UI.
- **MTN Mobile Money, Airtel Money, and Flutterwave** — these are fundamentally different: MoMo authenticates the *platform* to MTN's API via server-side OAuth2 plus a Subscription Key the seller obtains from MTN's own developer portal; Airtel Money uses a separate PIN-based flow; Flutterwave is itself a payment aggregator with its own API keys. None of these present the seller with a "click to redirect to a consent screen" experience the way Stripe/Shopify do. Build these three as a **credential-entry connector**: a small, clearly-scoped form where the seller pastes the Merchant ID / API key / Subscription Key they already obtained from that provider's own dashboard, which your backend validates with a lightweight test call before marking the rail connected, and stores encrypted (never render a stored credential back in full on the client).
- The Connections step's five integrations (Shopify, WooCommerce, Meta, Google Ads, WhatsApp Business) **are** genuine OAuth-style redirect/callback integrations — build those as the redirect-and-callback pattern.
- **Run everything in demo mode by default.** You cannot obtain live developer-app approval from Meta, Google, Shopify, MTN, or Stripe inside this session — that requires the product owner's own manual work in each platform's developer console. Design every connector (OAuth-style and credential-entry alike) behind a small adapter interface (`connect()`, `disconnect()`, `getStatus()`) with a demo/mock implementation active whenever the relevant provider credentials aren't present in environment variables — clearly labeled as demo mode in the UI, simulating realistic connected/error outcomes — and a real implementation stubbed and ready for a one-config swap once real credentials exist. This is a technical necessity, not a shortcut: build the integration points correctly-shaped now, wire real credentials later.

---

## 11. Missing states to design

The reference models almost no state beyond a flipped boolean (`connected`/`idle` toggled instantly, `rails[key]` toggled instantly). Design and build the following for a genuinely production-shaped flow:

- **Connecting/pending state** on every connect action — "Redirecting to Shopify…" / "Waiting for authorization…" while the OAuth redirect-and-callback round-trip is in flight (or while a credential-entry form's test call is running), distinct from both idle and connected.
- **Explicit error states**, each with a clear message and a retry action: the user declined/cancelled the provider's consent screen, the provider was unreachable (network/outage), an invalid or expired OAuth state token (CSRF protection failure — implement and check a real state parameter, don't skip this), and — for the credential-entry rails — the pasted credential failing validation.
- **Disconnect confirmation** — disconnecting a platform should ask for confirmation rather than instantly toggling off, since it affects live campaign capability once this flow feeds a real dashboard.
- **Real field-level validation** on the Product & Budget form: required-field errors, invalid price format, invalid URL format on the product-URL field, and file type/size limits on image upload (Section 13 recommends a real upload library for this rather than the reference's static placeholder box).
- **A working "add" interaction on the tag inputs.** The reference's regions/languages tag inputs only support *removing* the pre-seeded tags (`ob-tag-x` buttons) — there is no way to add a new one at all. Build a real add-on-Enter (or add-on-select) interaction so users can actually customize their target regions and languages, not just delete from a fixed starter set.
- **A numeric input paired with each budget slider**, so users can type an exact daily/total cap instead of only dragging an imprecise range control — pair it with shadcn's `Slider` (Section 13).
- **Working "Edit" buttons on Review & Launch.** In the reference, every `ob-edit-btn` (`<button className="ob-edit-btn">Edit</button>`) has no `onClick` at all — it does nothing. Wire these to route back to the corresponding step (Section 17's routes) with the persisted draft state intact, so editing doesn't mean starting over.
- **A launch-failure state with retry.** The reference only models the success timeline (`ob-launch-timeline`) — design what happens if the (simulated, per Section 20) campaign-creation call fails: a clear error message and a way to retry without losing the review data.

---

## 12. Stepper interaction

`OnboardingStepper` in the reference is purely decorative — its `ob-step` elements have no click handling at all. Make it functional: clicking a **completed** step's circle navigates back to that step (for review/editing, consistent with the "Edit" buttons in Section 11); clicking the **active** step is a no-op; **future/pending** steps stay unclickable (don't let users skip ahead past steps with unresolved mandatory gates from Section 8).

---

## 13. Component architecture

Extend the atoms/molecules/organisms folders from Flows 1–2.

- **New molecules**: `ConnectionCard` (the per-provider row in Connections, covering idle/connecting/connected/error visual states), `PaymentRailCard` (the switch-driven card in Payments, rendering either the Stripe redirect-connect button or the MoMo/Airtel/Flutterwave credential-entry form depending on the rail, per Section 10), `BudgetSliderField` (shadcn's `Slider` paired with a numeric input and the live formatted value, matching `.ob-budget-card`), `TagInput` (Badge-based chips with a real add-on-Enter interaction, matching `.ob-tag-input` — build this in-house as a small owned component rather than pulling in a third-party tag-input package, consistent with how narrowly-scoped this component is).
- **New organisms**: `OnboardingLayout` (header: logo, `OnboardingStepper`, "Save & exit"; footer: Back/Continue, matching the reference's `OnboardingLayout`/`ob-header`/`ob-footer`), and one organism per step: `WelcomeStep`, `ConnectionsStep`, `PaymentsStep`, `ProductBudgetStep`, `ReviewLaunchStep`.
- Install shadcn's **`switch`** (replacing the reference's hand-rolled `.ob-switch`, used for both the payment-rail toggles and anywhere else a binary on/off control appears) and **`slider`** (replacing the reference's raw `<input type="range" class="ob-range">`, used for the daily/total budget caps) via `npx shadcn@latest add switch slider`.
- Install **`react-dropzone`** for the product-image upload zone — a real high-level dependency replacing the reference's static, non-functional `.ob-upload-zone` placeholder box, giving genuine drag-and-drop, client-side file-type/size validation, and preview thumbnails matching the reference's "3–5 images, 1080×1080px minimum" guidance.

---

## 14. Shared currency formatter

Flow 1's pricing page and this flow's budget step both implement essentially the same zero-decimal-currency formatting logic independently in the reference (`rates` map, a `fmt()` function handling `RWF`/`KES`/`NGN` as zero-decimal currencies vs. two-decimal formatting for everything else). Extract this once into a shared `lib/currency.ts` utility with a typed currency-rate map and formatter function, and have both Flow 1's pricing page and this flow's budget step call it — a concrete, low-risk application of the reusable-over-duplicated principle this whole project is being built around.

---

## 15. Animation

Use **Framer Motion** for: the transition between wizard steps when navigating Back/Continue (a slide or fade, not a hard cut), a connection card's success state (a check-mark pop-in when a connection completes), the switch/toggle controls' motion, and the launch-success timeline's rows revealing in sequence rather than all at once. **GSAP is likely unnecessary for this flow** — it's a linear, single-viewport wizard with no scroll-driven content to trigger off — don't force it in just for consistency with Flow 1's landing page; state this explicitly rather than defaulting to using both libraries everywhere.

---

## 16. Types & data model

Define (in `types/onboarding.ts` or colocated with the relevant Server Actions) the types this flow's data must conform to — designed as the literal shape a future campaign-generation backend would consume, per the explicit instruction that the frontend's data must match what the backend will require:

- `OnboardingDraft` — the full persisted record: current step, timestamps, and the four sub-shapes below.
- `ConnectionState` — per provider (`shopify`, `woo`, `meta`, `google`, `whatsapp`): status `idle | connecting | connected | error`, plus connected-account metadata (account name/ID) when connected, and an error reason when in the error state.
- `PaymentRailState` — per rail (`stripe`, `momo`, `airtel`, `flutterwave`): enabled boolean, status mirroring `ConnectionState`, and rail-specific metadata (Stripe account ID; MoMo/Airtel/Flutterwave merchant ID — never the raw credential itself).
- `ProductDraft` — name, description, price (with currency), product URL, image references.
- `AudienceTargeting` — free-text ideal-customer description, plus the (now-editable, per Section 11) regions and languages tag lists.
- `BudgetCaps` — daily cap, total cap, currency, and the validated relationship between them (Section 8).
- `LaunchResult` — status (`idle | launching | success | failed`), timestamp, and an error reason when failed (Section 11).

---

## 17. Route list

All under `app/(onboarding)/onboarding/` (Section 4), each a real page rather than the reference's single-page step array so browser back/forward and direct deep-links (from Review's "Edit" buttons, Section 11) work correctly:

- **`/onboarding`** — Welcome step.
- **`/onboarding/connections`**
- **`/onboarding/payments`**
- **`/onboarding/product-budget`**
- **`/onboarding/review`** — Review & Launch; its success state's "Go to dashboard" links to `/dashboard`.

Plus Route Handlers for the OAuth-style callbacks from Section 10, e.g. `app/api/onboarding/oauth/[provider]/callback/route.ts`, which complete the token exchange (or its demo-mode equivalent), persist the resulting `ConnectionState`, and redirect back to `/onboarding/connections` with a query param the client reads to show a success/error toast.

---

## 18. Accessibility & responsiveness bar

Same discipline as Flows 1–2 — focus rings on every interactive element, label/helper/error on every form field, status never conveyed by color alone, reduced motion respected, dark/light parity verified on every step, tabular numerals on every price/budget figure — plus, specific to this flow:

- Slider/range controls must be fully keyboard-operable, with the paired numeric input (Section 11) serving as the fully-accessible alternative input method for exact values.
- Preserve the reference's existing mobile treatment of the stepper (step labels hidden below 768px) — verify the circles and connecting lines stay legible and correctly spaced at 375px.
- The two-column grids (`.ob-welcome-cards`, `.ob-rails-grid`, `.ob-field-row`) collapse to one column at the reference's existing breakpoints (640px for welcome cards and rails, 640px for field rows) — preserve these exact collapse points via Tailwind's `sm` breakpoint.

---

## 19. Verification / definition of done

- `npm run dev`, sign in as a real authenticated user (via Flow 2), and walk the entire wizard for real: connect at least one provider in demo mode and confirm the connected state persists across a page refresh; enable a payment rail (try both a Stripe-style redirect rail and a credential-entry rail); on Product & Budget, deliberately enter an invalid price and confirm Continue stays blocked with a clear error, then correct it; deliberately set total cap below daily cap and confirm the validation error appears; reach Review & Launch and confirm every displayed value is the data you actually entered, not placeholder text; launch and confirm the success timeline renders; separately test "Save & exit" partway through and confirm returning to `/onboarding` resumes at the correct step with prior data intact.
- Confirm the Section 3 fix: a freshly-verified user coming out of Flow 2 lands on `/onboarding`, not `/dashboard`.
- `npm run lint` and `npm run build` both pass cleanly.
- Every step checked in both themes at 375px / 768px / 1280px+.

---

## 20. Explicit non-goals for this pass

- No real third-party developer-app registration or live credentials for any provider — every connector runs in demo mode per Section 10.
- No dashboard build-out beyond the completion-aware stub described in Section 3.
- No actual campaign-generation backend logic — this flow's job ends at persisting a complete, correctly-typed draft and firing a (simulated) launch request; building what SolAI's agents actually do with that data is a later flow.

---

## 21. Suggested phased execution order

1. **Research** — read `refrence/f3-onboarding.jsx` and `refrence/flow-3-onboarding.html` fully, read both prior prompts for the existing foundation, and check current Stripe Account Links / MTN MoMo / Flutterwave integration docs before wiring any connector.
2. **Flow 2 fix + route group + session protection** (Sections 3–4) — small, isolated, verify Flow 2's sign-in/2FA-setup flow still works and now correctly lands on `/onboarding`.
3. **Persistence foundation** (Section 7) — the `onboarding_drafts` table and its Server Actions, before building any step UI against it.
4. **Shared layout & molecules** (Section 13) — `OnboardingLayout`, the functional `OnboardingStepper` (Section 12), and the new molecules.
5. **Steps in order**, each wired to the shared persisted draft state — Welcome, Connections, Payments, Product & Budget, Review & Launch — fixing the state-sharing bug (Section 6) as you go, not after the fact.
6. **Provider adapters** (Section 10) in demo mode for both Connections and Payments.
7. **Missing states** (Section 11) — connecting/error/disconnect states, real validation, working tag-add, working Edit buttons, launch-failure handling.
8. **Animation pass** (Section 15).
9. **Accessibility/responsive/regression QA** (Sections 18–19), including confirming Flows 1 and 2 still work correctly after this flow's changes.
