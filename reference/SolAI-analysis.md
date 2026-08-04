# SolAI — analysis, screen audit and build plan

Second pass on the prototype. This document explains what the product is for, which
screens survived and why, where I disagree with the brief, and what has to be decided
before code gets written.

The prototype that accompanies it is 15 screens for sellers and buyers — five of them the path
to going live — plus a six-screen admin console. Sections 11 to 13 cover the third pass:
responsiveness across phone, tablet and desktop, and the admin stakeholder.

---

## 1. What this product actually is

It is easy to describe SolAI as "AI builds you an online shop." That framing is wrong,
and if the team builds to it we will build the wrong thing.

A seller in Kigali with twelve bracelets does not lack a shop. She already sells — in
WhatsApp statuses, in a market stall, through a cousin. Two things stop her selling more:

1. **A stranger will not send her money.** Someone who hasn't met her has no reason to
   believe a parcel is coming. This is the binding constraint, and it caps her customers
   at the size of her social circle.
2. **Producing the listing is tedious.** Photographing, writing, pricing and posting is an
   evening of work per product.

AI solves the second problem. It's the demo people repeat to their friends, and it's real
value. But it is not the moat, because it will be commodity within a year.

**Escrow solves the first problem, and that is the business.** The value proposition in
one sentence: *SolAI lets a stranger buy from you.* Every design decision in this pass is
downstream of that, including the ones that look like they're about onboarding.

That reframing changes the definition of "activated." A seller is not activated when the
shop exists. She is activated when she has been **paid by someone she doesn't know.**
Everything before that moment is cost; everything after it is where the product earns the
right to ask for things.

**The audience, concretely.** Age 22–40, selling for six months to five years, phone is an
Android under $150, connection is 3G with data saver on, uses WhatsApp daily and a bank
rarely or never, prices in RWF, thinks in Kinyarwanda and reads English slowly. She has
been scammed or knows someone who has. She will not read an explainer page.

---

## 2. Why 23 screens was the real problem

Not because 23 is a big number — because of where they sat relative to the payoff.

In the first prototype a seller passed through **13 screens before the shop existed**, and
the shop still couldn't take a payment at the end of them, because payouts were framed
around cards and bank accounts. Two of those 13 asked for money (plan choice, card
details) before she'd earned any.

Three well-established effects are working against us there, and they compound:

- **Every field and every screen has a drop-off rate.** Form-length research has been
  consistent for two decades: cutting a signup form roughly in half reliably moves
  completion by double digits. A screen is more expensive than a field, because it costs a
  page load as well as a decision.
- **Cost has to arrive after value, not before.** People abandon when effort is front-loaded
  and the reward is abstract. They tolerate a great deal of effort once they've had a small
  concrete win — this is why the plan screen belongs *after* the first payout, not before
  the first product.
- **On 3G, a screen is a real cost in money.** Every extra page load is data the seller
  paid for. This is not an abstraction in this market, and it's a reason to be stricter
  than a Western product would be.

There is also a specific trust trap. Asking a first-time visitor for card details is not
just friction — in a market with real fraud, it reads as *the scam*. The card screen was
losing us people who would otherwise have converted, and it was losing us the most
suspicious ones, who are the same people the escrow product is designed for.

---

## 3. The screen audit

The rule applied to every screen: **does this have to happen before the seller can receive
money?** If no, it moved. Nothing was deleted from the product.

| Old | Screen | Decision | Reasoning |
|---|---|---|---|
| 1 | Landing | **Merge → new 1** | The landing page *is* the input. The hero is the field. |
| 2 | How it works | **Cut** | A product that needs explaining before use isn't simple enough. The build on screen 2 explains itself in eight seconds. |
| 3 | Pricing | **Move → new 10** | Shown after the first payout, with the seller's own numbers in it. |
| 4 | "I want to sell…" | **Merge → new 1** | Same question as the landing hero. |
| 5 | Seller type | **Merge → new 1** | Category is inferable from the sentence or the photo. Show it as a chip they can correct, don't ask it as a question. |
| 6 | Create account | **Merge → new 3** | The phone number is the account. No email, no password. |
| 7 | Plan + card | **Cut from path** | Everyone starts free. See §5 on what replaces it. |
| 8 | Take the photo | **Merge → new 1/2** | The camera is the left button on the input pill. |
| 9 | AI builds the store | **Keep → new 2** | Protected. See §4. |
| 10 | Pick your scenes | **Merge → new 2** | |
| 11 | Review the details | **Merge → new 2** | Three separate approvals of work the AI already did well, presented as one editable draft. If the output is good, approving it three times is theatre; if it's bad, one edit surface is faster to fix. |
| 12 | Storefront preview | **Merge → new 2** | |
| 13 | Live + share | **Split → new 4 + 5** | Deliberately two beats. Going live is a moment; sharing is an action. Collapsing them buries the share. |
| 14–16 | Content prompt, style picker, your content | **Move → new 12** | Twelve format choices is a screen that exists to show off the AI. SolAI picks four, seller swaps what they dislike. |
| 17 | Connect Meta | **Move → new 12, optional** | See §7. |
| 18–19 | Audience, budget, campaign | **Move → new 12** | Two inputs, both on one screen. |
| 20–21 | Dashboard, orders and payouts | **Rebuild → new 6–9** | Rebuilt entirely around escrow states rather than around revenue charts. |
| 22 | Community and events | **Cut** | A traction feature. Sellers with no customers do not want a community tab; sellers with 200 customers ask for one. |
| 23 | What the buyer sees | **Expand → new 13–15** | Was one screen. It is now three, and it is half the product. See §6. |

**Result: 23 → 15 screens; 13 → 5 on the path to live; 9 pre-payment decisions → 3.**

---

## 4. What must not be cut

Reduction has a floor. Three screens earn their place and should be defended in any
future pass:

**Screen 2, the AI build.** The eight-second staged generation is the only part of the
product that produces a feeling. It is also load-bearing psychologically: watching the
system work makes the output feel *hers* in a way an instant result would not. Keep the
stages named and honest ("writing the listing", "pricing against Kigali listings") — they
tell the seller what the system actually did, which makes the edit step comprehensible.
Do not make it faster than about six seconds and do not make it a spinner.

**Screen 8, the delivery code.** The temptation, when someone asks to cut steps, is to
replace the OTP with "seller marks as delivered." That deletes the product. The code is
the only thing standing between SolAI and a platform where a seller can take money and
send nothing.

**Screen 15, the buyer's protection screen.** Sellers are not the customer with the
harder problem. A shop nobody trusts is worth nothing, so the buyer's side gets three
screens and a visible seller record. Cutting here to save build time would be the most
expensive saving in the project.

**One more, added rather than kept:** the buyer's storefront now shows *delivered and
confirmed* counts and a stated dispute turnaround. A protection promise that is only
in the terms and conditions is not a promise.

---

## 5. Where onboarding moved to, not what happened to it

The brief's principle is right and worth restating as a rule the team can apply to future
features: **anything asked for before the first payment costs us people; anything offered
after a win converts.**

Concretely, the deferred things now have specific triggers rather than "later":

| Deferred | Reappears when | Where |
|---|---|---|
| Plan and pricing | After a payout lands, framed with the seller's real numbers | Screen 10 |
| Ad formats and boosts | Seller has a shop and low views — the moment they ask "why is nobody buying?" | Screen 12 |
| Meta / business page | Only if the seller wants their own page named as advertiser | Screen 12, secondary |
| Community and events | Above a traction threshold (suggest: 20 completed orders) | Not built |
| Full profile, bio, business details | Prompted on the second product, or when a buyer asks a question | Not built |

On the pricing screen specifically: showing the seller that Plus would currently cost her
*more* than Free, and recommending she stay on Free, is not a lost upsell. It's the single
cheapest trust-building moment in the product, and it's why she'll believe the fee number
when she does cross the threshold.

---

## 6. Escrow — where I disagree

The brief asked for disagreement here, so this section is direct. The overall design is
right: buyer pays the platform, platform holds, OTP at handoff releases, auto-release as a
backstop. My objections are to specific mechanics.

**6.1 One release path is not enough.**
OTP-at-handoff only works when there is a physical handoff. It has no answer for digital
products, services, or events — three of the four seller types the original prototype
supported. Needed: three release triggers, chosen by product type.

| Product type | Release trigger |
|---|---|
| Physical, courier | Courier enters buyer's OTP at handoff *(as briefed)* |
| Physical, self-delivered / in person | Buyer enters or shows the code; seller scans it |
| Digital | Release on download/access + 24h no-dispute window |
| Service or event | Release on completion date + 48h no-dispute window, or buyer taps confirm |

**6.2 The auto-release clock should start at delivery, not at payment.**
"Release after N days" measured from payment punishes a seller whose courier is slow and
rewards a buyer who stalls. Run two clocks:
- *Delivery SLA clock* — from payment. If nothing is delivered by day 7, auto-**refund** the
  buyer, don't auto-release to the seller.
- *Confirmation clock* — from courier-recorded delivery. Auto-**release** after 72 hours with
  no dispute.

Seventy-two hours is my recommendation for the confirmation window: long enough for a
buyer who received a parcel on Friday evening, short enough that sellers aren't financing
the platform. Consider 24 hours for repeat buyers.

**6.3 OTP proves handoff, not condition.**
A code entered at the door proves a parcel arrived. It does not prove the right item
arrived, or that it wasn't broken. If release is instant on OTP, a buyer who opens the
box to find the wrong thing has no recourse and we've already paid the seller.

Do not solve this by delaying every payout — instant settlement is our best claim.
Solve it with a **rolling reserve**: release the full amount instantly, but retain a small
percentage (suggest 10% for a seller's first 10 orders, 0% after) in a reserve balance
released on a 14-day rolling basis. The seller sees the money is theirs and pending, not
withheld. This is how card acquirers manage the same risk, and it doesn't cost us the
speed story.

**6.4 The courier is an attack surface the brief doesn't address.**
If the courier can see or guess the code, a courier and seller can collude to release
funds on an undelivered parcel. Rules that follow:
- The code goes to the **buyer only**, never to the courier's manifest or the seller's app.
- Prefer the courier **scanning a buyer-presented QR** over typing digits.
- Log GPS at code entry and flag entries far from the delivery address.
- Rate-limit attempts; three failures escalate to a support hold rather than a refusal.

**6.5 Fallbacks, because SIM and handset churn is high here.**
The buyer loses the phone, the SMS never arrives, the battery is dead at the door. Needed:
code retrievable in the order page as well as by SMS; a support-side release backed by
courier proof-of-delivery; and an explicit rule that a failed code never means the courier
leaves with the parcel.

**6.6 Cash on delivery moves the risk, it doesn't remove it.**
The brief is right that COD should exist and should route through escrow. But once the
courier collects cash, the courier network is holding our money, and we now have credit
exposure to them plus a daily reconciliation problem. Before shipping COD: settlement
terms with each courier partner, a float or bond, and a per-courier exposure cap.
I'd ship COD in phase two, not phase one, and say "coming" on the checkout in the interim
— its *presence* does most of the trust work even before it functions.

**6.7 Where the ledger will actually break.**
Agreeing with the brief that this should be over-engineered, the specific failure modes
are narrower than "bookkeeping":
- **Idempotency.** MoMo callbacks retry. Every collection and disbursement needs a unique
  key and an exactly-once guarantee, or one buyer's payment is credited twice.
- **Append-only.** No row is ever updated. Corrections are new compensating entries.
- **Daily reconciliation** against the MTN and Airtel statements, with an alert when the
  ledger balance and the real account balance diverge by any amount at all.
- **Take the fee at release, not at collection.** Refunds stay clean and the seller's
  statement matches what she was told.
- **Fee floor on small orders.** A flat disbursement charge of RWF 100 on an RWF 8,500
  order is already 1.2% before our own cut. Model the real economics at the median order
  value, not at an average — the median order in this market is small.

**6.8 Licensing — raising it early, as asked.**
Holding third-party funds is a regulated activity in every market on the list. Two
technical choices materially change the regulatory position, and both are cheap now and
expensive later:

1. **Keep funds in a partner-held trust account** rather than SolAI's own operating
   account, with the ledger as the sub-account system. This supports an
   agent-of-a-licensed-institution posture in the interim.
2. **Never commingle.** Platform revenue sweeps to a separate operating account daily.
   The escrow account holds only seller funds.

Also: hold windows and auto-release rules will need to be per-market configuration, not
constants, because the rules differ by jurisdiction. Build them as configuration from day
one.

---

## 7. Payments, growth, language, weight

**Mobile money as the substrate.** In the prototype MoMo is not a payment method — it is
the account (screen 3), the payout rail (screen 9) and the settlement claim. Card is
present and fourth on checkout. Near-instant settlement is stated in seconds on screen 9,
because it is a genuine advantage over a card-rails competitor and hiding it wastes it.

**WhatsApp first.** Meta as the only growth channel, gated behind a verified business
page, was the single biggest barrier in the old flow. Screen 11 is a real catalogue inside
WhatsApp with in-chat checkout; screen 12 makes paid reach two inputs. One thing to verify
before building: whether ads can run under SolAI's business account with the seller's shop
named as advertiser, as screen 12 assumes. If Meta's policies require a page per
advertiser, screen 12 needs a page-creation flow and the copy changes.

**Language.** The prototype ships an actual switcher (EN / RW / SW / FR in the rail) rather
than a promise. Key strings are keyed and swapped at runtime; the point is to prove the
plumbing exists before there are 400 hard-coded strings. Two things to get right in the
real build: language should follow the **buyer's** input in chat, not a global setting; and
the Kinyarwanda, Swahili and French strings in the prototype are placeholders that need a
native pass — Kinyarwanda in particular is longer than English and will break tight
buttons.

**Currency.** RWF everywhere, with grouping, on every screen. No USD anywhere in the
product. Store money as integer minor units, never as floats, and format at the edge.

**Weight.** The prototype is about 130 KB with zero images, zero frameworks and zero
runtime network calls; fonts are self-hosted latin subsets (90 KB, six files) rather than
a CDN, so it works offline and on a cold 3G connection. The budget to hold once real
photos exist: **first screen interactive under 150 KB**, everything below the fold lazy,
product images served as WebP at three sizes.

---

## 8. Design system

Derived from the supplied palette rather than the reference site, so the flow is inherited
and the visual language isn't.

- **Deep teal `#024241`** is the ground. **Coral `#FF7F5C`** is the only colour you press.
- **Magenta `#BC4F94` means money that isn't yours yet. Sea green `#4A8F87` means money that
  is.** Those two hues are reserved and never decorative — which is what lets a seller read
  her balance at a glance without reading the labels.
- **Bricolage Grotesque 800**, uppercase and tight, for anything making a claim.
  **Figtree** for everything read or typed, with tabular figures so columns of money align.
- **Signature 1 — the money flow strip.** Four nodes, one lit, identical on the seller's
  side and the buyer's side. Two people looking at the same picture of where the money is
  *is* the trust mechanism; the ledger is the implementation.
- **Signature 2 — the one-line pill.** Camera left, action right. It's the entire homepage
  on screen 1 and the entire ad setup on screen 12. Used twice, not five times.
- Every screen renders inside a phone frame, because every seller is on one.

---

## 9. Open questions, in the order they'll bite

1. **Confirmation window.** 72 hours proposed. Needs a decision.
2. **New-seller limits.** Proposed: first 3 orders capped at RWF 50,000 each, 10% rolling
   reserve for the first 10 orders. Needs a decision.
3. **Meta advertiser structure** — platform business account, or a page per seller (§7).
4. **Courier settlement terms** before COD ships (§6.6).
5. **Trust account structure** and which partner institution (§6.8).
6. **Account recovery.** Five steps with no email means a lost SIM is a lost business.
   Needs a recovery path — a secondary number or a PIN — captured after the first sale.
7. **Session recovery.** The AI build happens before the phone number is captured. A seller
   who closes the app at screen 2 loses everything unless the draft is held against the
   device and claimed by the number at screen 3. Build it that way.

---

## 10. What's in the prototype and what to do next

Fifteen screens across four files, a hub page carrying this argument visually, self-hosted
fonts, a working language switcher, and a step rail so the reduction can be demonstrated
side by side with the old flow. Nothing calls a server; generation, payment and payout are
timing and CSS.

Suggested sequence from here, matching the brief's priorities with one change — the buyer's
side moves up, because escrow with no buyer surface is unfinished:

1. Screens 1–5 as a real flow, with session recovery
2. The ledger and MoMo/Airtel collection and disbursement, with reconciliation
3. Screens 13–15 and OTP release
4. WhatsApp catalogue
5. Everything else

---

# Third pass — devices and the admin stakeholder

## 11. Responsiveness: what a bigger screen has to earn

Mobile-first was the right call and nothing about it changes. But "responsive" was being treated
as *doesn't break*, and that is not the same as *designed*. A phone layout stretched across 1400px
is worse than a phone layout, not better: line lengths run past 120 characters, a single column of
cards floats in a sea of empty space, and the primary action ends up alone at the bottom of a very
tall page.

The rule adopted for this pass:

> **Every breakpoint must earn its extra width by revealing something the narrower one had to hide.**
> If widening only makes existing elements bigger, the breakpoint is doing nothing and should not exist.

### 11.1 Three shapes, three jobs

| | Phone · <700px | Tablet · 700–1000px | Desktop · ≥1000px |
|---|---|---|---|
| Who | The seller, always | Seller at a stall, buyer on a tablet | Seller doing books, support agent, buyer at work |
| Structure | One column | One column, centred at a readable measure; cards two-up | Two columns + sticky context rail |
| Navigation | Bottom tab bar | Bottom tab bar | Left sidebar |
| Chrome | Phone status bar | Browser bar | Browser bar |
| Overlays | Sheet from the bottom edge | Centred dialog | Centred dialog |
| Tables | Stacked labelled cards | Stacked labelled cards | Real tables |
| Primary action | Pinned near the thumb | Full width, in flow | Left-aligned, in the context rail |

### 11.2 Why container queries, not media queries

Every layout rule in this build responds to the width of the **frame** a component sits in, not the
width of the browser window. Three consequences, all of which matter beyond the demo:

1. **The device switcher is honest.** Resizing the frame fires exactly the rules a real device
   fires. There is no separate preview mode and nothing is simulated.
2. **Components keep their behaviour when they move.** The money-flow strip is the same code on a
   phone, in a desktop sidebar and inside an admin dispute. A component that only knows the viewport
   breaks the moment you put it in a narrow column on a wide screen — which is exactly what a
   sidebar is.
3. **It is one stylesheet.** No desktop build, no device sniffing, no duplicated markup. Cost is
   roughly 40 lines of CSS and zero JavaScript.

The trade-off is browser support: container queries need a 2023-or-newer browser. Older browsers
fall back to the phone layout at every width — degraded, but never broken, and the phone layout is
the one our actual users get anyway.

### 11.3 Screen-by-screen adaptations

| Screen | Phone | Desktop |
|---|---|---|
| 1 · Landing | Stacked hero | Split hero — right half shows the shop that gets built, so the width sells the product instead of stretching the sentence |
| 2 · AI build | Preview, then fields below | Preview left, edit fields right — you can see the change you're typing |
| 3 · Phone + wallet | Single form column | Form left, "why one number" explainer right |
| 6 · Home | One column, tab bar | Sidebar; available and held balances side by side; four stats across |
| 7 · Order | Flow, parties, then ledger | Order detail left; fee breakdown and the handover action sticky right |
| 8 · Delivery code | Full-bleed, large OTP | Centred at 600px, larger cells — a wide OTP field is a worse OTP field |
| 13 · Storefront | Gallery, then details | Gallery left, sticky buy box right — the pattern every buyer already knows |
| 14 · Checkout | Methods, then total | Methods left, order summary sticky right |
| A2 · Dispute queue | Stacked labelled cards | Six-column table |

### 11.4 The floor, held at every size

Tap targets never below 44px. Line length capped around 70 characters. Visible keyboard focus on
every control. `prefers-reduced-motion` respected. Buttons sized for Kinyarwanda, which runs
noticeably longer than English and is what breaks tight layouts first.

---

## 12. The admin stakeholder

### 12.1 Why this is not back-office tooling

SolAI holds other people's money. That means the promises printed on the buyer's screen — funds
held, a 48-hour dispute answer, a refund if nothing arrives — are only real if somebody can keep
them. Without a console, the escrow design in §6 is unenforceable: money gets stuck, buyers can't
get answers, and the trust claim that the whole business rests on becomes a lie the first time
something goes wrong.

So the console is not phase five. It ships alongside escrow, because escrow without dispute
resolution is worse than no escrow at all — it takes the buyer's money *and* gives them nobody
to call.

### 12.2 The single constraint everything else follows from

> **An agent chooses an outcome. They never choose an amount, and they never choose a destination.**

Both are already fixed: the amount by the order, the destination by the wallet the buyer paid from
or the wallet on the seller's account. There is no "send funds" field anywhere in the product, no
free-text destination, and no path to release money to an account that isn't already on the order.

This is the thing that makes insider theft structurally hard rather than merely against policy.
It's also why the seller file is read-only about money even though it is covered in controls: those
controls change what the *system* is permitted to do next, and the ledger acts on that.

### 12.3 The six screens

**A1 · Operations overview.** Held in escrow now, released today, open disputes, SLA breaches.
Below that: cases needing a human sorted by time remaining, auto-raised risk signals, and the
health of every rail (MTN collections, MTN disbursements, Airtel, WhatsApp, courier). Rail health
belongs on the first screen because a degraded disbursement API looks exactly like fraud from a
seller's side, and the agent needs to know which one they're looking at.

**A2 · Dispute queue.** Sorted by SLA remaining, not by age. A queue sorted by age is how a public
48-hour promise quietly becomes a lie. Filters by state; the running split of refunded / released /
split over 30 days sits at the bottom, because that ratio is the single best early indicator of
either a fraud wave or a policy that's too harsh.

**A3 · Resolve a dispute.** The evidence timeline is assembled automatically — collection
reference, ledger entry, SMS delivery status, code attempts, courier GPS and photo, the buyer's
words — and the resolution panel sits *beside* it, never above it, so nobody decides before
reading. Four outcomes: release, refund, split, extend the hold. A reason code is required, the
note goes to both parties, and anything above RWF 100,000 needs a second approver whose name also
lands on the ledger entry.

**A4 · Seller file (and the same for buyers).** Identity, verification state, score, order history,
activity timeline. Money is displayed and never touched. The controls are graduated rather than
binary — extend hold window, cap order value, pause payouts, hide from search, watch flag, suspend
— because the honest answer to most risk signals is "slow this account down", not "destroy it".
Wallet numbers and ID documents are masked at support level; unmasking is a separate logged request
approved by finance.

Suspension explicitly does not touch money already held. Blocking a seller stops new orders; funds
in flight are still resolved case by case under the normal rules. A buyer's money must never
disappear along with a blocked seller.

The buyer-side file matters as much. Serial claimants — buyers who take delivery and then dispute
— are as expensive as fraudulent sellers, and a console that can only see one side will eventually
punish honest sellers on the word of a practised liar.

**A5 · Listing moderation.** Reported and auto-flagged listings with the reason attached, four
actions, and a required reason code that is sent to the seller in their own language with a
one-tap appeal. Silent removals lose honest sellers along with dishonest ones.

The part teams usually miss: a takedown has to reach every surface. Hiding the storefront listing
is not enough when the same product is live in a WhatsApp catalogue, being pointed at by a running
ad, and attached to orders already paid for. All four consequences are shown on one screen —
listing hidden, catalogue item withdrawn, ads paused and budget refunded, paid orders held and
refundable.

This screen also carries WhatsApp channel health, which is a genuine operational risk: Meta rates
business numbers on user feedback and can block a number outright. One seller spamming can take
everyone's catalogue offline, so complaint rates are monitored per seller and throttled here rather
than discovered after the ban.

**A6 · Ledger and audit.** Ledger balance against the real merchant-account statement, with the
difference stated plainly — that number being anything other than zero is the most important alarm
in the company. The failed-disbursement retry queue lives here: a failed payout is never a lost
payout, the money is still in escrow, the ledger still says whose it is, and the seller sees
"sending" rather than silence. Below that, the append-only audit log: actor, role, reason, ledger
reference, and for unmasking, who approved it.

### 12.4 Roles

| | Support | Finance | Admin |
|---|---|---|---|
| See held funds | ✓ | ✓ | ✓ |
| Resolve a dispute | ✓ | ✓ | ✓ |
| Resolve above RWF 100,000 | — | ✓ | ✓ |
| Take a listing down | ✓ | — | ✓ |
| Suspend an account | — | — | ✓ |
| Unmask a wallet or ID | — | ✓ | ✓ |
| Change hold rules | — | — | ✓ |
| **Move money to an arbitrary destination** | **—** | **—** | **—** |

The last row has no exception at any level. It is the whole security model in one line.

### 12.5 Why the console is counted separately

The seller and buyer journey is still fifteen screens; the console is six more. They are not added
together, and the reduction claim from the second pass is unaffected. Different product, different
user, different device priority, different success measure — a seller screen succeeds when it can
be skipped, an admin screen succeeds when it shows everything at once. Merging the counts would
make a good reduction look like a bad one and hide what each product is for.

---

## 13. Open questions added by this pass

1. **Auto-release vs dispute rate.** 72 hours is proposed. If the dispute rate climbs above roughly
   3% of orders, the window is too short and buyers are using disputes as a delay tactic; if it sits
   near zero, it's too long and sellers are financing us. Instrument this from day one.
2. **Second-approver threshold.** RWF 100,000 is a guess. Set it against the actual order-value
   distribution once there is one.
3. **Support staffing against the 48-hour promise.** The promise is on the storefront, so it is a
   staffing commitment, not a design detail. Model cases-per-order before publishing it.
4. **Unmasking retention.** 90 days is assumed for unmasked wallet and ID views. Confirm against
   the data-protection rules in each market.
5. **WhatsApp per-seller throttling.** Needs a concrete policy: how many template messages per
   seller per day before a soft block, and what the seller sees when it happens.
6. **Courier identity in the console.** Couriers are a third party with access to the release
   mechanism. They probably need their own file and their own risk score — parked for now, but the
   GPS-mismatch signal on A1 is already pointing at it.
