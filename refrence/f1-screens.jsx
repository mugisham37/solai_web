/* SolAI Flow 1 — Marketing Screens (Landing, Features, Pricing, Africa, Demo) */

/* ═══════════════════════════════════════
   SCREEN 1: LANDING PAGE
   ═══════════════════════════════════════ */
function LandingScreen() {
  const [whyOpen, setWhyOpen] = React.useState(false);
  return (
    <div className="mk-page">
      {/* Hero */}
      <section className="mk-hero">
        <div className="mk-hero-content">
          <SectionLabel>Autonomous E-Commerce Revenue Engine</SectionLabel>
          <h1 className="mk-hero-title">Upload a product.<br/>SolAI runs <em>everything</em> else.</h1>
          <p className="mk-hero-sub">One upload. Ads launch on Meta and Google. Leads convert on WhatsApp. Orders close via Stripe or Mobile Money. Every decision explained. Every cent tracked.</p>
          <div className="mk-hero-actions">
            <a href="#" className="mk-btn-cta mk-btn-lg">Start free</a>
            <a href="#" className="mk-btn-secondary mk-btn-lg">Watch demo</a>
          </div>
          <div className="mk-hero-trust">
            <span>Trusted by sellers in</span>
            <span className="mk-hero-flags">🇷🇼 Rwanda · 🇰🇪 Kenya · 🇳🇬 Nigeria · 🇿🇦 South Africa · 🇸🇳 Senegal</span>
          </div>
        </div>
        <div className="mk-hero-visual">
          {/* Abstract layered diagram inspired by RevenueBase — 3 floating layers */}
          <div className="mk-hero-layers">
            <div className="mk-layer mk-layer-1"><span className="mk-layer-label">Discovery + Reach</span></div>
            <div className="mk-layer mk-layer-2"><span className="mk-layer-label">Qualify + Close</span></div>
            <div className="mk-layer mk-layer-3"><span className="mk-layer-label">Revenue + Audit</span></div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <section className="mk-logos">
        <SectionLabel>Built for sellers on</SectionLabel>
        <div className="mk-logo-grid">
          {['Shopify','WooCommerce','Meta Ads','Google Ads','WhatsApp','Stripe','MTN MoMo'].map(l => (
            <div key={l} className="mk-logo-item">{l}</div>
          ))}
        </div>
      </section>

      {/* How It Works — 5 steps */}
      <section className="mk-section">
        <SectionLabel>How It Works</SectionLabel>
        <h2 className="mk-h2">Five minutes in. A revenue engine out.</h2>
        <div className="mk-steps-grid">
          {[
            {num:'01', icon:'layers', title:'Upload', desc:'Add your product from Shopify, WooCommerce, or a URL. Describe your ideal customer. Set a daily and total spend cap.'},
            {num:'02', icon:'target', title:'Plan', desc:'SolAI researches which platforms to use, how to split the budget, and what audiences to target.'},
            {num:'03', icon:'zap', title:'Launch', desc:'Ad creatives are generated and campaigns go live on your own Meta and Google ad accounts.'},
            {num:'04', icon:'messageCircle', title:'Close', desc:'Leads respond on WhatsApp, Instagram, or Messenger. SolAI qualifies intent and closes the sale — Stripe or Mobile Money.'},
            {num:'05', icon:'barChart', title:'Optimise', desc:'Every 15 minutes, performance is checked. Budget flows to what works. Losers are paused. Every move is explained.'},
          ].map(s => (
            <div key={s.num} className="mk-step-card">
              <div className="mk-step-num">{s.num}</div>
              <div className="mk-step-icon"><MkIcon name={s.icon} size={24}/></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why? Showcase */}
      <section className="mk-section mk-section-surface">
        <SectionLabel>Explainable AI</SectionLabel>
        <h2 className="mk-h2">Every number has a <em>"Why?"</em></h2>
        <p className="mk-body-lg">SolAI doesn't just act — it explains. Every budget shift, creative pick, audience change, and chat reply is logged with the reasoning behind it.</p>
        <div className="mk-why-showcase">
          <div className="mk-why-demo-card">
            <div className="mk-why-demo-header">
              <span className="mk-caption">Total Spend · Today</span>
              <button className="mk-why-btn" onClick={() => setWhyOpen(!whyOpen)}>Why?</button>
            </div>
            <div className="mk-why-demo-value">US$ 4,231<span className="mk-why-demo-decimal">.45</span></div>
            <div className="mk-why-demo-sub">of US$ 10,000 cap · <span style={{color:'var(--success)'}}>Inside cap</span></div>
            {whyOpen && (
              <div className="mk-why-demo-popover">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <span style={{fontWeight:600,fontSize:13}}>Why this spend level?</span>
                  <button onClick={() => setWhyOpen(false)} style={{background:'none',border:'none',color:'var(--text-subtle)',cursor:'pointer',display:'flex'}}><MkIcon name="x" size={16}/></button>
                </div>
                <p style={{fontSize:14,fontWeight:500,color:'var(--text)',margin:'0 0 8px'}}>Increased Instagram Reels budget by 15%</p>
                <ul className="mk-why-demo-list">
                  <li>CPA tracking 18% under target (US$ 8.45 vs US$ 12.00)</li>
                  <li>Reels CTR 3.2% — 1.8× above Feed average</li>
                  <li>ROAS 3.8x — highest across all active ad sets</li>
                </ul>
                <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:8,borderTop:'1px solid var(--border)',fontSize:12}}>
                  <span style={{color:'var(--brand)',fontWeight:500}}>Real-time Optimizer</span>
                  <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--text-subtle)'}}>run_7f3a…e91c</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Without / With comparison (RevenueBase-inspired) */}
      <section className="mk-section">
        <SectionLabel>The Difference</SectionLabel>
        <h2 className="mk-h2">What changes when SolAI runs your growth.</h2>
        <div className="mk-comparison">
          <div className="mk-compare-col mk-compare-without">
            <h3 className="mk-compare-title"><em>Without</em> SolAI</h3>
            {[
              'Ad budgets bleed with no one watching',
              'Leads go cold in unanswered DMs',
              'No idea which creative is working',
              'Agencies cost US$ 1,000–5,000/month',
              'Mobile money customers can\'t check out',
              'No audit trail — "trust us" is the answer',
              'One language, one channel, one market',
            ].map((t, i) => (
              <div key={i} className="mk-compare-row"><span className="mk-compare-x"><MkIcon name="x" size={14}/></span>{t}</div>
            ))}
            <div className="mk-compare-accent mk-compare-accent-danger"></div>
          </div>
          <div className="mk-compare-col mk-compare-with">
            <h3 className="mk-compare-title"><em>With</em> SolAI</h3>
            {[
              'Every 15 min, budget flows to winners',
              'Sales Agent closes in WhatsApp, IG, Messenger',
              'A/B tests run automatically — losers paused',
              'One upload replaces the agency',
              'Stripe + MoMo + Airtel — all first-class',
              'Every decision logged with reasoning',
              'Four languages, five channels, global reach',
            ].map((t, i) => (
              <div key={i} className="mk-compare-row"><span className="mk-compare-check"><MkIcon name="check" size={14}/></span>{t}</div>
            ))}
            <div className="mk-compare-accent mk-compare-accent-success"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mk-section mk-section-surface">
        <div className="mk-stats-row">
          <StatBlock value="15 min" label="Optimisation cycle"/>
          <StatBlock value="5" label="Autonomous agents"/>
          <StatBlock value="< 60s" label="Chat-to-checkout"/>
          <StatBlock value="100%" label="Decisions explained"/>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mk-section">
        <SectionLabel>Seller Stories</SectionLabel>
        <h2 className="mk-h2">Sellers who let SolAI run their growth.</h2>
        <div className="mk-testimonials-grid">
          <TestimonialCard name="Marie Uwimana" company="Inema Boutique" location="Kigali, Rwanda" quote="I uploaded my ceramics, set a RWF 50,000 daily cap, and walked away. Two weeks later — 340 orders, mostly via WhatsApp. I can see exactly why each budget decision was made."/>
          <TestimonialCard name="David Okafor" company="Lagos Print Co." location="Lagos, Nigeria" quote="We tried three agencies before SolAI. None could explain where the money went. SolAI's audit trail is something our accountant actually reads."/>
          <TestimonialCard name="Amara Diallo" company="Aïcha Diallo Maison" location="Dakar, Senegal" quote="My customers speak French and Wolof. SolAI's sales agent handles both on Instagram DM. The MoMo integration means my rural customers can pay too."/>
        </div>
      </section>

      {/* FAQ */}
      <section className="mk-section mk-section-surface">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="mk-h2">Frequently asked.</h2>
        <FAQ items={[
          {q:'Does SolAI spend money on my behalf?', a:'Yes — on your own ad accounts. SolAI connects via OAuth and runs campaigns on accounts you own. You set daily and total spend caps that cannot be exceeded. SolAI cannot access your card; ads are billed by Meta/Google directly to your account.'},
          {q:'What happens if something goes wrong with a campaign?', a:'SolAI monitors every campaign every 15 minutes. If CPA spikes, CTR collapses, or any anomaly is detected, the affected campaign is automatically paused. You get a dashboard alert with a full explanation. You can resume or override any time.'},
          {q:'Can I use Mobile Money to accept payments?', a:'Absolutely. SolAI supports MTN MoMo, Airtel Money, Flutterwave, and Paystack alongside Stripe. When a buyer in Rwanda or Kenya wants to pay via MoMo, the Sales Agent generates a MoMo payment link right in the chat.'},
          {q:'How does the "Why?" button work?', a:'Every auto-decided number on your dashboard — spend, ROAS, CPA, any agent action — has a "Why?" trigger. Click it and a popover shows the exact inputs, reasoning, and outcome of that decision. You can drill into the full audit trail from there.'},
          {q:'What languages does SolAI support?', a:'The conversational Sales Agent handles English, French, Kinyarwanda, and Swahili at launch. The dashboard UI is available in all four. More languages are on the roadmap.'},
          {q:'Is my data safe?', a:'SolAI runs on AWS af-south-1 (Cape Town), compliant with GDPR, POPIA, and Rwanda\'s Data Protection Law. All data is encrypted at rest and in transit. Audit logs are immutable and tamper-evident. We never store raw card data — that\'s Stripe\'s scope.'},
        ]}/>
      </section>

      {/* CTA */}
      <section className="mk-section mk-cta-section">
        <h2 className="mk-h2" style={{textAlign:'center'}}>Ready to let SolAI run your growth?</h2>
        <p className="mk-body-lg" style={{textAlign:'center',maxWidth:560,margin:'0 auto 24px'}}>Upload your first product. Set a cap. Walk away. Revenue starts flowing.</p>
        <div style={{display:'flex',justifyContent:'center',gap:12}}>
          <a href="#" className="mk-btn-cta mk-btn-lg">Start free</a>
          <a href="#" className="mk-btn-secondary mk-btn-lg">Talk to us</a>
        </div>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════
   SCREEN 2: FEATURES
   ═══════════════════════════════════════ */
function FeaturesScreen() {
  const features = [
    { icon:'layers', title:'5-Agent Autonomous System', desc:'A Supervisor orchestrates five specialist agents: Campaign Planner, Creative Generator, Real-time Optimizer, Conversational Sales Agent, and Order Handoff. Each has its own model, tools, and logging schema.', detail:'The Planner researches audiences and splits budgets. The Creative generates ad copy, images, and short video. The Optimizer watches metrics every 15 minutes. The Sales Agent closes in chat. Handoff delivers clean orders.' },
    { icon:'messageCircle', title:'Conversational Sales Agent', desc:'Not a chatbot that routes to humans — a closer. Handles WhatsApp, Instagram DM, Facebook Messenger, and web widget simultaneously.', detail:'Detects browse/interest/buy/support/spam intent in milliseconds. Qualifies with the minimum questions needed. Generates payment links in-thread. Confirms on webhook. Escalates to humans only when frustration or complexity is detected.' },
    { icon:'eye', title:'100% Explainable AI', desc:'Every budget shift, creative pick, audience change, bid adjustment, and chat reply is logged with an immutable, signed audit trail.', detail:'Each event captures: inputs considered, reasoning, action taken, result, and a SHA-256 hash chained to the previous event. The "Why?" button on every dashboard metric opens this trail. Your accountant can read it. Regulators can verify it.' },
    { icon:'shield', title:'Three-Tier Budget Control', desc:'Spend caps enforced at Swarm (tenant), Agent (role), and Task (campaign/conversation) levels. Hard limits, not soft suggestions.', detail:'A spend-velocity circuit breaker trips if per-minute spend exceeds baseline. Any single action above a configurable threshold requires human approval. Default: reject on timeout (fail-closed).' },
    { icon:'creditCard', title:'Africa-First Payments', desc:'Stripe for international cards. Flutterwave, Paystack, MTN MoMo, and Airtel Money for the African market. All first-class, not regional add-ons.', detail:'Zero-decimal currencies handled correctly (RWF, KES, NGN, XOF). MoMo settlement notes (~24h) surfaced in the order view. Payment links generated in-chat by the Sales Agent.' },
    { icon:'refreshCw', title:'Real-Time Optimisation', desc:'Every 15 minutes, the Optimizer pulls metrics, compares to 7-day rolling baselines, and acts: pause, scale, reallocate, or alert.', detail:'Uses Claude Haiku 4.5 for speed and cost. Falls back to Groq Llama 3.3 70B if Bedrock is throttled. Anomaly detection auto-pauses on 3 consecutive ticks of >50% deviation.' },
    { icon:'globe', title:'Multi-Channel, Multi-Language', desc:'English, French, Kinyarwanda, Swahili at launch. WhatsApp, Instagram DM, Messenger, web widget, SMS fallback.', detail:'All channels funnel into a unified conversation thread per lead. The dashboard shows a three-column inbox on desktop, single column on mobile. Slash-commands for human takeover.' },
    { icon:'lock', title:'Compliance Built In', desc:'GDPR, POPIA, Rwanda Law N° 058/2021. Data residency in AWS af-south-1. 72-hour breach notification. Immutable audit logs.', detail:'Region-aware consent banners. Right-to-erasure within 30 days. Compliance export as signed JSON-LD. Sub-processor register maintained. SOC 2 readiness in scope.' },
  ];
  const [expanded, setExpanded] = React.useState(null);

  return (
    <div className="mk-page">
      <section className="mk-page-header">
        <SectionLabel>Platform</SectionLabel>
        <h1 className="mk-page-title">Everything SolAI does for you.</h1>
        <p className="mk-body-lg">Eight capabilities that close the loop from product upload to revenue.</p>
      </section>
      <section className="mk-section">
        <div className="mk-features-grid">
          {features.map((f, i) => (
            <div key={i} className={`mk-feature-card ${expanded === i ? 'mk-feature-expanded' : ''}`}>
              <div className="mk-feature-icon"><MkIcon name={f.icon} size={24}/></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              {expanded === i && <p className="mk-feature-detail">{f.detail}</p>}
              <button className="mk-feature-toggle" onClick={() => setExpanded(expanded === i ? null : i)}>
                {expanded === i ? 'Show less' : 'Learn more'} <MkIcon name="arrowRight" size={14}/>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════
   SCREEN 3: PRICING
   ═══════════════════════════════════════ */
function PricingScreen() {
  const [plan, setPlan] = React.useState('subscription');
  const [currency, setCurrency] = React.useState('US$');
  const rates = { 'US$':1, 'EUR':0.92, 'RWF':1350, 'KES':153, 'NGN':1550, 'ZAR':18.5 };
  const fmt = (usd) => {
    const val = usd * rates[currency];
    const isZeroDec = ['RWF','KES','NGN'].includes(currency);
    return currency + ' ' + (isZeroDec ? Math.round(val).toLocaleString() : val.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
  };

  return (
    <div className="mk-page">
      <section className="mk-page-header">
        <SectionLabel>Pricing</SectionLabel>
        <h1 className="mk-page-title">Simple, transparent pricing.</h1>
        <p className="mk-body-lg">Two models. One audit log. We only win when you win.</p>
        <div className="mk-pricing-toggles">
          <div className="mk-segmented">
            <button className={plan==='subscription'?'active':''} onClick={()=>setPlan('subscription')}>Subscription</button>
            <button className={plan==='performance'?'active':''} onClick={()=>setPlan('performance')}>Performance</button>
          </div>
          <select className="mk-currency-select" value={currency} onChange={e=>setCurrency(e.target.value)}>
            {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </section>

      <section className="mk-section">
        {plan === 'subscription' ? (
          <div className="mk-pricing-grid">
            <div className="mk-price-card">
              <div className="mk-price-tier">01 · Starter</div>
              <div className="mk-price-amount">{fmt(0)}</div>
              <p className="mk-price-period">Free forever</p>
              <p className="mk-price-desc">Try SolAI with one product, one channel, and US$ 500/month ad-spend headroom.</p>
              <ul className="mk-price-features">
                <li><MkIcon name="check" size={16}/> 1 product</li>
                <li><MkIcon name="check" size={16}/> Meta Ads only</li>
                <li><MkIcon name="check" size={16}/> WhatsApp + web widget</li>
                <li><MkIcon name="check" size={16}/> Stripe payments</li>
                <li><MkIcon name="check" size={16}/> Full audit trail</li>
              </ul>
              <a href="#" className="mk-btn-secondary" style={{width:'100%',justifyContent:'center'}}>Start free</a>
            </div>
            <div className="mk-price-card mk-price-card-featured">
              <div className="mk-price-tier">02 · Growth</div>
              <div className="mk-price-amount">{fmt(99)}<span className="mk-price-mo">/month</span></div>
              <p className="mk-price-period">{fmt(948)} paid annually</p>
              <p className="mk-price-desc">Full platform. All channels. All payment rails. Unlimited products.</p>
              <ul className="mk-price-features">
                <li><MkIcon name="check" size={16}/> Unlimited products</li>
                <li><MkIcon name="check" size={16}/> Meta + Google Ads</li>
                <li><MkIcon name="check" size={16}/> All 5 chat channels</li>
                <li><MkIcon name="check" size={16}/> Stripe + MoMo + Airtel</li>
                <li><MkIcon name="check" size={16}/> Up to {fmt(10000)}/mo ad spend</li>
                <li><MkIcon name="check" size={16}/> CRM integrations</li>
                <li><MkIcon name="check" size={16}/> Priority support</li>
              </ul>
              <a href="#" className="mk-btn-cta" style={{width:'100%',justifyContent:'center'}}>Start free trial</a>
            </div>
            <div className="mk-price-card">
              <div className="mk-price-tier">03 · Scale</div>
              <div className="mk-price-amount">{fmt(349)}<span className="mk-price-mo">/month</span></div>
              <p className="mk-price-period">{fmt(3348)} paid annually</p>
              <p className="mk-price-desc">High-volume sellers. Custom caps. Dedicated support. SLA.</p>
              <ul className="mk-price-features">
                <li><MkIcon name="check" size={16}/> Everything in Growth</li>
                <li><MkIcon name="check" size={16}/> Unlimited ad spend</li>
                <li><MkIcon name="check" size={16}/> TikTok Ads (beta)</li>
                <li><MkIcon name="check" size={16}/> Custom CRM webhooks</li>
                <li><MkIcon name="check" size={16}/> Compliance exports</li>
                <li><MkIcon name="check" size={16}/> 99.9% SLA</li>
              </ul>
              <a href="#" className="mk-btn-secondary" style={{width:'100%',justifyContent:'center'}}>Talk to sales</a>
            </div>
          </div>
        ) : (
          <div className="mk-perf-pricing">
            <div className="mk-price-card mk-price-card-featured" style={{maxWidth:560,margin:'0 auto'}}>
              <div className="mk-price-tier">Performance · "We only win when you win"</div>
              <div className="mk-price-amount" style={{fontSize:36}}>8%<span className="mk-price-mo"> of attributed revenue</span></div>
              <p className="mk-price-desc" style={{marginTop:16}}>SolAI takes a percentage of incremental, attributable revenue — revenue that the audit log can prove was driven by SolAI-managed campaigns or conversations.</p>
              <div className="mk-perf-example">
                <p className="mk-caption" style={{marginBottom:8}}>Example at {fmt(10000)} monthly revenue</p>
                <div className="mk-perf-calc">
                  <div><span className="mk-perf-label">Your revenue</span><span className="mk-perf-val">{fmt(10000)}</span></div>
                  <div><span className="mk-perf-label">SolAI fee (8%)</span><span className="mk-perf-val">{fmt(800)}</span></div>
                  <div className="mk-perf-total"><span className="mk-perf-label">You keep</span><span className="mk-perf-val" style={{color:'var(--success)'}}>{fmt(9200)}</span></div>
                </div>
              </div>
              <ul className="mk-price-features" style={{marginTop:16}}>
                <li><MkIcon name="check" size={16}/> No monthly fee — only pay on results</li>
                <li><MkIcon name="check" size={16}/> Audit-grade attribution chain</li>
                <li><MkIcon name="check" size={16}/> Monthly signed settlement statements</li>
                <li><MkIcon name="check" size={16}/> Dispute any attributed conversion</li>
                <li><MkIcon name="check" size={16}/> Full platform access</li>
              </ul>
              <a href="#" className="mk-btn-cta" style={{width:'100%',justifyContent:'center',marginTop:16}}>Apply for performance pricing</a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════
   SCREEN 4: FOR AFRICA
   ═══════════════════════════════════════ */
function AfricaScreen() {
  return (
    <div className="mk-page">
      <section className="mk-page-header">
        <SectionLabel>For Africa</SectionLabel>
        <h1 className="mk-page-title">Built <em>from</em> Africa, <em>for</em> Africa.</h1>
        <p className="mk-body-lg">SolAI is headquartered in Kigali, Rwanda. We understand the infrastructure, the payment rails, the languages, and the opportunity.</p>
      </section>

      <section className="mk-section">
        <div className="mk-africa-grid">
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="creditCard" size={28}/></div>
            <h3>Payment rails that work here</h3>
            <p>MTN MoMo, Airtel Money, Flutterwave, Paystack — alongside Stripe for international cards. Your rural customer in Musanze pays the same way your diaspora customer in London does.</p>
            <div className="mk-africa-rails">
              {['MTN MoMo','Airtel Money','Flutterwave','Paystack','Stripe'].map(r => (
                <span key={r} className="mk-rail-badge">{r}</span>
              ))}
            </div>
          </div>
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="messageCircle" size={28}/></div>
            <h3>WhatsApp-first commerce</h3>
            <p>In East and West Africa, WhatsApp is the store. SolAI's Sales Agent qualifies, negotiates, and closes in WhatsApp — generating MoMo or Airtel payment links right in the chat.</p>
          </div>
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="globe" size={28}/></div>
            <h3>Four languages at launch</h3>
            <p>English, French, Kinyarwanda, and Swahili. The Sales Agent converses in the customer's language. The dashboard adapts to the seller's preference.</p>
            <div className="mk-lang-toggle">
              {[{code:'en',label:'English'},{code:'fr',label:'Français'},{code:'rw',label:'Ikinyarwanda'},{code:'sw',label:'Kiswahili'}].map(l => (
                <span key={l.code} className="mk-lang-chip">{l.label}</span>
              ))}
            </div>
          </div>
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="smartphone" size={28}/></div>
            <h3>Built for mid-tier Android</h3>
            <p>Every screen works at 375px on slow 3G. Skeleton loading, optimistic UI, minimal JS. Your seller in Nairobi gets the same experience as one in New York.</p>
          </div>
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="shield" size={28}/></div>
            <h3>Data stays in Africa</h3>
            <p>AWS af-south-1 (Cape Town). Compliant with Rwanda's Data Protection Law, POPIA, and GDPR. 72-hour breach notification. NCSA registered.</p>
          </div>
          <div className="mk-africa-card">
            <div className="mk-africa-icon"><MkIcon name="users" size={28}/></div>
            <h3>Sellers across the continent</h3>
            <p>From Kigali to Lagos, Cape Town to Dakar — SolAI supports RWF, KES, NGN, ZAR, XOF, and EUR with zero-decimal handling done right.</p>
          </div>
        </div>
      </section>

      <section className="mk-section mk-section-surface">
        <div className="mk-stats-row">
          <StatBlock value="🇷🇼" label="Headquartered in Kigali"/>
          <StatBlock value="4" label="Languages at launch"/>
          <StatBlock value="5+" label="Payment rails"/>
          <StatBlock value="af-south-1" label="Data residency"/>
        </div>
      </section>
    </div>
  );
}


/* ═══════════════════════════════════════
   SCREEN 5: DEMO / CONTACT + LEGAL
   ═══════════════════════════════════════ */
function DemoScreen() {
  const [sent, setSent] = React.useState(false);
  return (
    <div className="mk-page">
      <section className="mk-page-header">
        <SectionLabel>Contact</SectionLabel>
        <h1 className="mk-page-title">Let's talk about your growth.</h1>
        <p className="mk-body-lg">Book a demo, ask a question, or start building immediately.</p>
      </section>

      <section className="mk-section">
        <div className="mk-contact-grid">
          <div className="mk-contact-form-wrap">
            {!sent ? (
              <form className="mk-contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <h3>Request a demo</h3>
                <div className="mk-form-row">
                  <div className="mk-form-field">
                    <label>Full name</label>
                    <input type="text" placeholder="Kalisa Mugisha" required/>
                  </div>
                  <div className="mk-form-field">
                    <label>Email</label>
                    <input type="email" placeholder="kalisa@inema.rw" required/>
                  </div>
                </div>
                <div className="mk-form-field">
                  <label>Company</label>
                  <input type="text" placeholder="Inema Boutique"/>
                </div>
                <div className="mk-form-row">
                  <div className="mk-form-field">
                    <label>Monthly ad spend</label>
                    <select>
                      <option>Under US$ 1,000</option>
                      <option>US$ 1,000 – 5,000</option>
                      <option>US$ 5,000 – 20,000</option>
                      <option>US$ 20,000+</option>
                    </select>
                  </div>
                  <div className="mk-form-field">
                    <label>Platform</label>
                    <select>
                      <option>Shopify</option>
                      <option>WooCommerce</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="mk-form-field">
                  <label>Anything we should know?</label>
                  <textarea rows={3} placeholder="Tell us about your products, target market, or questions..."></textarea>
                </div>
                <button type="submit" className="mk-btn-cta" style={{width:'100%',justifyContent:'center'}}>
                  <MkIcon name="send" size={16}/> Send request
                </button>
              </form>
            ) : (
              <div className="mk-contact-success">
                <div className="mk-success-icon"><MkIcon name="check" size={32}/></div>
                <h3>We'll be in touch within 24 hours.</h3>
                <p>Check your inbox for a confirmation. In the meantime, you can start a free account immediately.</p>
                <a href="#" className="mk-btn-cta">Start free now</a>
              </div>
            )}
          </div>
          <div className="mk-contact-info">
            <h3>Other ways to reach us</h3>
            <div className="mk-contact-method">
              <MkIcon name="send" size={18}/>
              <div><strong>Email</strong><br/>hello@solai.digisi.rw</div>
            </div>
            <div className="mk-contact-method">
              <MkIcon name="messageCircle" size={18}/>
              <div><strong>WhatsApp</strong><br/>+250 788 000 000</div>
            </div>
            <div className="mk-contact-method">
              <MkIcon name="globe" size={18}/>
              <div><strong>Office</strong><br/>Kigali Innovation City, KG 7 Ave, Kigali, Rwanda</div>
            </div>
            <div className="mk-legal-links">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">GDPR Notice</a>
              <a href="#">Rwanda DPL Statement</a>
              <a href="#">POPIA Compliance</a>
              <a href="#">Sub-Processor Register</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


window.LandingScreen = LandingScreen;
window.FeaturesScreen = FeaturesScreen;
window.PricingScreen = PricingScreen;
window.AfricaScreen = AfricaScreen;
window.DemoScreen = DemoScreen;
