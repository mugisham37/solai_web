# Cursor Build Prompt — SolAI Flow 1: Marketing Site Integration

Paste this entire document into Cursor as your task prompt. It is self-contained: every value, path, and decision you need is inside it. Do not invent content, palettes, copy, or routes that aren't specified here or present in the referenced source files.

---

## 1. Mission

You are a senior Next.js/TypeScript frontend engineer. Your job is to integrate the "Flow 1 — Marketing" mockup (currently a static HTML+React-via-CDN prototype) into a real, production-grade Next.js application, and in doing so establish the **foundational design system and component architecture** that every future flow (auth, onboarding, dashboard, campaigns, conversations, settings) will build on top of. This is not a one-off page — it is the base layer of a long-lived codebase. Build it accordingly: reusable, typed, documented by its own structure, and correct rather than merely close.

Work in the phased order given in Section 15. Verify each phase before starting the next — later phases assume earlier ones are already correct (e.g. you cannot layer scroll animation onto a DOM structure that hasn't been finalized). If you have access to multiple agents or models, use a research/read-only pass before any file is written, a separate implementation pass, and a separate QA/verification pass at the end — don't collapse research and implementation into one shot.

Do not write any of this plan back out as a summary document. Build the actual application.

---

## 2. Non-negotiable Next.js 16 environment facts

This project runs **Next.js 16.2.10 / React 19.2.4 / TypeScript ^5 / Node ≥20.9**, installed via npm (`package-lock.json` is present — use `npm`, not `pnpm`/`yarn`/`bun`). The project's own `AGENTS.md` warns that this Next.js version has breaking changes from what most training data assumes. Before writing any code, read `node_modules/next/dist/docs/01-app/` (getting-started, guides, and api-reference subfolders) directly in this repo — don't rely on memory. The following are the specific gotchas already confirmed for this exact install; treat them as hard constraints:

- **Turbopack is the default bundler** for both `next dev` and `next build`. Do not add `--turbopack` flags (unnecessary) and do not write a custom Webpack-only `next.config.ts` — it will break the build unless `--webpack` is explicitly passed, which you should not do.
- **No `middleware.ts`.** If any future routing/auth guard is needed, the file is named `proxy.ts` with an exported function named `proxy`, and it runs on the **Node.js runtime only** (no Edge runtime support). Flow 1 does not need this at all — no proxy/middleware file should be created in this pass.
- **Every dynamic API is async, with no sync fallback.** `cookies()`, `headers()`, `draftMode()`, route `params`, and `searchParams` must always be `await`ed — this also applies inside `sitemap()`, `icon`/`apple-icon`, and `opengraph-image` generator functions if you add any. Flow 1's routes are all static (no dynamic segments), so this mostly won't come up, but do not write old-style synchronous `params` destructuring if you touch any route file.
- **Cache Components are OFF.** `next.config.ts` in this project does not set `cacheComponents: true`. Do **not** use the `'use cache'`, `'use cache: private'`, or `'use cache: remote'` directives, and do not call `updateTag()` or the two-argument form of `revalidateTag()` — none of that is active in this project's caching model. If you need to revalidate anything from the contact-form Server Action, use the plain single-argument `revalidatePath`/`revalidateTag` calls consistent with the default ("Previous Model") caching docs.
- **`next/image`**: prefer the `preload` prop over the deprecated `priority` prop if you use `next/image` anywhere (this flow is mostly SVG/CSS-drawn graphics, so you may not need `next/image` at all — don't force it in where an inline SVG or CSS shape is simpler and cheaper, which is what the reference actually does).
- **`next lint` does not exist.** This repo's `package.json` already defines `"lint": "eslint"` against the flat `eslint.config.mjs` — use `npm run lint`, never `next lint`.
- **Prefer generated route types** (`PageProps<'/route'>`, `LayoutProps<'/route'>`) over hand-written `Promise<{...}>` param types wherever you do need to type a page/layout — though again, Flow 1 has no dynamic route segments, so this mainly matters for `app/layout.tsx` and any future dynamic routes.
- **Tailwind v4, CSS-first, already correctly configured.** `app/globals.css` already contains `@import "tailwindcss";` and a `@theme inline { ... }` block; `postcss.config.mjs` already wires `@tailwindcss/postcss`. There is **no** `tailwind.config.ts`/`.js` in this project and you must not create one, and you must not add `@tailwind base/components/utilities` directives (that's the legacy v3 pattern this project deliberately isn't using). All theme customization happens by extending the `@theme inline` block in `app/globals.css`.

---

## 3. Source-of-truth reference files

Everything you need to replicate is in `refrence/` (note: that's the actual folder name in this repo, misspelled but real — do not rename it). Read these files **in full** before writing any component:

- `refrence/00-design-system.html` — the design system shell/navigation (context only, not to be rebuilt as-is; it's a documentation page, not part of the marketing site).
- `refrence/ds-tokens.jsx` — canonical color tokens (dark + light), type scale, spacing scale, radii, elevation, and motion timing values. This is your source of truth for every design token.
- `refrence/ds-primitives.jsx` — canonical primitive component styling (buttons, inputs, switches, checkboxes/radios, badges/tags/avatars, tabs/segmented, KPI cards, progress/stepper, toasts/banners, skeletons, empty states, breadcrumb/pagination/kbd). Use this to understand the intended states/variants of any primitive you build or configure via shadcn, even where Flow 1 only uses a subset of them.
- `refrence/flow-1-marketing.html` — the outer shell of the marketing prototype (fonts, the full `<style>` block with every `mk-*` class, and the throwaway `<App>`/`SCREENS` demo harness — **the harness itself is not to be ported**, see Section 4).
- `refrence/f1-components.jsx` — shared components: `MarketingNav`, `MarketingFooter`, `SectionLabel`, `StatBlock`, `FAQ`, `TestimonialCard`, `MkIcon`.
- `refrence/f1-screens.jsx` — the five screens: `LandingScreen`, `FeaturesScreen`, `PricingScreen`, `AfricaScreen`, `DemoScreen`. This file has the **final, real copy** for every section — headlines, body text, testimonials, FAQ answers, pricing figures, feature descriptions. Copy it verbatim. Do not paraphrase, shorten, or placeholder any of it.

**Explicitly out of scope for this pass** — do not read these as build targets, do not build anything from them:
- `refrence/ds-solai.jsx` (WhyPopover, MoneyDisplay, agent-activity, budget-envelope, consent-banner, timeline — these are dashboard-flow components for a later integration pass).
- `refrence/flow-2-auth.html` through `refrence/flow-7-settings.html` and their paired `.jsx` files, and `refrence/SolAI Design - Analysis & Execution Plan.html`.
- `refrence/uploads/*.png` and `refrence/.thumbnail/` — reference screenshots, not assets to import into the app.

---

## 4. Known issues to fix, not preserve

The static HTML prototype has real bugs and rough edges. Do not port these faithfully — fix them as part of the integration:

1. **Duplicate navigation.** In `flow-1-marketing.html`'s demo harness, the `<App>` component renders `MarketingNav` *and* a second `.mk-screen-picker` tab strip directly below it, which exists only to let the static demo fake page-switching via React state (`SCREENS.map(...)`) since it has no real router. **This screen-picker must not exist in the Next.js app at all.** `MarketingNav` becomes the one and only navigation, and its links become real `next/link` navigations to real routes (Section 11). Active-link styling should be driven by `usePathname()` against each link's `href`, replacing the reference's `currentScreen === l.id` string-comparison approach.
2. **Theme toggle is broken / invisible in dark mode.** Root cause in the reference: theme state is plain `React.useState` toggling a `data-theme` attribute with zero SSR awareness (causes flash-of-wrong-theme in a real app), and the toggle button just renders a raw `☀`/`☾` character with implicit text color and no guaranteed contrast against `--surface`/`--bg` in both themes. Fix properly:
   - Install and configure `next-themes`, with `attribute="data-theme"` (matching this design system's existing `[data-theme="dark"]`/`[data-theme="light"]` CSS selectors — do not switch to class-based theming, since every token in Section 5 is already scoped to `data-theme`), `defaultTheme="dark"`.
   - Add `suppressHydrationWarning` to the `<html>` element in `app/layout.tsx` (required by `next-themes` to avoid a hydration mismatch warning on the attribute it sets before React hydrates).
   - Build the theme-toggle as a proper atom: a bordered, `--r-md`-radius, 32×32px button (matching `.mk-theme-btn` from the reference) using `lucide-react`'s `Sun` and `Moon` icons — swap icon by current resolved theme — with the icon's `color`/`stroke` explicitly tied to the `--text` token (e.g. via a `text-[var(--text)]` class) so it is never ambiguous or invisible in either theme. Use `useTheme()` from `next-themes` to read/set the value.
3. **Mobile menu is unpolished.** The reference's mobile nav is a bare `position:absolute` panel toggled by `display:flex`/`none` — no animation, no backdrop, no focus trap, no scroll lock, hamburger icon never visually changes to a close icon, and the login link and theme toggle are entirely missing from the mobile panel (`.mk-nav-actions .mk-nav-login{display:none}` on mobile with no mobile equivalent). Rebuild it as a proper slide-in `Sheet` (Section 7) that:
   - Opens from the right (or top — your call, pick whichever reads better against this layout) with a Framer Motion or Tailwind-transition slide/fade, and a dimmed backdrop.
   - Contains **all** nav links, **plus** the theme toggle, **plus** "Log in" and "Start free" — nothing should be exclusive to desktop.
   - Animates the hamburger icon into an X (or swaps to a lucide `X` icon) while open.
   - Traps focus while open, closes on `Escape`, closes on backdrop click, closes automatically when a link inside it is clicked (matching the reference's `setMobileOpen(false)` behavior on link click, just implemented properly), and locks body scroll while open.
4. **Features / Pricing / For Africa / Contact become real, separate routes**, not tab-switched state — see Section 11 for exact paths.
5. **CTA destinations for not-yet-built flows.** "Start free" (nav, hero, CTA section, pricing Starter/Growth cards) and any other sign-up-intent CTA should link to a real `/signup` route. "Log in" links to a real `/login` route. Both of these routes should render a minimal, on-brand "Coming soon" placeholder page (centered card, logo, a short message, a link back to `/`) — styled with the same tokens as the rest of the site, not an unstyled stub. Do not build actual authentication in this pass; these are placeholders that Flow 2 will later fill in.
6. **Contact form needs a real (if minimal) backend path, not a fake `setTimeout`.** Build it as a Next.js **Server Action**:
   - Define a `zod` schema validating the form's fields (full name required string, email required valid email, company optional string, monthly ad spend one of the four bucket strings from the reference, platform one of Shopify/WooCommerce/Other, message optional string).
   - Use `react-hook-form` with `@hookform/resolvers/zod` on the client for inline validation UX (label/helper/error per field, matching the design system's field pattern).
   - The Server Action itself validates the payload server-side against the same schema, and — since there is no email/CRM integration yet — logs the validated payload server-side and returns a typed `{ success: true }` (or a typed error shape on validation failure). Structure this so wiring in real delivery (email service, CRM webhook) later is a change confined to the inside of that one action function, not a UI rewrite.
   - On success, the client renders the reference's existing success state (check icon, "We'll be in touch within 24 hours.", "Start free now" CTA linking to `/signup`).
7. **Legal footer links** (Privacy Policy, Terms of Service, GDPR, Rwanda DPL in the footer; Privacy Policy / Terms of Service / GDPR Notice / Rwanda DPL Statement / POPIA Compliance / Sub-Processor Register on the Contact page) have no real destination or content anywhere in the reference material. Do not invent legal copy. Render them as visibly disabled/muted links (e.g. `aria-disabled`, reduced opacity, no hover state implying they work) rather than as functional `href="#"` links that silently do nothing — this is more honest to the user than a dead link that looks live.
8. **Preserve every responsive collapse point exactly**, just implement them with Tailwind's responsive prefixes instead of the reference's raw `@media` queries. The reference uses three breakpoints — `max-width: 1024px`, `max-width: 768px`, `max-width: 640px` — which map almost exactly onto Tailwind v4's default `lg` (1024px), `md` (768px), and `sm` (640px) breakpoints. Concretely:
   - Nav links collapse to the mobile Sheet, and the desktop-only "Log in" link disappears, at `md` (768px).
   - Hero grid (`1fr 1fr` → single column, visual reordered above copy) at `md`.
   - How-it-works step grid: 5 columns → 3 columns at `lg` (1024px) → 1 column at `sm` (640px).
   - Comparison, testimonials, features, africa, pricing grids: collapse to 1 column at `md` (768px) except the comparison 2-column grid and testimonials 3-column grid, which the reference specifically collapses at `sm`/`md` respectively — check each section's original breakpoint in the CSS (`.mk-comparison` at 640px, `.mk-testimonials-grid` at 768px, `.mk-features-grid`/`.mk-pricing-grid`/`.mk-africa-grid` at 768px) and replicate exactly, don't standardize them to one breakpoint.
   - Contact grid (form + info) and its internal 2-column form rows collapse to 1 column at `md` (768px).
   - Section horizontal padding drops from 32px to 16px, and vertical padding from 64px to 40px, at `md` (768px) — reuse Tailwind's spacing scale for the closest equivalents rather than arbitrary pixel values.

---

## 5. Design tokens → Tailwind v4 foundation (`app/globals.css`)

Replace the placeholder `--background`/`--foreground` tokens currently in `app/globals.css` with the full SolAI token set, taken verbatim from `refrence/00-design-system.html` / `refrence/flow-1-marketing.html`'s `:root, [data-theme="dark"]` and `[data-theme="light"]` blocks:

**Dark (default — applies via both `:root` and `[data-theme="dark"]`):**
`--bg:#0B0D12; --surface:#11141B; --surface-2:#161A22; --border:#1F2430; --text:#F2F4F7; --text-muted:#98A2B3; --text-subtle:#667085; --brand:#5B7CFF; --brand-soft:#1B2240; --success:#34D399; --warning:#FFB547; --danger:#F97066; --info:#7AA7FF; --accent-rwanda:#34A853; --r-sm:6px; --r-md:10px; --r-lg:14px; --r-xl:20px; --r-pill:9999px; --ease:cubic-bezier(.2,.8,.2,1); --e1:0 0 0 1px var(--border); --e2:0 1px 2px rgba(16,24,40,.06); --e3:0 8px 24px rgba(16,24,40,.10)`

**Light (`[data-theme="light"]`):**
`--bg:#FFFFFF; --surface:#F7F8FA; --surface-2:#EEF1F5; --border:#E4E7EC; --text:#0B0D12; --text-muted:#475467; --text-subtle:#667085; --brand:#2E5BFF; --brand-soft:#E8EEFF; --success:#0B8A4D; --warning:#B25E00; --danger:#B42318; --info:#175CD3; --accent-rwanda:#1E8E3E`

Then, inside `@theme inline { ... }`, map the semantic ones you'll actually use as Tailwind utilities (e.g. `--color-bg: var(--bg); --color-surface: var(--surface); --color-surface-2: var(--surface-2); --color-border: var(--border); --color-text: var(--text); --color-text-muted: var(--text-muted); --color-text-subtle: var(--text-subtle); --color-brand: var(--brand); --color-brand-soft: var(--brand-soft); --color-success: var(--success); --color-warning: var(--warning); --color-danger: var(--danger); --color-info: var(--info); --color-accent-rwanda: var(--accent-rwanda); --radius-sm: var(--r-sm); --radius-md: var(--r-md); --radius-lg: var(--r-lg); --radius-xl: var(--r-xl); --radius-pill: var(--r-pill);`) so that classes like `bg-brand`, `text-text-muted`, `border-border`, `rounded-lg` resolve to the correct token in both themes automatically. This is the single most important step for making the rest of the build fast and consistent — every component you write afterward should reference these semantic classes, never raw hex values.

**Fonts.** Remove the current Geist/Geist Mono setup in `app/layout.tsx`. Load **Inter** (weights 400, 500, 600, 700) and **JetBrains Mono** (weights 400, 500) via `next/font/google`, exposing them as `--font-sans`/`--font-mono` CSS variables exactly as the current Geist setup already does structurally — then wire `--font-sans`/`--font-mono` into `@theme inline` the same way the existing Geist variables are, so `font-sans`/`font-mono` utilities work project-wide. Inter is the UI/body font; JetBrains Mono is reserved for money, hashes/run-IDs, and the uppercase `SectionLabel` — do not use it as a general body font.

**Type scale, spacing, radii, elevation, motion** — from `refrence/ds-tokens.jsx`: type scale is `display` (clamp(40px,5vw,56px)/600/-0.02em), `h1` (clamp(28px,3.5vw,36px)/600/-0.01em), `h2` (clamp(22px,2.8vw,28px)/600), `h3` (clamp(18px,2.2vw,22px)/600), `body-lg` (clamp(16px,1.8vw,18px)/400), `body` (clamp(14px,1.5vw,15px)/400), `small` (clamp(12px,1.3vw,13px)/400), `mono` (clamp(12px,1.3vw,13px)/400, JetBrains Mono, tabular numerals). Spacing scale is `2,4,6,8,12,16,20,24,32,40,56,80` (px) — Tailwind's default spacing scale already covers all of these values at their standard multiples, so you generally don't need custom spacing tokens, just use the matching Tailwind spacing utilities. Radii: `--r-sm`=6, `--r-md`=10, `--r-lg`=14, `--r-xl`=20, `--r-pill`=9999 (already mapped above). Motion: default transition duration 120–200ms, easing `cubic-bezier(.2,.8,.2,1)` everywhere (this is the one custom easing curve worth adding to `@theme inline` as `--ease-brand` or similar, or just referencing directly as an arbitrary Tailwind value / Framer Motion `ease` array `[0.2, 0.8, 0.2, 1]`).

**Global base + reduced motion.** Port the reference's base rules: `body` uses Inter, `background: var(--bg)`, `color: var(--text)`, `line-height: 1.6`, antialiased. Port the `@media (prefers-reduced-motion: reduce)` rule that forces all `animation-duration`/`transition-duration` to `0.01ms` — this must apply globally, including to any Framer Motion/GSAP animation you add later (both libraries respect this if you check `window.matchMedia('(prefers-reduced-motion: reduce)')` or use their built-in reduced-motion hooks — do this, don't skip it).

---

## 6. next-themes integration

Install `next-themes`. Wrap the children of `app/layout.tsx` in its `ThemeProvider` with `attribute="data-theme"` and `defaultTheme="dark"`. Add `suppressHydrationWarning` to the root `<html>` element (this is required by `next-themes` and is not optional — omitting it produces a real hydration-mismatch warning in dev). This directly fixes the theme-toggle bug described in Section 4.2 — the toggle atom itself is described there too.

---

## 7. shadcn/ui installation & component list

Initialize shadcn/ui with its CLI (`npx shadcn@latest init` or whatever the current canonical init command is at the time you run this) against the existing Next 16 / Tailwind v4 / `@/*`-alias setup — it should detect the App Router structure and existing `app/globals.css` correctly; if the init flow asks about a base color/style, choose whatever is closest to neutral/slate since you'll be overriding colors with the token system in Section 5 anyway.

Install exactly these primitives as the atomic foundation for Flow 1 (you may add more later for future flows, but don't over-install now):

- `button` — powers both the reference's `.mk-btn-cta` (primary) and `.mk-btn-secondary` variants, plus size variants for the `.mk-btn-lg` large CTAs.
- `sheet` — the mobile nav drawer (Section 4.3).
- `accordion` — the FAQ section (6 items, `refrence/f1-components.jsx`'s `FAQ` component logic, one open at a time).
- `select` — the pricing page's currency dropdown and the contact form's "Monthly ad spend"/"Platform" dropdowns.
- `input`, `textarea`, `label`, `form` — the contact form fields, paired with `react-hook-form` + `@hookform/resolvers/zod` (Section 4.6).
- `badge` — the footer's compliance-badge strip, the "Most popular" pricing tag, and the africa page's rail/language chips.
- `avatar` — testimonial author initials.
- `separator` — any divider lines that don't already come from a card border.

There is no shadcn primitive that's a clean match for the pricing page's pill-shaped two-option segmented control (`Subscription`/`Performance`) — either use `toggle-group` (Radix-based, install it too) styled to match `.mk-segmented`/`.mk-seg-btn`, or hand-build a small two-button molecule; whichever you choose, it must be keyboard-operable and expose the current selection via `aria-pressed`/`role="tablist"` semantics, not div-soup.

You are explicitly permitted — and in places expected — to edit the generated component source under `components/ui/` (shadcn copies source into your repo; it is not a black-box npm package) so that radii, focus rings, colors, and spacing match the token system in Section 5 exactly, rather than shadcn's stock defaults. Where the stock defaults already match (many will, since neutral/slate shadcn defaults are structurally similar), leave them alone — don't change things that already work.

Install **`lucide-react`** as the real icon library, and delete the reference's hand-rolled `MkIcon` (`f1-components.jsx`) / `Icon` (`ds-primitives.jsx`) SVG-path helpers entirely — there's no reason to hand-maintain SVG paths when the real package exists. Map every icon name used in Flow 1 to its `lucide-react` named export:

`check→Check, x→X, arrowRight→ArrowRight, zap→Zap, shield→Shield, eye→Eye, messageCircle→MessageCircle, barChart→BarChart3, globe→Globe, smartphone→Smartphone, creditCard→CreditCard, target→Target, helpCircle→HelpCircle, layers→Layers, lock→Lock, users→Users, refreshCw→RefreshCw, send→Send`

Plus, for the theme toggle specifically (not present in the reference's icon set, since it used raw glyphs): `Sun`, `Moon`.

---

## 8. Animation dependencies

Install **`framer-motion`** and **`gsap`** together with **`@gsap/react`** (for the `useGSAP` hook). Split responsibility clearly so you don't reach for the wrong tool:

- **Framer Motion owns state-driven and interaction-driven animation**: the mobile Sheet's open/close transition, the FAQ accordion's expand/collapse and chevron rotation, the landing page's "Why?" demo popover's reveal, hover/tap micro-interactions on buttons and cards (subtle scale/lift, matching the reference's existing `transition: all 120–150ms var(--ease)` hover rules but now as real spring/tween animations), and any mount-in fade/slide on interactive components.
- **GSAP (with `ScrollTrigger`) owns scroll-driven animation**: the hero's entrance as the page first paints, the how-it-works step cards staggering in as they scroll into view, the comparison section's two columns animating in, the stats row (consider an actual count-up animation for the numeric stats, matching the design system's emphasis on financial/numeric polish), and the testimonials staggering in. Register `ScrollTrigger` once in a shared client-side setup, and clean up triggers on unmount (the `useGSAP` hook handles this for you — use it rather than raw `useEffect` + manual `gsap.context()`).

Every animation from both libraries must respect `prefers-reduced-motion`: check it (via `window.matchMedia` or each library's reduced-motion utilities) and skip or drastically shorten motion when it's set, consistent with the global CSS reset in Section 5. Don't ship an animation-heavy page that ignores this — it's an explicit item in the design system's own audit checklist (Section 12).

---

## 9. Component architecture — atoms, molecules, organisms

Structure `components/` as strict, one-directional layers — atoms never import molecules, molecules never import organisms, and so on. Organisms should be route-agnostic: they accept typed props/content and render them, they do not hardcode copy or fetch data themselves — pages compose organisms and pass in the typed data from `lib/data/` (Section 10).

```
components/
  ui/          — shadcn-generated primitives (Section 7), edited in place as needed
  atoms/       — SectionLabel, Logo, ThemeToggle, StatValue
  molecules/   — NavLink, FormField, TestimonialCard, StepCard, FeatureCard,
                 PriceCard, PriceFeatureItem, FAQItem, CompareRow, LogoChip,
                 ComplianceBadgeGroup, RailBadgeGroup, LangChipGroup
  organisms/   — MarketingNav, MarketingFooter, HeroSection, LogoStrip,
                 HowItWorksSection, WhyShowcaseSection, ComparisonSection,
                 StatsSection, TestimonialsSection, FAQSection, CTASection,
                 FeaturesGrid, PricingSection, AfricaGrid, ContactForm,
                 ContactInfo, PageHeader
```

Derive the exact prop shape and internal logic of each from `refrence/f1-components.jsx` and `refrence/f1-screens.jsx` — e.g. `HeroSection` should own the three-layer floating visual (`.mk-hero-layers`/`.mk-layer-1/2/3`) as its own concern, `PricingSection` should own the subscription/performance toggle state and currency conversion logic (the `rates` map and `fmt()` formatter from `PricingScreen`, including the zero-decimal handling for RWF/KES/NGN), and `FeaturesGrid` should own the per-card expand/collapse state (`expanded`/`setExpanded` from `FeaturesScreen`). `MarketingNav` and `MarketingFooter` are organisms shared by every route via `app/layout.tsx`, not duplicated per page.

---

## 10. Data & types separation

Extract every piece of static content into typed data modules under `lib/data/`, each paired with a TypeScript `interface`/`type` (colocated in the same file, or in a matching `types/` module — your call, just be consistent project-wide). Content must be copied **verbatim** from `refrence/f1-screens.jsx` and `refrence/f1-components.jsx` — every headline, every testimonial quote, every FAQ answer, every feature description, exactly as written there. Do not summarize or rewrite the copy.

Files to create:

- `lib/data/nav.ts` — the 5 nav links (Home/Features/Pricing/For Africa/Contact with their real route paths from Section 11) and the 4 footer link groups (Product/Company/Legal, plus the brand blurb).
- `lib/data/hero.ts` — hero headline, subhead, trust line, and the country-flag string.
- `lib/data/logos.ts` — the 7-item integration logo strip (Shopify, WooCommerce, Meta Ads, Google Ads, WhatsApp, Stripe, MTN MoMo).
- `lib/data/how-it-works.ts` — the 5 steps (number, icon name, title, description) exactly as in `LandingScreen`.
- `lib/data/comparison.ts` — the 7 "without" rows and 7 "with" rows.
- `lib/data/stats.ts` — the landing page's 4 stats and the Africa page's 4 stats (keep these as two separate exports since they're different data, even though they render through the same `StatBlock` molecule).
- `lib/data/testimonials.ts` — the 3 testimonials (name, company, location, quote) verbatim.
- `lib/data/faq.ts` — all 6 FAQ items (question + full answer text) verbatim.
- `lib/data/features.ts` — all 8 feature cards (icon, title, short desc, expandable detail text) verbatim.
- `lib/data/pricing.ts` — the 3 subscription tiers (tier label, base USD price, feature list, CTA label) plus the performance-pricing tier, plus the currency rate map (`{USD:1, EUR:0.92, RWF:1350, KES:153, NGN:1550, ZAR:18.5}`) and the zero-decimal currency set (`RWF, KES, NGN`) used by the formatter.
- `lib/data/africa.ts` — the 6 Africa cards and the 4-language list.
- `lib/data/contact.ts` — the 3 contact methods (email, WhatsApp, office address) and the 6 legal-link labels (disabled per Section 4.7).
- `lib/data/site.ts` — global constants: brand name "SolAI", the footer copyright line, and the 5 compliance badges ("Hard caps", "Audit-grade", "GDPR", "POPIA", "Rwanda DPL").

Also create `lib/utils.ts` (shadcn's `cn()` class-merge helper, generated automatically by the init step in Section 7 if it doesn't already exist), `lib/validations/contact.ts` (the zod schema from Section 4.6), and `lib/actions/contact.ts` (the Server Action itself).

---

## 11. Page-by-page build spec

Routes, in the App Router, all under `app/`:

- **`/` (Landing)** — `app/page.tsx`. Section order, top to bottom: HeroSection → LogoStrip → HowItWorksSection → WhyShowcaseSection → ComparisonSection → StatsSection → TestimonialsSection → FAQSection → CTASection. This is the longest, most animation-heavy page.
- **`/features`** — `app/features/page.tsx`. PageHeader ("Platform" label, "Everything SolAI does for you." title, subhead) → FeaturesGrid (8 expandable cards, 2-column desktop / 1-column mobile per Section 4.8).
- **`/pricing`** — `app/pricing/page.tsx`. PageHeader (with the plan-type segmented control and currency select inline in the header, matching the reference) → PricingSection (renders either the 3-tier subscription grid or the single performance-pricing card, depending on the toggle state).
- **`/for-africa`** — `app/for-africa/page.tsx`. PageHeader ("For Africa" label, "Built *from* Africa, *for* Africa." title with the word "from"/"for" italicized as in the reference) → AfricaGrid (6 cards) → StatsSection (Africa-specific stats).
- **`/contact`** — `app/contact/page.tsx`. PageHeader → two-column grid: ContactForm (left, wider column) / ContactInfo (right, narrower column, includes the disabled legal links list).
- **`/signup`** — `app/signup/page.tsx`. Minimal on-brand placeholder ("Coming soon", link back to `/`) per Section 4.5.
- **`/login`** — `app/login/page.tsx`. Same treatment as `/signup`.

**`app/layout.tsx`** owns: the `ThemeProvider` wrapper (Section 6), the Inter/JetBrains Mono font loading (Section 5), and rendering `MarketingNav` + `{children}` + `MarketingFooter` around every route so no page has to repeat the shell.

Give every route a real `metadata` export (at minimum a specific, accurate `title` and `description` per page — not the leftover "Create Next App" default that's currently in `app/layout.tsx`, and not one generic title reused across all five routes).

---

## 12. Accessibility & quality bar

Hold this build to the exact checklist already defined in `refrence/00-design-system.html`'s own self-audit section — treat it as your acceptance criteria, not aspirational:

- Body text contrast ≥ 4.5:1 and large text ≥ 3:1, verified in **both** themes, not just dark.
- Visible focus rings on every interactive element (buttons, links, form fields, accordion triggers, the theme toggle, the mobile Sheet's close control) — don't strip default focus outlines without replacing them.
- Tab order matches visual order on every page, including inside the mobile Sheet while it's open.
- Every form field (contact form) has a label, helper text where relevant, and a distinct error state — not just a red border.
- Any status conveyed with color (e.g. the "Inside cap" success-green text in the Why? demo) also carries an icon or text label — never color alone.
- Reduced-motion fallback verified to actually work, not just present in CSS (test with the OS/browser reduced-motion setting on).
- Dark/light parity — manually toggle the theme on every route and confirm nothing breaks, disappears, or loses contrast (this directly re-tests the bug from Section 4.2).
- No off-palette colors anywhere — every color used should trace back to a token from Section 5.
- No lorem ipsum, no "Lorem", no placeholder copy anywhere in the shipped pages — everything traces back to `refrence/f1-screens.jsx`/`f1-components.jsx`, except the two new `/signup`/`/login` stub pages, which should use clearly-labeled real placeholder copy ("Coming soon") rather than fake content pretending to be final.
- Tabular numerals (`font-feature-settings: "tnum"`) on all numeric/financial display — pricing amounts, the Why? demo's dollar figure, the stats row's numeric values.

---

## 13. Verification / definition of done

- `npm run dev` and manually click through all 7 routes (`/`, `/features`, `/pricing`, `/for-africa`, `/contact`, `/signup`, `/login`), in both themes, at three widths: 375px (mobile), 768px (tablet), 1280px+ (desktop).
- `npm run lint` passes with zero errors.
- `npm run build` completes successfully under Turbopack with no type errors.
- Side-by-side comparison against `refrence/flow-1-marketing.html` (open it directly in a browser) and `refrence/f1-screens.jsx` for every section — confirm copy, layout, and spacing fidelity; nothing invented, nothing dropped.
- Explicitly re-verify the three user-reported bugs are actually fixed, not just relocated: (a) exactly one navigation bar renders on every route, no screen-picker-style tab strip anywhere; (b) the theme toggle works, and its icon is clearly visible with correct contrast in both dark and light mode; (c) the mobile menu opens/closes smoothly, contains every nav item plus the theme toggle plus both CTAs, and is keyboard/focus-trap correct.

---

## 14. Explicit non-goals for this pass

- Do not build Flows 2–7 (auth, onboarding, dashboard, campaigns, conversations, settings) — this pass establishes the shared foundation (tokens, primitives, atomic component layers) those flows will later reuse, but their actual screens are out of scope now.
- Do not write real legal page content for the Privacy/Terms/GDPR/DPL links.
- Do not wire a real email service or CRM to the contact form — the Server Action stub from Section 4.6 is the full scope here.
- Do not invent copy, statistics, testimonials, or pricing figures beyond what exists in the reference files.

---

## 15. Suggested phased execution order

Work in this order; treat each phase as a checkpoint before starting the next.

1. **Research/audit** — read every file in Section 3, and read the relevant `node_modules/next/dist/docs/01-app/` pages per Section 2. Produce no code yet; just confirm you understand the token set, the component inventory, and the environment constraints.
2. **Foundation** — `app/globals.css` token migration (Section 5), font swap, `next-themes` wiring (Section 6), `shadcn/ui` init + primitive installs + `lucide-react` (Section 7), base folder scaffolding (Section 9).
3. **Data & types** — every file in Section 10, with content transcribed verbatim from the reference JSX.
4. **Components** — build atoms first, then molecules (which may consume atoms + `components/ui`), then organisms (which consume molecules/atoms), in that order.
5. **Routing & page assembly** — `app/layout.tsx` shell, then each route in Section 11, composing organisms with the typed data from Phase 3.
6. **Animation** — layer in Framer Motion and GSAP (Section 8) once the static structure, content, and responsive behavior are all confirmed correct — don't animate a layout that's still going to change shape.
7. **QA/audit** — run through Sections 12 and 13 in full before calling this done.
