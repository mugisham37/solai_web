# Cursor Build Prompt — SolAI Flow 2: Authentication & Authorization

Paste this entire document into Cursor as your task prompt. It is self-contained: every value, path, and decision you need is inside it. Do not invent content, palettes, or routes that aren't specified here or present in the referenced source files. This flow is a **continuation** of Flow 1 (Marketing) — read Section 2 before touching any code, since most of the foundation already exists and must be reused, not rebuilt.

---

## 1. Mission

You are a senior Next.js engineer with real security experience — this flow handles account creation, credentials, sessions, and two-factor authentication for a product that moves other people's money (ad spend, order revenue). Treat correctness and security defaults as first-class requirements, not afterthoughts to a pretty UI. Work in the phased order given in Section 16: research first, then the one required structural refactor, then the backend foundation, then components, then screens, then QA. Do not skip the refactor in Section 3 — every screen you build afterward depends on it existing correctly.

---

## 2. Continuity with Flow 1 — reuse, don't rebuild

Flow 1 (Marketing) has already been integrated into this Next.js app and established the foundation every subsequent flow builds on. Read `/CURSOR_PROMPT_FLOW1_MARKETING.md` in the project root before starting — it documents in full detail what already exists. Do not re-derive or duplicate any of the following; use it as-is:

- **Design tokens** already live in `app/globals.css`'s `@theme inline` block — the full SolAI color/radius/spacing/motion system. Flow 2's reference CSS (`refrence/flow-2-auth.html`) uses the *exact same token values* for `--bg/--surface/--surface-2/--border/--text/--text-muted/--text-subtle/--brand/--brand-soft/--success/--warning/--danger/--info/--r-sm/--r-md/--r-lg/--r-xl/--r-pill/--ease` as Flow 1, just without `--accent-rwanda` (which isn't used on auth screens — leave it defined globally, simply don't reference it here). **Do not add any new design tokens for this flow.**
- **shadcn/ui primitives** already installed: `button`, `sheet`, `accordion`, `select`, `input`, `textarea`, `label`, `form`, `badge`, `avatar`, `separator`, plus whatever segmented-control solution Flow 1 settled on. Reuse `button`/`input`/`label`/`form` directly for auth forms. Add the new primitives this flow needs (Section 11) via the same `npx shadcn@latest add <component>` pattern, don't hand-roll something shadcn already provides.
- **`lucide-react`** is already the icon library. This flow's reference uses a hand-rolled `AuthIcon` helper (`refrence/f2-auth.jsx`) with icon names `mail, lock, eye, eyeOff, user, check, shield, smartphone, key, arrowRight, arrowLeft, copy, download, fingerprint, globe, zap, refreshCw` — delete that helper too and map to lucide-react's `Mail, Lock, Eye, EyeOff, User, Check, Shield, Smartphone, KeyRound, ArrowRight, ArrowLeft, Copy, Download, Fingerprint, Globe, Zap, RefreshCw`.
- **Atoms/molecules/organisms folder convention** from Flow 1 (`components/ui`, `components/atoms`, `components/molecules`, `components/organisms`) continues here — this flow adds to those folders, it doesn't introduce a parallel structure.
- **Next.js 16 environment constraints** documented in the Flow 1 prompt all still apply unchanged: Turbopack is default, no `middleware.ts` (use `proxy.ts` if ever needed), all dynamic APIs (`cookies()`, `headers()`, `params`, `searchParams`) must be awaited, Cache Components are off so don't use `'use cache'`/`updateTag()`, Tailwind v4 is CSS-first with no `tailwind.config.*` file, `next lint` doesn't exist (use `npm run lint`). Don't re-read the Next.js docs for these — they're already confirmed; do consult `node_modules/next/dist/docs/` for anything new this flow touches that Flow 1 didn't (e.g. Route Handlers for the Better-Auth catch-all, if unfamiliar with the current convention).
- **`next-themes`** is already wired in the root layout. This flow's reference has its own fixed-position corner theme toggle (`.auth-theme-toggle`, since auth pages have no nav bar to host one) — reuse the same `ThemeToggle` atom Flow 1 built (Sun/Moon icons, token-colored), just positioned fixed top-right on auth pages instead of inside a nav bar.

---

## 3. Required structural refactor — do this first, in isolation

Flow 1's `app/layout.tsx` currently wraps **every** route in `MarketingNav` and `MarketingFooter` unconditionally. This flow's screens must not have that chrome — the reference's own `AuthLayout` component has just a small logo (linking home) and a minimal two-link footer (`Privacy`, `Terms`, plus a copyright line), nothing else. Before writing any auth screen, restructure routing with Next.js **route groups**:

- Create `app/(marketing)/` and move the existing landing (`page.tsx`), `features/`, `pricing/`, `for-africa/`, and `contact/` routes into it. Add `app/(marketing)/layout.tsx` carrying the `MarketingNav` + `MarketingFooter` wrapper that currently lives in the root layout.
- Create `app/(auth)/` for every route this flow adds (Section 12). Add `app/(auth)/layout.tsx` with a minimal shell: just the fixed-position theme toggle and a `{children}` pass-through — no nav, no footer (each individual auth screen renders its own logo/footer via the shared `AuthLayout` organism from Section 11, matching the reference).
- Trim the root `app/layout.tsx` down to only what's truly global: `<html>`/`<body>`, font variables, and the `ThemeProvider` wrapper. It should no longer reference `MarketingNav`/`MarketingFooter` directly — those move to the `(marketing)` group's own layout.
- Route groups (parentheses folders) do not appear in the URL. This means `/signup` and `/login` — the stub "coming soon" pages Flow 1 created — simply move to `app/(auth)/signup/page.tsx` and `app/(auth)/login/page.tsx` at the exact same public URLs, and this flow **replaces** their stub content with the real `SignUpScreen`/`SignInScreen` builds. Do not leave the old stub pages in place alongside new ones, and do not create a second competing route for the same path.
- After the refactor, verify Flow 1's five marketing routes still render with their nav/footer intact before writing a single line of auth-specific code — this is a regression check on existing, already-shipped work, not optional busywork.

---

## 4. Source-of-truth reference files

- `refrence/flow-2-auth.html` — the outer shell: fonts, the full `.auth-*` CSS class set, and the `<App>`/`SCREENS`/`.auth-screen-picker` demo harness. **The harness is not to be ported** — same reasoning as Flow 1's `mk-screen-picker`: it exists only so the static prototype can fake screen-switching with React state instead of real routing. Once real routes exist (Section 12), it has no purpose.
- `refrence/f2-auth.jsx` — the real component logic and **final copy** for all 5 existing screens: `AuthLayout`, `AuthIcon`, `AuthDivider`, `SignUpScreen`, `SignInScreen`, `VerifyEmailScreen`, `ResetPasswordScreen`, `TwoFactorScreen`. Read it in full and copy every string verbatim (panel copy, button labels, helper text, the exact recovery-code sample values, the exact onboarding step copy in the sign-up panel) — do not paraphrase.

**Explicit scope boundary** — `refrence/f3-onboarding.jsx` and `refrence/flow-3-onboarding.html` (Flow 3) own all third-party account connections: Shopify, WooCommerce, Meta, Google Ads, WhatsApp Business, Stripe, MTN Mobile Money, Airtel Money, Flutterwave. Even though the Sign Up screen's own "what happens next" panel mentions "Connect your store" as step 2, that step is Flow 3's responsibility — do not build any OAuth or payment-rail connection UI in this pass. "Authorization" in this flow's title means account security and session authorization (2FA, recovery, consent, the session/role data model) — not third-party integration permissions.

---

## 5. Auth & security research findings to apply

These are current (2026) NIST SP 800-63B and OWASP Authentication Cheat Sheet positions — apply them as concrete implementation rules, not aspirational guidance:

- **Password length, not complexity.** Minimum 8 characters; support at least 64. Do **not** enforce composition rules (no forced "must contain a symbol/number/uppercase" gates) — these are obsolete guidance that pushes users toward predictable patterns. The reference's password-strength meter should reflect real entropy scoring (Section 9), not a composition checklist.
- **No forced periodic rotation.** Don't build a "change your password every 90 days" feature or prompt — current guidance explicitly advises against it. Only prompt a password change on evidence of compromise.
- **Block common/breached passwords** at sign-up and password-reset time. A real strength-scoring library (Section 9) covers common/dictionary passwords; if time allows, additionally check against the Have I Been Pwned breach-password range API (k-anonymity model — only a 5-character hash prefix is ever sent, the full password/hash never leaves the client) as the industry-standard enhancement. Treat this as a nice-to-have, not a blocker for this pass.
- **Never block paste into password fields.** This is a classic, well-documented anti-pattern (it actively discourages password-manager use, which is a net security loss) — explicitly verify no `onPaste` prevention exists anywhere in the password/code inputs you build.
- **Rate-limit failed attempts with progressive friction, not silent permanent lockout.** Sign-in, 2FA-challenge, and code-verification endpoints should escalate delay after repeated failures (e.g. short delays growing with each additional failure) and surface a clear "Account temporarily locked, try again in Xs" state (Section 6) once a threshold is hit, rather than either an unlimited-attempts open door or a permanent silent ban. Configure this through Better-Auth's built-in rate-limiting rather than hand-rolling counters.
- **Correct `autoComplete` attributes everywhere**, matching and extending what the reference already gets right: `autoComplete="name"` (full name), `autoComplete="email"`, `autoComplete="new-password"` (sign-up, reset), `autoComplete="current-password"` (sign-in). Add `autoComplete="one-time-code"` on every 6-digit code input (verify-email, TOTP challenge, TOTP setup, SMS OTP) — this is a real web-platform standard that lets mobile browsers auto-suggest/auto-fill SMS-delivered codes directly from the notification, and pairs naturally with shadcn's `input-otp` component (Section 11).

---

## 6. Missing screens & states to design

The reference covers the "happy path" of 5 screens well but is missing several flows and most error/loading states a production auth system needs. Design and build all of the following — they are not optional extras, they're the difference between a demo and a real product:

- **2FA challenge at sign-in** (`/two-factor`) — **the single biggest gap in the reference.** `SignInScreen` currently goes straight through on valid credentials with no gate for accounts that have 2FA enabled. Build a new screen: 6-digit TOTP code entry (reuse the code-grid pattern, now via shadcn `input-otp`), an alternate "Text me a code instead" path if the account also has SMS enrolled, a "Use a recovery code instead" link (see next item), a resend/cooldown timer for the SMS variant (mirror the reference's `VerifyEmailScreen` resend-timer pattern), and clear error states for an incorrect code, an expired code, and too-many-attempts (ties into the rate-limiting rule in Section 5).
- **Recovery-code sign-in** — a lightweight variant of the 2FA challenge where the user enters one of their 8 backup codes instead of a live code. Must clearly warn the code will be permanently consumed on use, and afterward should prompt the user to regenerate a fresh set (link forward to wherever 2FA management eventually lives — for this pass, that's the `/2fa-setup` screen).
- **SMS OTP verification at 2FA-setup time** — the reference's `TwoFactorScreen` SMS method collects a phone number and goes straight to "Enable 2FA" with no confirmation that the number is real and reachable. Insert an "enter the code we texted you" sub-step (same code-grid pattern) between phone-number entry and the existing recovery-codes step, so SMS 2FA can't be enabled against a typo'd or unreachable number.
- **Magic-link sent (pending) screen** — both `SignUpScreen`'s and `SignInScreen`'s magic-link methods currently just have a "Send magic link" button with no follow-up state. Add a pending confirmation mirroring `ResetPasswordScreen`'s existing "sent" step: "Check your inbox" messaging, the destination email address, expiry note, and a resend-with-cooldown control.
- **Invalid or expired link landing screen** — shared by magic-link sign-in and password-reset links. A user clicking a link that's already been used, or has expired, must land on a clear explanation (not a broken form or a generic error page) with a direct path to request a new one.
- **Passkey flows, made real**: `SignUpScreen`'s passkey method has a "Create passkey" button with no success confirmation; `SignInScreen`'s social row has a bare "Passkey" button with no surrounding state at all. Design: an in-progress state while the (invisible, OS-level) WebAuthn prompt is active ("Waiting for your device…", with a cancel option), a clear success confirmation after passkey creation, and a graceful fallback message (with a nudge toward email/password or magic link instead) when `window.PublicKeyCredential`/WebAuthn isn't available in the current browser — feature-detect this, don't assume support.
- **Account temporarily locked** — the concrete UI surface for the rate-limiting rule in Section 5: a clear, non-alarming "Too many attempts — try again in Xs" state with a live or approximate countdown, shown inline on the sign-in/2FA-challenge form rather than as a dead end.
- **Inline error states**, one per realistic failure, on every relevant form: wrong email/password combination on sign-in (deliberately generic — "email or password is incorrect," never reveal which one is wrong, to avoid account enumeration), email already registered on sign-up, password rejected as too weak or breached, verification/TOTP/SMS code invalid or expired, "passwords don't match" on the reset-password confirm field, and a generic network/server-error fallback banner for anything unexpected.
- **Loading/pending states** for every submit action — sign up, sign in, verify email, send magic link, send SMS code, generate/verify TOTP, download recovery codes. These should be button-level (disabled + spinner/label change on the submit button itself), not full-page blocking overlays — the rest of the form should stay visibly stable while a request is in flight.

**Explicitly out of scope for this pass** (do not build these — call them out as deferred, don't silently skip them): full device/session management UI (list of active sessions, remote sign-out — that's a Settings-flow concern), new-device or impossible-travel step-up verification (worth a one-line note that Better-Auth can support this later, not needed now), and team/multi-user invitations.

---

## 7. Product decision: 2FA is encouraged, not mandatory

The reference's `VerifyEmailScreen` navigates unconditionally into `TwoFactorScreen` after every successful email verification — implying 2FA is mandatory for every new account before they can do anything else. That conflicts with the marketing site's own "Start free. No credit card required." positioning (`refrence/f2-auth.jsx`'s own `SignUpScreen` subtitle) — forcing a security setup step before a brand-new user has seen any value from the product is a real activation-funnel risk. Keep the reference's security-forward panel copy ("SolAI handles real money — security isn't optional") as strong encouragement, but make the 2FA-setup screen **skippable**: add a clear "Skip for now, set up later" path that proceeds to `/dashboard` (Section 12) without enabling 2FA, matching how GitHub, Stripe, and similar security-conscious products handle this (strongly encouraged, not blocking). Users who skip should be able to return to `/2fa-setup` any time while authenticated.

---

## 8. Verification-method nuance

Both the email/password and passkey sign-up methods require the separate `/verify-email` code-entry step, since neither one proves email ownership on its own. The magic-link sign-up method is different: clicking the emailed link **is** the verification (and the sign-in) in one action — it must not be followed by a redundant "enter your code" screen. Build the post-signup routing logic to branch correctly on which method was used, rather than always routing to `/verify-email`.

---

## 9. Auth stack & data model

Per the decision to build this flow against a real, working backend rather than simulated UI:

- Install **`better-auth`** as the auth library. Configure its plugins for: email/password, passkey (WebAuthn — Better-Auth's passkey plugin is built on SimpleWebAuthn under the hood), magic link, and two-factor (TOTP plus an SMS/OTP delivery method — Better-Auth's two-factor plugin lets you supply your own SMS-sending function, which is where `lib/sms.ts` below plugs in). **Read Better-Auth's current official documentation for the exact client and server API method names and plugin configuration shape before wiring anything** — don't guess signatures from memory; treat this with the same "read the docs first" discipline this project already applies to Next.js 16.
- Set up a local development database via **Drizzle ORM** (`drizzle-orm` + `drizzle-kit`) against a **SQLite** file (e.g. via `better-sqlite3` or `@libsql/client`) — this needs no external infrastructure and lets the entire flow work end-to-end in `npm run dev` today. Better-Auth has an official Drizzle adapter; use it rather than hand-writing queries against the auth tables.
- Design the user/session schema with a **`role`** field from the start (a single `owner` value is fine for now, since this flow is single-seller-per-account) so that future role-based access control and team-member support — which belongs to a later Settings flow — is additive to the schema, not a migration/rewrite.
- Install **`@zxcvbn-ts/core`** for real password-strength scoring (the modern, tree-shakeable successor to the original `zxcvbn`) and wire it into the existing `.auth-pw-strength` bar UI so the strength label and fill width reflect actual entropy/dictionary analysis, not a hardcoded "Moderate" placeholder like the reference currently shows.
- Reuse Flow 1's validation pattern: **`zod`** schemas for every form, paired with **`react-hook-form`** + `@hookform/resolvers/zod` for client-side UX, mirroring how the marketing contact form was built.
- Use the standard Better-Auth + Next.js App Router integration: a catch-all Route Handler (conventionally `app/api/auth/[...all]/route.ts`) that delegates to Better-Auth's handler, and a client-side auth instance created via Better-Auth's React client for use in client components (forms, the sign-in/sign-up buttons, session hooks).
- Create `lib/email.ts` and `lib/sms.ts` sender modules. In this pass, both should **console-log** the outgoing message content (verification codes, magic-link URLs, password-reset links, SMS OTP codes) rather than actually deliver anything — clearly mark the swap-in point for a real provider later (Resend is the natural fit for transactional email in a Next.js app; for SMS, note Twilio as the universally-documented default and Africa's Talking as a region-specific alternative worth evaluating given the product's African market focus — don't wire either provider now, just leave the interface ready).

---

## 10. Route protection / authorization pattern

The `/2fa-setup` screen (and its recovery-codes sub-step) is the one route in this pass that requires an authenticated session — you cannot set up 2FA for an account you're not logged into. Check the session server-side (Better-Auth exposes a server-side session read for exactly this) at the top of that route, and redirect unauthenticated visitors to `/login`. Its final "done" state's "Go to dashboard" button should link to a new, minimal `/dashboard` stub page — same "coming soon" placeholder treatment Flow 1 used for `/signup`/`/login` before this pass replaced them with real screens — since the actual dashboard is a later flow. Document this session-check pattern clearly in code (a short comment at the check site is enough) so future protected routes (the real dashboard, settings) can copy the same approach without re-deriving it. Note for later: if route-group-wide protection is ever needed (e.g. gating an entire `(dashboard)` group), Next.js 16 does this via `proxy.ts` (not `middleware.ts`), Node-runtime only — not required for this pass since nothing else needs protecting yet.

---

## 11. Component architecture

Extend Flow 1's `components/ui` / `atoms` / `molecules` / `organisms` folders — don't start a parallel structure.

- **`AuthLayout`** (organism) — the shared 60/40 split shell used by every screen in this flow: form column on the left with the logo, form content, and the minimal footer (Privacy/Terms links + copyright); a `--surface`-background panel on the right for contextual content (onboarding steps, a testimonial + stats, a verify-email illustration, a reset-password illustration, a 2FA trust-badge panel — one per screen, passed in as a prop, matching the reference's `panel` prop pattern). Collapses to a single column with the panel hidden below **900px** — note this is not one of Tailwind's default breakpoints (640/768/1024/1280); use Tailwind v4's arbitrary breakpoint variant (e.g. a `max-[900px]:hidden` style variant) for this specific collapse rather than rounding to the nearest default breakpoint, to stay faithful to the reference.
- **Molecules**: `PasswordField` (input + visibility-toggle button + live strength meter, wrapping shadcn's `input`), `AuthMethodTabs` (the Email/Passkey/Magic-link segmented switcher on Sign Up), `ConsentCheckbox` and `ConsentRegion` (the required/optional consent rows and the Rwanda-DPL/GDPR data-processing notice block), `TwoFactorMethodOption` (the selectable authenticator-app/SMS cards on 2FA setup), and the auth side-panel's own building blocks: `PanelStep`, `PanelStat`, `PanelQuote`, `TrustBadgeRow`.
- **Organisms**: one per screen/flow — `SignUpForm`, `SignInForm`, `VerifyEmailForm`, `ResetPasswordFlow` (owns its own request/sent/newpw internal step state, matching the reference), `TwoFactorSetupFlow` (owns its choose/verify-phone/codes/done internal step state), `TwoFactorChallengeForm` (the new sign-in-time gate from Section 6), `RecoveryCodeForm`.
- Install shadcn's **`input-otp`** component (wraps the `input-otp` package) and use it for every 6-digit code field in this flow — verify-email, the new 2FA sign-in challenge, TOTP setup entry, and SMS OTP verification — instead of hand-rolling the reference's manual `refs.current[i]` array approach. It correctly handles paste-to-fill-all-digits, arrow-key/backspace navigation between digits, and pairs directly with the `autoComplete="one-time-code"` attribute from Section 5.

---

## 12. Route list

All under the new `app/(auth)/` route group (Section 3):

- **`/signup`** — replaces Flow 1's stub. Renders `SignUpScreen`'s three methods (email/passkey/magic-link) via `AuthMethodTabs`.
- **`/login`** — replaces Flow 1's stub. Renders `SignInScreen`.
- **`/verify-email`** — the pending email address must be carried forward from sign-up via short-lived server-side state or a signed query parameter, never hardcoded like the reference's static `kalisa@inema.rw` placeholder. Only reachable after an email/password or passkey sign-up (Section 8).
- **`/forgot-password`** — the reset-password flow's "request" step (enter email, send link).
- **`/reset-password?token=...`** — the "set new password" step. Validate the token server-side before rendering the form; an invalid or already-used token shows the invalid/expired-link screen from Section 6 instead of a broken form.
- **`/two-factor`** — the new sign-in-time 2FA challenge (Section 6), reached only when sign-in credentials are valid but the account has 2FA enabled. Include the recovery-code path as either a sub-route or an in-place toggle on this screen — your call, whichever reads more cleanly.
- **`/2fa-setup`** — the setup flow from the reference, session-protected per Section 10, reachable post-signup (with a skip option per Section 7) and later re-enterable any time while authenticated.
- **`/dashboard`** — new, minimal "coming soon" stub (same treatment as Flow 1's original `/signup`/`/login` stubs) — the landing point after 2FA setup completes or is skipped, since the real dashboard is a future flow.

---

## 13. Accessibility & responsiveness bar

Hold this to the same standard Flow 1 was held to, plus items specific to auth UI:

- Focus rings visible on every interactive element, including each digit of the OTP inputs.
- Every form field has a label, helper text where relevant, and a distinct, specific error state.
- Status is never color-alone — the password-strength meter's color must be paired with its text label (already modeled in the reference — keep it), lockout/error states pair color with icon and text.
- Reduced-motion respected on all transitions (strength-bar fill, panel-side content, any code-input focus animation).
- Dark/light parity verified on every one of the 8 routes in Section 12, not just the ones ported directly from the reference.
- Tabular numerals on the recovery codes and any numeric stat in the side panel (font-feature-settings already established as a project convention in Flow 1).
- OTP inputs must be fully keyboard- and screen-reader-operable — keep the reference's per-digit `aria-label={"Digit " + (i+1)}` pattern (or shadcn `input-otp`'s built-in equivalent).
- The 60/40 panel layout must remain comfortably readable and centered in its column at every width once the side panel is hidden below 900px — don't just delete the panel and leave the form column oddly narrow or off-center.
- Password fields must never intercept or block paste, anywhere in this flow.

---

## 14. Verification / definition of done

- `npm run dev` and manually walk the **entire real flow**, not just render each screen in isolation: create an account by email/password, receive and enter the (console-logged) verification code, land on `/2fa-setup`, either skip it or enable an authenticator app and confirm the QR/manual-secret pairing works with a real authenticator app, save recovery codes, sign out, sign back in, confirm the `/two-factor` challenge actually gates entry and accepts a valid TOTP code, then separately test the "forgot password" path end to end using the console-logged reset link.
- `npm run lint` and `npm run build` both pass cleanly.
- Every route in Section 12 checked in both themes at 375px / 768px / 1280px+.
- Explicit regression check: Flow 1's five marketing routes (`/`, `/features`, `/pricing`, `/for-africa`, `/contact`) still render correctly with their nav and footer after the Section 3 route-group refactor.
- Every missing-screen/state from Section 6 is present and reachable, not just designed on paper.

---

## 15. Explicit non-goals for this pass

- No OAuth or payment-rail connections (Shopify, WooCommerce, Meta, Google, WhatsApp, Stripe, MoMo, Airtel, Flutterwave) — that's Flow 3.
- No dashboard build-out beyond the single `/dashboard` placeholder stub.
- No device/session-management UI, no team/multi-user invitations.
- No production email or SMS provider credentials — `lib/email.ts`/`lib/sms.ts` stay console-log stubs this pass.
- No new-device/impossible-travel step-up verification.

---

## 16. Suggested phased execution order

1. **Research** — read `refrence/f2-auth.jsx` and `refrence/flow-2-auth.html` fully, read `/CURSOR_PROMPT_FLOW1_MARKETING.md` for the foundation already in place, and read Better-Auth's current documentation for its Next.js integration and each plugin (email/password, passkey, magic link, two-factor) before writing config.
2. **Route-group refactor** (Section 3) — do this in isolation first, verify Flow 1's marketing pages still render correctly before moving on.
3. **Backend foundation** — Better-Auth install and plugin config, Drizzle + SQLite schema (with the `role` field), the catch-all route handler, `lib/email.ts`/`lib/sms.ts` stubs, `@zxcvbn-ts/core` wiring.
4. **Shared UI foundation** — `AuthLayout` organism, the molecules in Section 11, the `input-otp` shadcn install.
5. **Core screens with real wiring** — Sign Up (all three methods), Sign In, Verify Email, Reset Password, in that order, each actually calling Better-Auth rather than simulating.
6. **New/missing screens and states from Section 6** — 2FA sign-in challenge, recovery-code sign-in, SMS OTP verification sub-step, magic-link pending, invalid/expired link, passkey in-progress/success/fallback states, account-locked state, every inline error and loading state.
7. **Accessibility/responsive/regression QA pass** — Section 13 checklist plus the Section 14 definition of done, including the Flow 1 regression check.
