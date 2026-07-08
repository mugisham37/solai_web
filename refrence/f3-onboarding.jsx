/* SolAI Flow 3 — Onboarding Wizard Screens */

/* ── Shared icon helper ── */
function OIcon({name, size=20}) {
  const p = {
    check: <polyline points="20 6 9 17 4 12"/>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    store: <><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><rect width="20" height="5" x="2" y="7"/></>,
    creditCard: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    messageCircle: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{p[name]||p.info}</svg>;
}

/* ── Stepper ── */
function OnboardingStepper({steps, current}) {
  return (
    <div className="ob-stepper">
      {steps.map((s,i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending';
        return (
          <div key={i} className={`ob-step ob-step-${state}`}>
            <div className="ob-step-line-before"></div>
            <div className="ob-step-circle">
              {state === 'done' ? <OIcon name="check" size={14}/> : <span>{i+1}</span>}
            </div>
            <div className="ob-step-line-after"></div>
            <span className="ob-step-label">{s}</span>
          </div>
        );
      })}
    </div>
  );
}

const STEPS = ['Welcome','Connections','Payments','Product & Budget','Review & Launch'];

/* ── Shared Layout ── */
function OnboardingLayout({step, children, onNext, onBack, nextLabel, nextDisabled, showSave}) {
  return (
    <div className="ob-layout">
      <div className="ob-header">
        <a href="#" className="ob-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2"/><circle cx="14" cy="14" r="5" fill="var(--brand)"/></svg>
          <span>SolAI</span>
        </a>
        <OnboardingStepper steps={STEPS} current={step}/>
        {showSave !== false && <button className="ob-save-btn">Save & exit</button>}
      </div>
      <main className="ob-main">
        <div className="ob-content">{children}</div>
      </main>
      <div className="ob-footer">
        {step > 0 ? (
          <button className="ob-btn ob-btn-ghost" onClick={onBack}><OIcon name="arrowLeft" size={16}/> Back</button>
        ) : <div/>}
        <button className="ob-btn ob-btn-primary" onClick={onNext} disabled={nextDisabled}>
          {nextLabel || 'Continue'} <OIcon name="arrowRight" size={16}/>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STEP 0: WELCOME
   ════════════════════════════════════════ */
function WelcomeStep({onNext}) {
  return (
    <OnboardingLayout step={0} onNext={onNext} nextLabel="Let's go" showSave={false}>
      <div className="ob-welcome">
        <div className="ob-welcome-icon"><OIcon name="rocket" size={40}/></div>
        <h1 className="ob-title">Welcome to SolAI</h1>
        <p className="ob-subtitle">You're about 5 minutes away from your first autonomous campaign. Here's what we'll set up:</p>
        <div className="ob-welcome-cards">
          {[
            {icon:'link', title:'Connect your store & ad accounts', desc:'OAuth into Shopify or WooCommerce, then link Meta and Google Ads.'},
            {icon:'creditCard', title:'Set up payment rails', desc:'Connect Stripe and/or Mobile Money so customers can pay.'},
            {icon:'target', title:'Describe your product & audience', desc:'Tell SolAI what you sell, who buys it, and your daily budget.'},
            {icon:'rocket', title:'Review & launch', desc:'Confirm everything, agree to spend caps, and let SolAI build your first campaign.'},
          ].map((c,i) => (
            <div key={i} className="ob-welcome-card">
              <div className="ob-welcome-card-icon"><OIcon name={c.icon} size={22}/></div>
              <div>
                <strong>{c.title}</strong>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="ob-welcome-trust">
          <div className="ob-trust-item"><OIcon name="shield" size={16}/> Hard spend caps — SolAI can never exceed your limit</div>
          <div className="ob-trust-item"><OIcon name="zap" size={16}/> Every decision explained with a "Why?" button</div>
          <div className="ob-trust-item"><OIcon name="globe" size={16}/> Data stored in AWS af-south-1 (Cape Town)</div>
        </div>
      </div>
    </OnboardingLayout>
  );
}

/* ════════════════════════════════════════
   STEP 1: CONNECT ACCOUNTS
   ════════════════════════════════════════ */
function ConnectionsStep({onNext, onBack}) {
  const [connections, setConnections] = React.useState({
    shopify: 'connected', woo: 'idle', meta: 'connected', google: 'idle', whatsapp: 'connected'
  });

  const toggle = (key) => {
    setConnections(c => ({...c, [key]: c[key]==='connected'?'idle':'connected'}));
  };

  const items = [
    {key:'shopify', icon:'store', label:'Shopify', desc:'Import products and sync orders', category:'Commerce'},
    {key:'woo', icon:'store', label:'WooCommerce', desc:'Import products via REST API', category:'Commerce'},
    {key:'meta', icon:'users', label:'Meta (Facebook + Instagram)', desc:'Run ads, manage DMs', category:'Ads & Chat'},
    {key:'google', icon:'target', label:'Google Ads', desc:'Search and display campaigns', category:'Ads & Chat'},
    {key:'whatsapp', icon:'messageCircle', label:'WhatsApp Business', desc:'Conversational sales and support', category:'Ads & Chat'},
  ];

  const categories = [...new Set(items.map(i=>i.category))];

  return (
    <OnboardingLayout step={1} onNext={onNext} onBack={onBack} nextLabel="Continue">
      <h1 className="ob-title">Connect your accounts</h1>
      <p className="ob-subtitle">Link your store and ad platforms. SolAI uses OAuth — we never see your passwords.</p>

      {categories.map(cat => (
        <div key={cat} className="ob-connect-section">
          <h3 className="ob-section-label">{cat}</h3>
          <div className="ob-connect-list">
            {items.filter(i=>i.category===cat).map(item => (
              <div key={item.key} className={`ob-connect-item ${connections[item.key]==='connected'?'ob-connected':''}`}>
                <div className="ob-connect-icon"><OIcon name={item.icon} size={22}/></div>
                <div className="ob-connect-info">
                  <strong>{item.label}</strong>
                  <p>{item.desc}</p>
                  {connections[item.key]==='connected' && (
                    <div className="ob-connect-status">
                      <span className="ob-status-dot ob-dot-success"></span>
                      {item.key === 'shopify' && 'Connected as Inema Boutique'}
                      {item.key === 'meta' && 'Connected as Inema Boutique · Ad Account #1847293'}
                      {item.key === 'whatsapp' && 'Connected · +250 788 123 456'}
                      {!['shopify','meta','whatsapp'].includes(item.key) && 'Connected'}
                    </div>
                  )}
                </div>
                <button className={`ob-btn ${connections[item.key]==='connected'?'ob-btn-connected':'ob-btn-connect'}`} onClick={()=>toggle(item.key)}>
                  {connections[item.key]==='connected' ? <><OIcon name="check" size={14}/> Connected</> : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="ob-info-banner">
        <OIcon name="info" size={16}/>
        <span>You can connect more platforms later in Settings → Integrations.</span>
      </div>
    </OnboardingLayout>
  );
}

/* ════════════════════════════════════════
   STEP 2: PAYMENT RAILS
   ════════════════════════════════════════ */
function PaymentsStep({onNext, onBack}) {
  const [rails, setRails] = React.useState({stripe:true, momo:true, airtel:false, flutterwave:false});

  return (
    <OnboardingLayout step={2} onNext={onNext} onBack={onBack}>
      <h1 className="ob-title">Set up payment rails</h1>
      <p className="ob-subtitle">Choose how your customers will pay. You can enable multiple rails — SolAI's Sales Agent will offer the best option based on the buyer's location.</p>

      <div className="ob-rails-grid">
        {[
          {key:'stripe', label:'Stripe', desc:'Cards, Apple Pay, Google Pay. International customers.', tag:'International', connected:true, detail:'Connected · Inema Boutique · acct_1N…7xQ'},
          {key:'momo', label:'MTN Mobile Money', desc:'MoMo payments for Rwanda, Uganda, Ghana, Cameroon.', tag:'East & West Africa', connected:true, detail:'Connected · Merchant ID: MM-2847'},
          {key:'airtel', label:'Airtel Money', desc:'Airtel Money for Kenya, Uganda, Tanzania, Malawi.', tag:'East Africa', connected:false, detail:null},
          {key:'flutterwave', label:'Flutterwave', desc:'Cards + bank transfer + USSD. Nigeria, Ghana, South Africa.', tag:'Pan-Africa', connected:false, detail:null},
        ].map(r => (
          <div key={r.key} className={`ob-rail-card ${rails[r.key]?'ob-rail-active':''}`}>
            <div className="ob-rail-header">
              <div>
                <strong>{r.label}</strong>
                <span className="ob-rail-tag">{r.tag}</span>
              </div>
              <button className={`ob-switch ${rails[r.key]?'ob-switch-on':''}`} role="switch" aria-checked={rails[r.key]}
                onClick={()=>setRails({...rails,[r.key]:!rails[r.key]})}>
                <span className="ob-switch-thumb"/>
              </button>
            </div>
            <p>{r.desc}</p>
            {rails[r.key] && r.detail && (
              <div className="ob-rail-connected"><span className="ob-status-dot ob-dot-success"/>{r.detail}</div>
            )}
            {rails[r.key] && !r.detail && (
              <button className="ob-btn ob-btn-connect" style={{marginTop:8}}>Connect {r.label}</button>
            )}
          </div>
        ))}
      </div>

      <div className="ob-info-banner">
        <OIcon name="info" size={16}/>
        <span>MoMo and Airtel settlements take ~24 hours. SolAI shows settlement status in the Orders view.</span>
      </div>
    </OnboardingLayout>
  );
}

/* ════════════════════════════════════════
   STEP 3: PRODUCT, AUDIENCE & BUDGET
   ════════════════════════════════════════ */
function ProductBudgetStep({onNext, onBack}) {
  const [dailyCap, setDailyCap] = React.useState(500);
  const [totalCap, setTotalCap] = React.useState(5000);
  const [currency, setCurrency] = React.useState('US$');
  const rates = {'US$':1,'RWF':1350,'KES':153,'EUR':0.92};
  const fmt = (v) => {
    const converted = v * rates[currency];
    const isZero = ['RWF','KES'].includes(currency);
    return currency + ' ' + (isZero ? Math.round(converted).toLocaleString() : converted.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
  };

  return (
    <OnboardingLayout step={3} onNext={onNext} onBack={onBack}>
      <h1 className="ob-title">Product, audience & budget</h1>
      <p className="ob-subtitle">Tell SolAI what you're selling and how much you want to spend.</p>

      <div className="ob-product-section">
        <h3 className="ob-section-label">Product</h3>
        <div className="ob-field">
          <label>Product name</label>
          <input className="ob-input" type="text" defaultValue="Ankara Print Tee — Indigo"/>
        </div>
        <div className="ob-field">
          <label>Description</label>
          <textarea className="ob-input ob-textarea" rows={3} defaultValue="Hand-cut Ankara wax-print t-shirt in indigo colourway. 100% cotton. Sizes XS–3XL. Made in Kigali."/>
        </div>
        <div className="ob-field-row">
          <div className="ob-field">
            <label>Price</label>
            <div className="ob-input-group">
              <select className="ob-currency-select" value={currency} onChange={e=>setCurrency(e.target.value)}>
                {Object.keys(rates).map(c=><option key={c}>{c}</option>)}
              </select>
              <input className="ob-input" type="text" defaultValue="35.00" style={{fontFamily:"'JetBrains Mono',monospace"}}/>
            </div>
          </div>
          <div className="ob-field">
            <label>Product URL</label>
            <input className="ob-input" type="url" defaultValue="https://inema.rw/products/ankara-tee-indigo"/>
          </div>
        </div>
        <div className="ob-field">
          <label>Product images</label>
          <div className="ob-upload-zone">
            <OIcon name="upload" size={24}/>
            <p>Drag images here or <button className="ob-link-btn">browse</button></p>
            <span>Recommended: 3–5 images, 1080×1080px minimum</span>
          </div>
        </div>
      </div>

      <div className="ob-product-section">
        <h3 className="ob-section-label">Target Audience</h3>
        <div className="ob-field">
          <label>Describe your ideal customer</label>
          <textarea className="ob-input ob-textarea" rows={3} defaultValue="Women 25-45 in East Africa interested in artisan fashion, handmade goods, and African print clothing. Also diaspora communities in Europe and North America."/>
        </div>
        <div className="ob-field-row">
          <div className="ob-field">
            <label>Primary regions</label>
            <div className="ob-tag-input">
              {['Rwanda','Kenya','South Africa','EU (diaspora)'].map(t => (
                <span key={t} className="ob-tag">{t} <button className="ob-tag-x"><OIcon name="x" size={10}/></button></span>
              ))}
            </div>
          </div>
          <div className="ob-field">
            <label>Languages</label>
            <div className="ob-tag-input">
              {['English','French','Kinyarwanda'].map(t => (
                <span key={t} className="ob-tag">{t} <button className="ob-tag-x"><OIcon name="x" size={10}/></button></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ob-product-section">
        <h3 className="ob-section-label">Budget</h3>
        <p className="ob-hint">Hard caps — SolAI will never spend beyond these limits.</p>

        <div className="ob-budget-controls">
          <div className="ob-budget-card">
            <div className="ob-budget-header">
              <span>Daily spend cap</span>
              <span className="ob-budget-value">{fmt(dailyCap)}</span>
            </div>
            <input type="range" className="ob-range" min={10} max={2000} step={10} value={dailyCap} onChange={e=>setDailyCap(+e.target.value)}/>
            <div className="ob-range-labels"><span>{fmt(10)}</span><span>{fmt(2000)}</span></div>
          </div>
          <div className="ob-budget-card">
            <div className="ob-budget-header">
              <span>Total campaign cap</span>
              <span className="ob-budget-value">{fmt(totalCap)}</span>
            </div>
            <input type="range" className="ob-range" min={100} max={50000} step={100} value={totalCap} onChange={e=>setTotalCap(+e.target.value)}/>
            <div className="ob-range-labels"><span>{fmt(100)}</span><span>{fmt(50000)}</span></div>
          </div>
        </div>

        <div className="ob-budget-preview">
          <OIcon name="shield" size={16}/>
          <div>
            <strong>At {fmt(dailyCap)}/day, your budget runs for {Math.ceil(totalCap/dailyCap)} days.</strong>
            <p>SolAI enforces hard limits at Swarm, Agent, and Task levels. The circuit breaker trips if per-minute spend exceeds 3× your baseline.</p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}

/* ════════════════════════════════════════
   STEP 4: REVIEW & LAUNCH
   ════════════════════════════════════════ */
function ReviewLaunchStep({onBack}) {
  const [agreed, setAgreed] = React.useState(false);
  const [launched, setLaunched] = React.useState(false);

  if (launched) {
    return (
      <OnboardingLayout step={4} onNext={()=>{}} nextLabel="Go to dashboard" showSave={false}>
        <div className="ob-launch-success">
          <div className="ob-launch-icon"><OIcon name="rocket" size={48}/></div>
          <h1 className="ob-title">You're live!</h1>
          <p className="ob-subtitle">SolAI is building your first campaign now. Your first ads will appear within 30 minutes.</p>
          <div className="ob-launch-timeline">
            {[
              {time:'Now', msg:'Campaign Planner is researching audiences and splitting budget.'},
              {time:'~5 min', msg:'Creative Generator produces 3 ad variants for Meta.'},
              {time:'~15 min', msg:'Ads submitted to Meta for review.'},
              {time:'~30 min', msg:'First impressions start delivering.'},
              {time:'Ongoing', msg:'Real-time Optimizer checks performance every 15 minutes.'},
            ].map((t,i) => (
              <div key={i} className="ob-timeline-row">
                <span className="ob-timeline-time">{t.time}</span>
                <div className={`ob-timeline-dot ${i===0?'ob-dot-active':''}`}/>
                <span>{t.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout step={4} onBack={onBack} onNext={()=>setLaunched(true)} nextLabel="Launch campaign" nextDisabled={!agreed}>
      <h1 className="ob-title">Review & launch</h1>
      <p className="ob-subtitle">Confirm everything looks right before SolAI starts working.</p>

      <div className="ob-review-sections">
        <div className="ob-review-card">
          <div className="ob-review-header"><h4>Connections</h4><button className="ob-edit-btn">Edit</button></div>
          <div className="ob-review-rows">
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-success"/><span>Shopify — Inema Boutique</span></div>
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-success"/><span>Meta — Ad Account #1847293</span></div>
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-success"/><span>WhatsApp — +250 788 123 456</span></div>
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-idle"/><span>Google Ads — Not connected</span></div>
          </div>
        </div>

        <div className="ob-review-card">
          <div className="ob-review-header"><h4>Payment Rails</h4><button className="ob-edit-btn">Edit</button></div>
          <div className="ob-review-rows">
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-success"/><span>Stripe — acct_1N…7xQ</span></div>
            <div className="ob-review-row"><span className="ob-status-dot ob-dot-success"/><span>MTN MoMo — MM-2847</span></div>
          </div>
        </div>

        <div className="ob-review-card">
          <div className="ob-review-header"><h4>Product</h4><button className="ob-edit-btn">Edit</button></div>
          <div className="ob-review-detail">
            <strong>Ankara Print Tee — Indigo</strong>
            <p>US$ 35.00 · Hand-cut Ankara wax-print t-shirt in indigo colourway.</p>
            <p className="ob-review-meta">Target: Women 25-45 in East Africa + EU diaspora · EN, FR, RW</p>
          </div>
        </div>

        <div className="ob-review-card">
          <div className="ob-review-header"><h4>Budget</h4><button className="ob-edit-btn">Edit</button></div>
          <div className="ob-review-budget">
            <div className="ob-budget-stat"><span>Daily cap</span><strong>US$ 500.00</strong></div>
            <div className="ob-budget-stat"><span>Total cap</span><strong>US$ 5,000.00</strong></div>
            <div className="ob-budget-stat"><span>Duration</span><strong>~10 days</strong></div>
          </div>
        </div>
      </div>

      <div className="ob-consent-block">
        <label className="ob-consent-row" onClick={()=>setAgreed(!agreed)}>
          <span className={`ob-check ${agreed?'ob-check-on':''}`}>
            {agreed && <OIcon name="check" size={12}/>}
          </span>
          <span>
            I authorise SolAI to spend up to <strong>US$ 500.00/day</strong> (max <strong>US$ 5,000.00</strong> total) on my linked Meta ad account. I understand this is a <strong>hard cap</strong> that cannot be exceeded. I have read the <a href="#">Terms of Service</a> and <a href="#">Data Processing Agreement</a>.
          </span>
        </label>
      </div>
    </OnboardingLayout>
  );
}


window.OIcon = OIcon;
window.OnboardingStepper = OnboardingStepper;
window.OnboardingLayout = OnboardingLayout;
window.WelcomeStep = WelcomeStep;
window.ConnectionsStep = ConnectionsStep;
window.PaymentsStep = PaymentsStep;
window.ProductBudgetStep = ProductBudgetStep;
window.ReviewLaunchStep = ReviewLaunchStep;
