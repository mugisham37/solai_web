/* SolAI Design System — Custom SolAI Components */

/* ── WhyPopover ── */
function WhyPopover({ open, onClose, children, trigger }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <span style={{position:'relative', display:'inline-flex'}}>
      {trigger}
      {open && (
        <div ref={ref} className="ds-why-popover" role="dialog" aria-label="Decision explanation">
          <div className="ds-why-popover-header">
            <span className="ds-why-popover-title">Why this decision?</span>
            <button onClick={onClose} className="ds-why-popover-close" aria-label="Close"><Icon name="x" size={16}/></button>
          </div>
          {children}
        </div>
      )}
    </span>
  );
}

function WhyPopoverDemo() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(true);
  return (
    <div>
      <h3 className="ds-section-title">WhyPopover</h3>
      <p className="ds-body-muted">The product's signature component. Attached to every auto-decided number, action, or row. Focus-trapped, Escape to close, keyboard-reachable.</p>
      <div style={{display:'flex', gap:40, marginTop:20, flexWrap:'wrap'}}>
        <div>
          <p className="ds-label">Closed state</p>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
            <span className="ds-kpi-value" style={{fontSize:28}}>US$ 4,231.45</span>
            <WhyPopover open={open1} onClose={()=>setOpen1(false)}
              trigger={<button className="ds-why-trigger" onClick={()=>setOpen1(!open1)}>Why?</button>}
            >
              <p className="ds-why-headline">Increased Instagram Reels budget by 15%</p>
              <ul className="ds-why-inputs">
                <li>CPA tracking 18% under target (US$ 8.45 vs US$ 12.00)</li>
                <li>CTR on Reels 3.2% — 1.8× above Feed average</li>
                <li>7-day ROAS 3.8x — highest across all ad sets</li>
              </ul>
              <div className="ds-why-meta">
                <span className="ds-why-agent">Real-time Optimizer</span>
                <code className="ds-mono-sm">run_7f3a…e91c</code>
              </div>
              <a href="#" className="ds-why-link">Open full decision <Icon name="arrowRight" size={14}/></a>
            </WhyPopover>
          </div>
        </div>
        <div style={{minWidth:320}}>
          <p className="ds-label">Open state (default)</p>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
            <span className="ds-kpi-value" style={{fontSize:28}}>RWF 1,250,000</span>
            <WhyPopover open={open2} onClose={()=>setOpen2(false)}
              trigger={<button className="ds-why-trigger" onClick={()=>setOpen2(!open2)}>Why?</button>}
            >
              <p className="ds-why-headline">Closed sale via WhatsApp · MTN MoMo</p>
              <ul className="ds-why-inputs">
                <li>Lead qualified in 4 messages (size + colour confirmed)</li>
                <li>MoMo chosen — buyer in Kigali, Rwanda</li>
                <li>Payment confirmed via webhook in 12 seconds</li>
              </ul>
              <div className="ds-why-meta">
                <span className="ds-why-agent">Sales Agent (Opus)</span>
                <code className="ds-mono-sm">run_a2b4…f703</code>
                <button className="ds-copy-btn" title="Copy run ID"><Icon name="copy" size={13}/></button>
              </div>
              <a href="#" className="ds-why-link">Open full decision <Icon name="arrowRight" size={14}/></a>
            </WhyPopover>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MoneyDisplay ── */
function MoneyDisplay({ currency, amount, cap, tag, size='md' }) {
  const isZeroDecimal = ['RWF','KES','NGN','KRW','JPY','XOF'].includes(currency);
  const formatted = isZeroDecimal
    ? Number(amount).toLocaleString('en-US', {maximumFractionDigits:0})
    : Number(amount).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
  const parts = formatted.split('.');
  const sz = size === 'lg' ? 28 : size === 'sm' ? 14 : 18;

  return (
    <span className="ds-money" style={{fontSize:sz}}>
      {tag && <span className="ds-money-tag">{tag} · </span>}
      <span className="ds-money-currency">{currency}</span>{' '}
      <span className="ds-money-integer">{parts[0]}</span>
      {parts[1] && <span className="ds-money-decimal">.{parts[1]}</span>}
      {cap && <span className="ds-money-cap"> / {typeof cap === 'number' ? Number(cap).toLocaleString('en-US') : cap} cap</span>}
    </span>
  );
}

function MoneyDisplayDemo() {
  return (
    <div>
      <h3 className="ds-section-title">MoneyDisplay</h3>
      <p className="ds-body-muted">Tabular numerals. Currency code subtle. No fake .00 on zero-decimal currencies. Optional cap suffix and payment-rail tag.</p>
      <div style={{display:'flex', flexDirection:'column', gap:12, marginTop:16}}>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">Standard (USD)</span>
          <MoneyDisplay currency="US$" amount={4231.45} />
        </div>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">With cap</span>
          <MoneyDisplay currency="US$" amount={4231.45} cap={10000} />
        </div>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">Zero-decimal (RWF)</span>
          <MoneyDisplay currency="RWF" amount={1250000} />
        </div>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">MoMo tagged</span>
          <MoneyDisplay currency="RWF" amount={24500} tag="MoMo" />
        </div>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">Large</span>
          <MoneyDisplay currency="US$" amount={18420} size="lg" />
        </div>
        <div className="ds-card" style={{padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <span className="ds-caption">African currencies</span>
          <div style={{display:'flex', gap:24}}>
            <MoneyDisplay currency="KES" amount={45200} size="sm" />
            <MoneyDisplay currency="NGN" amount={890000} size="sm" />
            <MoneyDisplay currency="ZAR" amount={1523.80} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AgentActivityRow ── */
const AGENTS = [
  {id:'planner', name:'Campaign Planner', avatar:'📊', task:'Researching Meta audiences for "Ankara Print Tee"', runtime:'4m 12s', lastDecision:'2 min ago', health:'running', color:'var(--brand)'},
  {id:'creative', name:'Creative Generator', avatar:'🎨', task:'Generating 3 Reels variants', runtime:'1m 45s', lastDecision:'8 min ago', health:'running', color:'var(--info)'},
  {id:'monitor', name:'Real-time Optimizer', avatar:'📈', task:'Idle — next tick in 11 min', runtime:'—', lastDecision:'4 min ago', health:'idle', color:'var(--success)'},
  {id:'sales', name:'Sales Agent', avatar:'💬', task:'Qualifying lead: Kalisa Mugisha (WhatsApp)', runtime:'32s', lastDecision:'1 min ago', health:'running', color:'var(--warning)'},
  {id:'handoff', name:'Order Handoff', avatar:'📦', task:'Paused — no pending orders', runtime:'—', lastDecision:'1h ago', health:'paused', color:'var(--text-subtle)'},
];

function AgentActivityRow({agent}) {
  const healthColors = {running:'var(--success)', idle:'var(--info)', paused:'var(--text-subtle)', errored:'var(--danger)'};
  return (
    <tr className="ds-agent-row">
      <td>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div className="ds-agent-avatar" style={{background:agent.color+'18', color:agent.color, borderColor:agent.color+'44'}}>{agent.avatar}</div>
          <span style={{fontWeight:500, color:'var(--text)'}}>{agent.name}</span>
        </div>
      </td>
      <td style={{color:'var(--text-muted)', maxWidth:280}}>{agent.task}</td>
      <td><code className="ds-mono-sm">{agent.runtime}</code></td>
      <td><span className="ds-caption">{agent.lastDecision}</span></td>
      <td>
        <span className="ds-badge" style={{background:healthColors[agent.health]+'18', color:healthColors[agent.health]}}>
          <span className="ds-badge-dot" style={{background:healthColors[agent.health]}}/>
          {agent.health.charAt(0).toUpperCase()+agent.health.slice(1)}
        </span>
      </td>
      <td><button className="ds-why-trigger">Why?</button></td>
    </tr>
  );
}

function AgentActivityDemo() {
  return (
    <div>
      <h3 className="ds-section-title">AgentActivityRow</h3>
      <p className="ds-body-muted">Live status row for each of the 5 agents. Used on dashboard, safety centre, and audit timeline.</p>
      <div style={{overflowX:'auto', marginTop:16}}>
        <table className="ds-table">
          <thead>
            <tr><th>Agent</th><th>Current Task</th><th>Runtime</th><th>Last Decision</th><th>Health</th><th></th></tr>
          </thead>
          <tbody>
            {AGENTS.map(a => <AgentActivityRow key={a.id} agent={a}/>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── BudgetEnvelopeBar ── */
function BudgetBar({label, spent, cap, currency, level}) {
  const pct = Math.min((spent/cap)*100, 100);
  const state = pct >= 100 ? 'reached' : pct >= 80 ? 'approaching' : 'inside';
  const color = state==='reached'?'var(--danger)':state==='approaching'?'var(--warning)':'var(--success)';
  const stateLabel = state==='reached'?'Cap reached — paused':state==='approaching'?'Approaching cap':'Inside cap';
  const isZeroDecimal = ['RWF','KES','NGN','XOF'].includes(currency);
  const fmt = (n) => isZeroDecimal ? Number(n).toLocaleString('en-US',{maximumFractionDigits:0}) : Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

  return (
    <div className="ds-envelope-row" style={{paddingLeft: level*20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <span style={{fontWeight:500, color:'var(--text)', fontSize:14}}>{label}</span>
          <span className="ds-badge" style={{background:color+'18', color:color, fontSize:11}}>
            <span className="ds-badge-dot" style={{background:color}}/>{stateLabel}
          </span>
        </div>
        <span className="ds-money" style={{fontSize:14}}>
          <span className="ds-money-currency">{currency}</span>{' '}
          <span className="ds-money-integer">{fmt(spent)}</span>
          <span className="ds-money-cap"> / {fmt(cap)}</span>
        </span>
      </div>
      <div className="ds-progress" style={{height:8}}>
        <div className="ds-progress-bar" style={{width:pct+'%', background:color, transition:'width 300ms ease'}}/>
      </div>
    </div>
  );
}

function BudgetEnvelopeDemo() {
  return (
    <div>
      <h3 className="ds-section-title">BudgetEnvelopeBar</h3>
      <p className="ds-body-muted">Three-tier nested budget visualisation: Swarm → Agent → Task. Colour by cap state.</p>
      <div className="ds-card" style={{padding:20, marginTop:16, display:'flex', flexDirection:'column', gap:16}}>
        <BudgetBar label="Swarm Envelope (Daily)" spent={425} cap={500} currency="US$" level={0}/>
        <BudgetBar label="Execution Agent" spent={255} cap={300} currency="US$" level={1}/>
        <BudgetBar label="Sales Agent" spent={85} cap={100} currency="US$" level={1}/>
        <BudgetBar label="Monitor Agent" spent={12} cap={25} currency="US$" level={1}/>
        <BudgetBar label="Creative Agent" spent={73} cap={75} currency="US$" level={1}/>
        <div style={{borderTop:'1px solid var(--border)', paddingTop:16}}>
          <BudgetBar label="Task: Ankara Print Tee Campaign" spent={500} cap={500} currency="US$" level={2}/>
        </div>
      </div>
    </div>
  );
}

/* ── ConsentBanner ── */
function ConsentBanner({region}) {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;

  const content = {
    EU: { title:'Cookie & Data Preferences', subtitle:'GDPR — European Union', toggles:['Functional (required)','Analytics','Marketing'], note:'You can change these at any time in Settings → Privacy.' },
    RW: { title:'Data Processing Consent', subtitle:'Rwanda Law N° 058/2021', toggles:['Data processing (required)','Marketing communications'], note:'Your data is stored in AWS af-south-1 (Cape Town). NCSA registration: DPR/2026/0847.' },
    ZA: { title:'Information Processing Notice', subtitle:'POPIA — South Africa', toggles:['Processing for service delivery (required)','Direct marketing'], note:'You may withdraw consent at any time. Purpose: autonomous ad management and conversational sales.' },
  };
  const c = content[region] || content.EU;

  return (
    <div className="ds-consent-banner">
      <div className="ds-consent-header">
        <div>
          <h4 style={{margin:0, color:'var(--text)', fontSize:15, fontWeight:600}}>{c.title}</h4>
          <span className="ds-mono-sm" style={{color:'var(--brand)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>{c.subtitle}</span>
        </div>
      </div>
      <div className="ds-consent-toggles">
        {c.toggles.map((t,i) => (
          <label key={t} className="ds-switch-label" style={{fontSize:13}}>
            <button role="switch" aria-checked={i===0} className={`ds-switch ds-switch-sm ${i===0?'ds-switch-on':''}`} disabled={i===0}>
              <span className="ds-switch-thumb"/>
            </button>
            {t}
          </label>
        ))}
      </div>
      <p className="ds-caption" style={{margin:'8px 0'}}>{c.note}</p>
      <div style={{display:'flex', gap:8, marginTop:4}}>
        {region==='EU' && <button className="ds-btn ds-btn-secondary ds-btn-sm">Reject all</button>}
        <button className="ds-btn ds-btn-primary ds-btn-sm" onClick={()=>setVisible(false)}>Accept{region==='EU'?' all':''}</button>
        <button className="ds-btn ds-btn-ghost ds-btn-sm">Export proof (JSON-LD)</button>
      </div>
    </div>
  );
}

function ConsentBannerDemo() {
  return (
    <div>
      <h3 className="ds-section-title">ConsentBanner</h3>
      <p className="ds-body-muted">Region-aware consent capture. GDPR (EU), Rwanda DPL (RW), POPIA (ZA). Always offers proof export.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginTop:16}}>
        <div><p className="ds-label">EU (GDPR)</p><ConsentBanner region="EU"/></div>
        <div><p className="ds-label">Rwanda (DPL)</p><ConsentBanner region="RW"/></div>
        <div><p className="ds-label">South Africa (POPIA)</p><ConsentBanner region="ZA"/></div>
      </div>
    </div>
  );
}

/* ── DataTable ── */
function DataTableDemo() {
  const rows = [
    {name:'Ankara Print Tee — Indigo', platform:'Meta', status:'Live', spend:1245.80, roas:'3.8x', cpa:6.20, ctr:'3.2%'},
    {name:'Igisabo Ceramic Pour-Over', platform:'Google', status:'Learning', spend:320.00, roas:'1.2x', cpa:14.50, ctr:'1.8%'},
    {name:'Kigali Honey 250g', platform:'Meta', status:'Paused', spend:890.45, roas:'2.1x', cpa:9.80, ctr:'2.4%'},
    {name:'Cape Threads Linen Shirt', platform:'Meta + Google', status:'Live', spend:2100.00, roas:'4.2x', cpa:5.10, ctr:'3.8%'},
  ];
  const statusColor = {Live:'var(--success)',Learning:'var(--warning)',Paused:'var(--danger)'};
  return (
    <div>
      <h3 className="ds-section-title">DataTable</h3>
      <p className="ds-body-muted">Sticky header, sortable, status pills, MoneyDisplay, WhyPopover trigger per row.</p>
      <div style={{overflowX:'auto', marginTop:16}}>
        <table className="ds-table">
          <thead><tr><th>Campaign</th><th>Platform</th><th>Status</th><th style={{textAlign:'right'}}>Spend</th><th style={{textAlign:'right'}}>ROAS</th><th style={{textAlign:'right'}}>CPA</th><th style={{textAlign:'right'}}>CTR</th><th></th></tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}>
                <td style={{fontWeight:500, color:'var(--text)'}}>{r.name}</td>
                <td><span className="ds-tag">{r.platform}</span></td>
                <td><span className="ds-badge" style={{background:statusColor[r.status]+'18', color:statusColor[r.status]}}><span className="ds-badge-dot" style={{background:statusColor[r.status]}}/>{r.status}</span></td>
                <td style={{textAlign:'right'}}><MoneyDisplay currency="US$" amount={r.spend} size="sm"/></td>
                <td style={{textAlign:'right'}}><code className="ds-mono-sm" style={{color:parseFloat(r.roas)>2?'var(--success)':'var(--warning)'}}>{r.roas}</code></td>
                <td style={{textAlign:'right'}}><MoneyDisplay currency="US$" amount={r.cpa} size="sm"/></td>
                <td style={{textAlign:'right'}}><code className="ds-mono-sm">{r.ctr}</code></td>
                <td><button className="ds-why-trigger">Why?</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Timeline ── */
function TimelineDemo() {
  const events = [
    {time:'2 min ago', agent:'Optimizer', msg:'Increased Instagram Reels budget by 15% — CPA tracking 18% under target.', type:'success'},
    {time:'18 min ago', agent:'Sales Agent', msg:'Closed sale via WhatsApp · MTN MoMo · RWF 24,500.', type:'success'},
    {time:'34 min ago', agent:'Optimizer', msg:'Paused Google Search ad set \'broad-keywords-2\' — CTR fell to 0.4%.', type:'warning'},
    {time:'1h ago', agent:'Creative', msg:'Generated 3 new creative variants for "Ankara Print Tee — Indigo".', type:'info'},
    {time:'2h ago', agent:'Safety', msg:'Quarantined inbound DM as suspected prompt-injection.', type:'danger'},
  ];
  const typeColor = {success:'var(--success)', warning:'var(--warning)', info:'var(--info)', danger:'var(--danger)'};
  return (
    <div>
      <h3 className="ds-section-title">Timeline</h3>
      <div className="ds-timeline">
        {events.map((e,i) => (
          <div key={i} className="ds-timeline-item">
            <div className="ds-timeline-dot" style={{background:typeColor[e.type]}}/>
            <div className="ds-timeline-content">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span className="ds-caption"><span style={{color:typeColor[e.type], fontWeight:500}}>{e.agent}</span> · {e.time}</span>
                <button className="ds-why-trigger">Why?</button>
              </div>
              <p style={{margin:'4px 0 0', color:'var(--text)', fontSize:14}}>{e.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolaiSection() {
  return (
    <section id="solai">
      <h2 className="ds-h2">Custom SolAI Components</h2>
      <div style={{display:'flex', flexDirection:'column', gap:48}}>
        <WhyPopoverDemo />
        <MoneyDisplayDemo />
        <AgentActivityDemo />
        <BudgetEnvelopeDemo />
        <DataTableDemo />
        <TimelineDemo />
        <ConsentBannerDemo />
      </div>
    </section>
  );
}

window.SolaiSection = SolaiSection;
window.WhyPopover = WhyPopover;
window.MoneyDisplay = MoneyDisplay;
window.AgentActivityRow = AgentActivityRow;
window.BudgetBar = BudgetBar;
window.ConsentBanner = ConsentBanner;
