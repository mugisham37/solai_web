# The buyer side — analysis and plan (screens 13, 14, 15)

The reasoning behind `13-storefront.html`, `14-checkout.html`, `15-protected.html` and the three
briefs that ship with them.

---

## 1. Who this person is, and why that changes everything

Every screen before this one was for a seller — someone who chose to be here, who has invested two
minutes and a photograph, and who wants the product to work.

The buyer is the opposite in every respect. They **did not come here on purpose.** They tapped a
link in a WhatsApp message from someone selling something. They have never heard of SolAI. They have
probably been scammed before, or know someone who has. They are one hesitation away from closing the
tab, and if they do, the seller's entire five-screen setup produced nothing.

So the buyer screens have a different job from every other screen in the product:

> The seller screens are designed to **reduce effort**. The buyer screens are designed to
> **reduce fear.**

Every decision below follows from that sentence.

---

## 2. What the prototype had, and what it was hiding

In the original prototype these three were a product page, a payment radio list, and a confirmation
with a code. Right in shape, and missing most of what a real buyer flow has to survive.

| | Prototype | What is actually needed |
|---|---|---|
| Arrival | One product, always | A link can be shop-level or product-level — both must work |
| Gallery | Four static blocks | Real gallery, and **AI scenes distinguished from the seller's own photo** |
| Options | None | Colour, quantity, delivery area or self-collection, each changing the price live |
| Trust | One reassurance card | Seller record, confirmed-delivery history, the protection explained properly, report link |
| Checkout | Four radios | Name, number, area, landmark, pickup, four payment methods with their own fields, validation |
| Paying | A mocked prompt | Waiting state with a real timeout, failure state with causes, cash-on-delivery confirmation |
| After paying | A code and a tracking list | Five states: held, in transit, done, disputed, refunded |
| Confirming | Only the code | A second path — "I have received it" — because codes get lost |
| Problems | Not designed | Reporting, what happens next, an SLA countdown, refund confirmation |
| Receipts | None | Downloadable, on every terminal state |

---

## 3. Screen 13 — the storefront

**The single most important decision on this screen is the photo labelling.** The seller's own
photograph is always first and is marked *seller's own photo*; every generated scene is marked
*Styled picture*, in the gallery and again on the thumbnail. A short card explains the difference the
moment you land on a styled shot.

This is not a compliance gesture. If a buyer receives something that does not match a beautiful
generated render, they open a dispute for "not as described" — and under our own escrow rules **we
refund them and we absorb it.** Labelling is how the AI feature stops manufacturing our dispute
rate. It also makes an honest claim no competitor is making.

Other decisions worth recording:

- **Price maths is live and in one place.** Colour, quantity and delivery area all recompute the
  summary and the sticky bar. Self-collection sets delivery to zero and changes the explanatory
  line rather than leaving a stale one.
- **The trust block is not a badge, it is a record.** Orders delivered, orders *confirmed by the
  buyer*, shipping speed, reply speed — and an explicit line saying a newer seller is held longer,
  framed as protection for the reader rather than as a warning about the seller.
- **"Recent deliveries" instead of reviews.** Three anonymised confirmed deliveries. This is
  deliberate: written reviews are trivially faked, and on a young marketplace they would either be
  empty or invented. A confirmed delivery cannot be posted by someone who did not buy, because the
  code proves it. It is weaker social proof and stronger evidence, and I would rather have evidence.
- **A report link is on the product page**, not hidden. A marketplace that is easy to report to is a
  marketplace worth trusting.
- **Four states**: product, whole shop, out of stock, removed. The shop state exists because a
  seller's link is often shop-level; the out-of-stock state captures a phone number for a
  back-in-stock message rather than dead-ending; the removed state states plainly that nothing was
  charged and that any existing order is unaffected.

---

## 4. Screen 14 — checkout

**No account. Ever.** The buyer gives a name and a number, and nothing else. The name exists so the
courier has someone to ask for; the number exists so the delivery code can arrive. Requiring a buyer
to register would undo the entire reduction the seller flow is built on, one step from the money.

Decisions:

- **Mobile money is first and card is last**, with the reason stated on the card option itself —
  cards take days to clear. Honesty here also explains the ordering, so it does not read as a
  platform preference.
- **A landmark field, not an address field.** "Blue gate opposite the pharmacy" is how people
  actually direct a courier in Kigali. An address line would produce worse deliveries.
- **Pickup is a first-class option**, not a footnote, and it removes the delivery fee.
- **Validation is minimal and late.** Two required fields, checked on blur, never on keystroke.
- **The waiting state is designed, not a spinner.** It shows what the prompt on the phone looks
  like, counts down from two minutes against a real timeout, and offers resend and cancel. It also
  says plainly that nothing is charged until the PIN is entered.
- **The failure state leads with "nothing has been taken from your wallet."** That is the buyer's
  actual first thought and it deserves the first line, before the three likely causes.
- **Cash on delivery gets its own confirmation screen**, because the thing that makes it safe is
  non-obvious: the cash goes into the same hold, not into the seller's pocket, and the code still
  governs release.

---

## 5. Screen 15 — the protection page

This is not a receipt. It is the page the buyer returns to from the SMS every time they wonder where
their parcel is, so it has to work as a **live order page** across five states.

- **The code is the hero, and it is dangerous.** It is displayed large and copyable, immediately
  followed by a red warning: nobody should ask for this before delivery — not the seller, not the
  courier, not someone claiming to be SolAI. That single line is the most important piece of copy on
  the buyer side, because social engineering to extract the code early is the obvious attack on this
  entire model.
- **A second release path.** "I have received it" releases the funds without the code. Codes get
  lost, phones die, SMS fails. Requiring the code as the *only* route would strand honest buyers and
  sellers, and the buyer voluntarily releasing is at least as strong a signal as the code.
- **The timeline is generated from events**, not written as markup, so the same component serves the
  held and transit states with different data.
- **Reporting a problem states the consequence first**: your money stays held, nothing is released,
  nothing is refunded until a person reads this. Then the outcome, then the 48-hour SLA with a live
  countdown — because a published promise with a visible clock is a different thing from a published
  promise.
- **Rating is only offered after a confirmed delivery**, and the copy says why it counts. That is
  the loop that fills the seller record on screen 13.
- **The refunded state confirms where the money went and how long it takes**, and offers a receipt.
  Refunds are where trust is either won permanently or lost permanently.

---

## 6. The thread running through all three

The escrow flow strip appears on all three buyer screens and on the seller's side, identical every
time. That is deliberate and it is the core mechanism: **the buyer, the seller and the support agent
all look at the same picture of where the money is.** Three parties, one diagram, no argument about
the facts.

---

## 7. Things I deliberately did not build

- **Written reviews and star ratings.** See §3. Confirmed deliveries instead.
- **A cart across multiple sellers.** Escrow is per seller per order; a mixed cart would need split
  holds and split disputes, and it is not what a WhatsApp-link buyer is doing.
- **Buyer accounts, wish lists, saved cards.** All of them add friction to a first purchase.
- **A live courier map.** It is expensive, it is inaccurate on motorcycle networks, and a progress
  bar with honest text is more truthful than a moving dot that is wrong.
- **Upsells and "customers also bought".** On a first purchase from a stranger, anything that looks
  like a sales funnel undermines the thing we are selling, which is safety.

## 8. Open questions

1. **Reservation on checkout.** Right now stock is not held while a buyer pays. On a one-item
   listing that produces a bad race. Decide whether to reserve for the payment window.
2. **How long the buyer can cancel free.** I have set it at "until the courier collects".
3. **Whether "I have received it" should require any second factor.** It is the weaker of the two
   release paths and could be socially engineered in reverse — a seller talking a buyer into
   confirming early.
4. **Refund timing on cash on delivery**, where there is no incoming rail to reverse.
5. **What the buyer sees if the seller is suspended mid-order.** The admin console already promises
   funds are resolved normally; the buyer needs a screen that says so.
