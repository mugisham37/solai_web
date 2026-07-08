/* SolAI Design System — Primitive Components */

/* ── Icons (Lucide-style SVG helpers) ── */
function Icon({name, size=20}) {
  const icons = {
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    alertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    loader: <><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || icons.info}
    </svg>
  );
}

/* ── Buttons ── */
function ButtonGallery() {
  const variants = [
    {name:'Primary', cls:'ds-btn ds-btn-primary'},
    {name:'Secondary', cls:'ds-btn ds-btn-secondary'},
    {name:'Tertiary', cls:'ds-btn ds-btn-tertiary'},
    {name:'Danger', cls:'ds-btn ds-btn-danger'},
    {name:'Ghost', cls:'ds-btn ds-btn-ghost'},
  ];
  const states = ['Default','Hover','Focus','Disabled'];
  return (
    <div>
      <h3 className="ds-section-title">Buttons</h3>
      <p className="ds-body-muted">5 variants × 4 states. Radius --r-md (10px). Sizes: sm (32px), md (40px), lg (48px).</p>
      <table className="ds-table" style={{marginTop:16}}>
        <thead><tr><th>Variant</th>{states.map(s=><th key={s}>{s}</th>)}</tr></thead>
        <tbody>
          {variants.map(v => (
            <tr key={v.name}>
              <td><code className="ds-mono-sm">{v.name}</code></td>
              <td><button className={v.cls}>{v.name}</button></td>
              <td><button className={v.cls + ' hover'}>{v.name}</button></td>
              <td><button className={v.cls + ' focus-demo'}>{v.name}</button></td>
              <td><button className={v.cls} disabled>{v.name}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:'flex', gap:12, marginTop:16, alignItems:'center'}}>
        <button className="ds-btn ds-btn-primary ds-btn-sm">Small</button>
        <button className="ds-btn ds-btn-primary">Medium</button>
        <button className="ds-btn ds-btn-primary ds-btn-lg">Large</button>
        <button className="ds-btn ds-btn-primary"><Icon name="zap" size={16}/> With Icon</button>
      </div>
    </div>
  );
}

/* ── Inputs ── */
function InputGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Inputs</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20}}>
        <div className="ds-field">
          <label className="ds-label">Email address</label>
          <input className="ds-input" type="email" placeholder="seller@inema.rw" defaultValue="kalisa@mugisha.rw"/>
          <span className="ds-helper">We'll send a verification link.</span>
        </div>
        <div className="ds-field">
          <label className="ds-label">Daily spend cap</label>
          <div className="ds-input-group">
            <span className="ds-input-prefix">US$</span>
            <input className="ds-input ds-input-with-prefix" type="text" defaultValue="500.00" style={{fontFamily:"'JetBrains Mono',monospace", fontFeatureSettings:'"tnum"'}}/>
          </div>
          <span className="ds-helper">Maximum daily ad spend across all platforms.</span>
        </div>
        <div className="ds-field ds-field-error">
          <label className="ds-label">Campaign name</label>
          <input className="ds-input ds-input-error" type="text" defaultValue=""/>
          <span className="ds-error-text"><Icon name="alertTriangle" size={14}/> Campaign name is required.</span>
        </div>
        <div className="ds-field">
          <label className="ds-label">Target audience</label>
          <textarea className="ds-input ds-textarea" rows={3} placeholder="Describe your ideal customer..." defaultValue="Women 25-45 in East Africa interested in artisan home goods."></textarea>
        </div>
        <div className="ds-field">
          <label className="ds-label">Payment rail</label>
          <div className="ds-select-wrap">
            <select className="ds-input ds-select">
              <option>Stripe (Cards, Apple Pay)</option>
              <option>MTN Mobile Money</option>
              <option>Airtel Money</option>
              <option>Flutterwave</option>
            </select>
            <Icon name="chevronDown" size={16}/>
          </div>
        </div>
        <div className="ds-field">
          <label className="ds-label">Search (disabled)</label>
          <input className="ds-input" type="text" disabled placeholder="Search campaigns..."/>
        </div>
      </div>
    </div>
  );
}

/* ── Toggles: Switch, Checkbox, Radio ── */
function ToggleGallery() {
  const [sw1, setSw1] = React.useState(true);
  const [sw2, setSw2] = React.useState(false);
  const [checks, setChecks] = React.useState({a:true, b:false, c:true});
  const [radio, setRadio] = React.useState('sub');

  return (
    <div>
      <h3 className="ds-section-title">Switches, Checkboxes, Radios</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24}}>
        <div>
          <p className="ds-label">Switches</p>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <label className="ds-switch-label">
              <button role="switch" aria-checked={sw1} className={`ds-switch ${sw1?'ds-switch-on':''}`} onClick={()=>setSw1(!sw1)}>
                <span className="ds-switch-thumb"/>
              </button>
              Auto-optimize campaigns
            </label>
            <label className="ds-switch-label">
              <button role="switch" aria-checked={sw2} className={`ds-switch ${sw2?'ds-switch-on':''}`} onClick={()=>setSw2(!sw2)}>
                <span className="ds-switch-thumb"/>
              </button>
              Email notifications
            </label>
          </div>
        </div>
        <div>
          <p className="ds-label">Checkboxes</p>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {[['a','Meta (Facebook + Instagram)'],['b','Google Ads'],['c','WhatsApp Business']].map(([k,l])=>(
              <label key={k} className="ds-checkbox-label">
                <span className={`ds-checkbox ${checks[k]?'ds-checkbox-on':''}`} onClick={()=>setChecks({...checks,[k]:!checks[k]})}>
                  {checks[k] && <Icon name="check" size={14}/>}
                </span>
                {l}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="ds-label">Radios</p>
          <div style={{display:'flex', flexDirection:'column', gap:8}}>
            {[['sub','Subscription'],['perf','Performance'],['hybrid','Hybrid']].map(([v,l])=>(
              <label key={v} className="ds-radio-label" onClick={()=>setRadio(v)}>
                <span className={`ds-radio ${radio===v?'ds-radio-on':''}`}><span className="ds-radio-dot"/></span>
                {l}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Badges, Tags, Avatars ── */
function BadgeGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Badges, Tags, Avatars</h3>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <p className="ds-label">Status Badges</p>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <span className="ds-badge ds-badge-success"><span className="ds-badge-dot" style={{background:'var(--success)'}}/>Live</span>
            <span className="ds-badge ds-badge-warning"><span className="ds-badge-dot" style={{background:'var(--warning)'}}/>Learning</span>
            <span className="ds-badge ds-badge-danger"><span className="ds-badge-dot" style={{background:'var(--danger)'}}/>Paused</span>
            <span className="ds-badge ds-badge-info"><span className="ds-badge-dot" style={{background:'var(--info)'}}/>Pending</span>
            <span className="ds-badge ds-badge-neutral"><span className="ds-badge-dot" style={{background:'var(--text-subtle)'}}/>Draft</span>
          </div>
        </div>
        <div>
          <p className="ds-label">Tags</p>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <span className="ds-tag">Meta</span>
            <span className="ds-tag">Google Ads</span>
            <span className="ds-tag ds-tag-brand">WhatsApp</span>
            <span className="ds-tag ds-tag-removable">Instagram DM <button aria-label="Remove"><Icon name="x" size={12}/></button></span>
          </div>
        </div>
        <div>
          <p className="ds-label">Avatars</p>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            {[
              {init:'IB', color:'#5B7CFF', name:'Inema Boutique'},
              {init:'AF', color:'#34D399', name:'Akili Foods'},
              {init:'KM', color:'#FFB547', name:'Kalisa Mugisha'},
              {init:'AD', color:'#F97066', name:'Aïcha Diallo'},
            ].map((a,i)=>(
              <div key={i} title={a.name} className="ds-avatar" style={{background:a.color+'22', color:a.color}}>
                {a.init}
              </div>
            ))}
            <div className="ds-avatar ds-avatar-sm" style={{background:'var(--brand-soft)', color:'var(--brand)'}}>CT</div>
            <div className="ds-avatar ds-avatar-lg" style={{background:'var(--success)22', color:'var(--success)'}}>MC</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── KPI Stat Card ── */
function KPIStatGallery() {
  return (
    <div>
      <h3 className="ds-section-title">KPI Stat Cards</h3>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16}}>
        {[
          {label:'Total Spend', value:'US$ 4,231', delta:'+12.3%', positive:true, sub:'of US$ 10,000 cap'},
          {label:'Revenue (ROAS)', value:'US$ 18,420', delta:'3.2x', positive:true, sub:'7-day attributed'},
          {label:'CPA', value:'US$ 8.45', delta:'-6.2%', positive:true, sub:'Target: US$ 12.00'},
          {label:'Active Conversations', value:'47', delta:'+8', positive:true, sub:'12 closing'},
          {label:'Closed Orders', value:'214', delta:'+31 today', positive:true, sub:'RWF 1.2M total'},
          {label:'CTR', value:'2.8%', delta:'-0.3%', positive:false, sub:'Below 3% baseline'},
        ].map((k,i) => (
          <div key={i} className="ds-card ds-kpi-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <span className="ds-caption">{k.label}</span>
              <button className="ds-why-trigger" aria-label="Why?">Why?</button>
            </div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:8}}>
              <span className="ds-kpi-value">{k.value}</span>
              <span className={`ds-kpi-delta ${k.positive?'ds-kpi-delta-up':'ds-kpi-delta-down'}`}>{k.delta}</span>
            </div>
            <div className="ds-kpi-sparkline">
              <svg viewBox="0 0 120 32" style={{width:'100%',height:32}}>
                <polyline points={k.positive?"0,28 15,24 30,26 45,20 60,18 75,14 90,10 105,12 120,6":"0,8 15,10 30,6 45,12 60,16 75,14 90,20 105,22 120,26"} fill="none" stroke={k.positive?'var(--success)':'var(--danger)'} strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="ds-caption" style={{marginTop:4}}>{k.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tabs + Segmented ── */
function TabsGallery() {
  const [tab, setTab] = React.useState(0);
  const [seg, setSeg] = React.useState(0);
  const tabs = ['Overview','Campaigns','Conversations','Orders'];
  const segs = ['7 days','30 days','90 days','Custom'];
  return (
    <div>
      <h3 className="ds-section-title">Tabs & Segmented Controls</h3>
      <div style={{display:'flex', flexDirection:'column', gap:20}}>
        <div>
          <p className="ds-label">Tabs (underline)</p>
          <nav className="ds-tabs" role="tablist">
            {tabs.map((t,i) => (
              <button key={t} role="tab" aria-selected={tab===i} className={`ds-tab ${tab===i?'ds-tab-active':''}`} onClick={()=>setTab(i)}>{t}</button>
            ))}
          </nav>
        </div>
        <div>
          <p className="ds-label">Segmented Control</p>
          <div className="ds-segmented">
            {segs.map((s,i) => (
              <button key={s} className={`ds-seg-btn ${seg===i?'ds-seg-btn-active':''}`} onClick={()=>setSeg(i)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Progress, Stepper ── */
function ProgressGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Progress & Stepper</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div>
          <p className="ds-label">Progress Bars</p>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {[{pct:72,color:'var(--brand)',label:'Campaign progress'},{pct:85,color:'var(--warning)',label:'Budget (approaching cap)'},{pct:100,color:'var(--danger)',label:'Budget (cap reached)'}].map((p,i)=>(
              <div key={i}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                  <span className="ds-caption">{p.label}</span>
                  <span className="ds-mono-sm">{p.pct}%</span>
                </div>
                <div className="ds-progress"><div className="ds-progress-bar" style={{width:p.pct+'%', background:p.color}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="ds-label">Stepper (Onboarding)</p>
          <div className="ds-stepper">
            {['Account','Connections','Payments','Product','Launch'].map((s,i)=>(
              <div key={s} className={`ds-step ${i<2?'ds-step-done':i===2?'ds-step-active':'ds-step-pending'}`}>
                <div className="ds-step-circle">{i<2?<Icon name="check" size={14}/>:i+1}</div>
                <span className="ds-step-label">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toast, Banner ── */
function FeedbackGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Toasts & Banners</h3>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {[
          {type:'success', icon:'check', msg:'Campaign launched successfully. First ads will appear within 30 minutes.'},
          {type:'warning', icon:'alertTriangle', msg:'Budget approaching cap — US$ 8,500 of US$ 10,000 spent. Consider increasing.'},
          {type:'danger', icon:'x', msg:'Meta connection expired. Reconnect to resume campaign delivery.'},
          {type:'info', icon:'info', msg:'SolAI decided to pause Google Search ad set — CTR fell below 0.5% baseline.'},
        ].map((t,i) => (
          <div key={i} className={`ds-banner ds-banner-${t.type}`}>
            <Icon name={t.icon} size={18}/>
            <span>{t.msg}</span>
            <button className="ds-banner-close" aria-label="Dismiss"><Icon name="x" size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Loading Skeletons</h3>
      <p className="ds-body-muted">Skeletons match final shape. Never generic spinners.</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginTop:12}}>
        <div className="ds-card" style={{padding:20}}>
          <div className="ds-skel ds-skel-text" style={{width:'60%'}}></div>
          <div className="ds-skel ds-skel-lg" style={{marginTop:8, width:'40%'}}></div>
          <div className="ds-skel ds-skel-bar" style={{marginTop:12}}></div>
          <div className="ds-skel ds-skel-text" style={{marginTop:8, width:'80%'}}></div>
        </div>
        <div className="ds-card" style={{padding:20}}>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div className="ds-skel" style={{width:40,height:40,borderRadius:'50%'}}></div>
            <div style={{flex:1}}>
              <div className="ds-skel ds-skel-text" style={{width:'70%'}}></div>
              <div className="ds-skel ds-skel-text" style={{width:'40%', marginTop:6}}></div>
            </div>
          </div>
          <div className="ds-skel ds-skel-text" style={{marginTop:16}}></div>
          <div className="ds-skel ds-skel-text" style={{marginTop:6, width:'90%'}}></div>
        </div>
        <div className="ds-card" style={{padding:20}}>
          <div className="ds-skel ds-skel-text" style={{width:'50%'}}></div>
          {[1,2,3].map(r=>(
            <div key={r} style={{display:'flex', gap:8, marginTop:10}}>
              <div className="ds-skel" style={{width:16,height:16,borderRadius:4}}></div>
              <div className="ds-skel ds-skel-text" style={{flex:1}}></div>
              <div className="ds-skel ds-skel-text" style={{width:60}}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyStateGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Empty States</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div className="ds-card ds-empty-state">
          <div className="ds-empty-icon"><Icon name="zap" size={32}/></div>
          <h4>No campaigns yet</h4>
          <p>Upload your first product and SolAI will create your campaigns automatically.</p>
          <button className="ds-btn ds-btn-primary">Upload product</button>
        </div>
        <div className="ds-card ds-empty-state">
          <div className="ds-empty-icon"><Icon name="mail" size={32}/></div>
          <h4>Inbox is quiet</h4>
          <p>When leads respond to your ads, their conversations will appear here.</p>
          <button className="ds-btn ds-btn-secondary">View campaigns</button>
        </div>
      </div>
    </div>
  );
}

/* ── Breadcrumb, Pagination, Kbd ── */
function NavGallery() {
  return (
    <div>
      <h3 className="ds-section-title">Breadcrumb, Pagination, Kbd</h3>
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <p className="ds-label">Breadcrumb</p>
          <nav className="ds-breadcrumb" aria-label="Breadcrumb">
            <a href="#">Dashboard</a><span>/</span><a href="#">Campaigns</a><span>/</span><span aria-current="page">Ankara Print Tee — Indigo</span>
          </nav>
        </div>
        <div>
          <p className="ds-label">Pagination</p>
          <nav className="ds-pagination">
            <button className="ds-btn ds-btn-ghost ds-btn-sm" disabled>Previous</button>
            <button className="ds-page-btn ds-page-btn-active">1</button>
            <button className="ds-page-btn">2</button>
            <button className="ds-page-btn">3</button>
            <span className="ds-caption">…</span>
            <button className="ds-page-btn">12</button>
            <button className="ds-btn ds-btn-ghost ds-btn-sm">Next</button>
          </nav>
        </div>
        <div>
          <p className="ds-label">Keyboard Shortcuts</p>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <kbd className="ds-kbd">⌘</kbd><kbd className="ds-kbd">K</kbd><span className="ds-caption" style={{marginLeft:4, marginRight:12}}>Command palette</span>
            <kbd className="ds-kbd">Esc</kbd><span className="ds-caption" style={{marginLeft:4}}>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimitivesSection() {
  return (
    <section id="primitives">
      <h2 className="ds-h2">Primitives</h2>
      <div style={{display:'flex', flexDirection:'column', gap:48}}>
        <ButtonGallery />
        <InputGallery />
        <ToggleGallery />
        <BadgeGallery />
        <TabsGallery />
        <KPIStatGallery />
        <ProgressGallery />
        <FeedbackGallery />
        <SkeletonGallery />
        <EmptyStateGallery />
        <NavGallery />
      </div>
    </section>
  );
}

window.PrimitivesSection = PrimitivesSection;
window.Icon = Icon;
