/* SolAI Flow 7 — Settings & Permissions
   Screens: Profile · Team · Agent Permissions · Integrations · Billing · Audit Log
*/

function SIcon({name,size=16}){
  const p={
    user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    shield:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    plug:<><path d="M9 2v6M15 2v6M5 8h14v3a7 7 0 0 1-14 0z"/><path d="M12 18v4"/></>,
    card:<><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    log:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></>,
    chevronRight:<polyline points="9 18 15 12 9 6"/>,
    check:<polyline points="20 6 9 17 4 12"/>,
    x:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    info:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    download:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    alert:<><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    sparkles:<><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z"/></>,
    key:<><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l3 3"/></>,
    zap:<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    whatsapp:<><path d="M3.5 12c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.5-8.5 8.5c-1.5 0-2.9-.4-4.1-1.1L3 21l1.6-4.5c-.7-1.3-1.1-2.8-1.1-4.5z"/></>,
    instagram:<><rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></>,
    box:<><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></>,
    cash:<><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></>,
    chart:<><line x1="3" y1="20" x2="21" y2="20"/><polyline points="5 16 9 12 13 14 19 6"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{p[name]||null}</svg>;
}

function Toggle({on,onChange,disabled}){
  return (
    <button className={`s-toggle ${on?'s-toggle-on':''} ${disabled?'s-toggle-disabled':''}`} onClick={()=>!disabled && onChange(!on)} disabled={disabled} aria-pressed={on}>
      <span className="s-toggle-knob"/>
    </button>
  );
}

function Pill({children,tone='neutral'}){
  return <span className={`s-pill s-pill-${tone}`}>{children}</span>;
}

/* ── PROFILE ── */
function ProfileView(){
  return (
    <div className="s-page">
      <div className="s-page-head">
        <h1 className="s-h1">Profile</h1>
        <p className="s-sub">Your personal information and account preferences.</p>
      </div>

      <section className="s-card">
        <div className="s-card-head"><h2>Personal information</h2></div>
        <div className="s-form-grid">
          <div className="s-row s-row-avatar">
            <div className="s-avatar-lg">CN</div>
            <div>
              <strong>Claudine Niyongabo</strong>
              <span>claudine@inema-boutique.rw · Owner</span>
              <div className="s-avatar-actions">
                <button className="s-btn s-btn-secondary">Upload photo</button>
                <button className="s-btn s-btn-text">Remove</button>
              </div>
            </div>
          </div>
          <div className="s-grid-2">
            <label className="s-field"><span>Full name</span><input defaultValue="Claudine Niyongabo"/></label>
            <label className="s-field"><span>Display name</span><input defaultValue="Claudine"/></label>
            <label className="s-field"><span>Email</span><input defaultValue="claudine@inema-boutique.rw" type="email"/></label>
            <label className="s-field"><span>Phone (MoMo)</span><input defaultValue="+250 788 102 884"/></label>
            <label className="s-field"><span>Language</span>
              <select defaultValue="en"><option value="en">English</option><option value="fr">Français</option><option value="rw">Kinyarwanda</option></select>
            </label>
            <label className="s-field"><span>Timezone</span>
              <select defaultValue="eat"><option value="eat">Africa/Kigali (EAT)</option><option value="utc">UTC</option><option value="cet">Europe/Paris (CET)</option></select>
            </label>
          </div>
        </div>
      </section>

      <section className="s-card">
        <div className="s-card-head"><h2>Security</h2></div>
        <ul className="s-list">
          <li className="s-list-row">
            <div><strong>Password</strong><span>Last changed 47 days ago.</span></div>
            <button className="s-btn s-btn-secondary">Change</button>
          </li>
          <li className="s-list-row">
            <div>
              <strong>Two-factor authentication <Pill tone="success">On</Pill></strong>
              <span>Authenticator app + SMS backup to +250 788•••884.</span>
            </div>
            <button className="s-btn s-btn-secondary">Manage</button>
          </li>
          <li className="s-list-row">
            <div><strong>Active sessions</strong><span>3 devices · last active 2 minutes ago in Kigali.</span></div>
            <button className="s-btn s-btn-secondary">View sessions</button>
          </li>
          <li className="s-list-row">
            <div><strong>Recovery codes</strong><span>10 unused. Stored offline since signup.</span></div>
            <button className="s-btn s-btn-secondary">Regenerate</button>
          </li>
        </ul>
      </section>

      <div className="s-page-foot">
        <button className="s-btn s-btn-text">Cancel</button>
        <button className="s-btn s-btn-primary">Save changes</button>
      </div>
    </div>
  );
}

/* ── TEAM & ROLES ── */
function TeamView(){
  const members=[
    {name:'Claudine Niyongabo',email:'claudine@inema-boutique.rw',role:'Owner',scope:'Everything',status:'active',mfa:true,last:'2 min ago'},
    {name:'Eric Habimana',email:'eric@inema-boutique.rw',role:'Admin',scope:'All except Billing',status:'active',mfa:true,last:'14 min ago'},
    {name:'Aisha Mutoni',email:'aisha@inema-boutique.rw',role:'Operator',scope:'Conversations · Campaigns',status:'active',mfa:true,last:'1 h ago'},
    {name:'Yann Dupont',email:'yann@maison-paris.fr',role:'Operator',scope:'Conversations',status:'active',mfa:false,last:'yesterday'},
    {name:'Kwame Boateng',email:'kwame@accra-shop.gh',role:'Viewer',scope:'Read-only',status:'invited',mfa:false,last:'—'},
  ];
  return (
    <div className="s-page">
      <div className="s-page-head">
        <div>
          <h1 className="s-h1">Team & roles</h1>
          <p className="s-sub">5 members · 3 admins · 1 pending invite.</p>
        </div>
        <div className="s-page-actions">
          <button className="s-btn s-btn-secondary">Manage roles</button>
          <button className="s-btn s-btn-primary"><SIcon name="plus" size={14}/> Invite member</button>
        </div>
      </div>

      <section className="s-card">
        <div className="s-card-head">
          <h2>Members</h2>
          <div className="s-search">
            <SIcon name="search" size={14}/>
            <input placeholder="Search by name or email…"/>
          </div>
        </div>
        <table className="s-table">
          <thead><tr><th>Member</th><th>Role</th><th>Scope</th><th>2FA</th><th>Last active</th><th></th></tr></thead>
          <tbody>
            {members.map(m=>(
              <tr key={m.email}>
                <td>
                  <div className="s-cell-user">
                    <div className="s-avatar-sm">{m.name.split(' ').map(s=>s[0]).join('').slice(0,2)}</div>
                    <div>
                      <strong>{m.name}</strong>
                      <span>{m.email}</span>
                    </div>
                  </div>
                </td>
                <td><Pill tone={m.role==='Owner'?'brand':m.role==='Admin'?'info':m.role==='Operator'?'neutral':'subtle'}>{m.role}</Pill></td>
                <td><span className="s-mono">{m.scope}</span></td>
                <td>{m.mfa? <Pill tone="success">On</Pill> : <Pill tone="warn">Off</Pill>}</td>
                <td><span className="s-mono">{m.last}</span></td>
                <td>{m.status==='invited'? <Pill tone="warn">Invite pending</Pill> : <button className="s-btn s-btn-text">Manage</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="s-card">
        <div className="s-card-head"><h2>Role definitions</h2></div>
        <div className="s-roles-grid">
          {[
            {n:'Owner',c:'Everything: billing, deletion, transfer ownership.',l:'1 person'},
            {n:'Admin',c:'Everything except billing & ownership transfer.',l:'No limit'},
            {n:'Operator',c:'Run campaigns, reply in inbox, edit creatives. Cannot change agent permissions.',l:'No limit'},
            {n:'Viewer',c:'Read-only access to dashboards, conversations, audit log.',l:'No limit'},
          ].map(r=>(
            <div key={r.n} className="s-role-card">
              <div className="s-role-head">
                <strong>{r.n}</strong>
                <span>{r.l}</span>
              </div>
              <p>{r.c}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── AGENT PERMISSIONS (the star screen) ── */
function PermissionsView(){
  const [agent,setAgent]=React.useState('sales');
  const agents=[
    {id:'sales',name:'Sales Agent',icon:'sparkles',color:'#5B7CFF',desc:'Replies to inbound DMs, qualifies leads, books orders.'},
    {id:'support',name:'Support Agent',icon:'shield',color:'#34D399',desc:'Handles order status, returns, basic FAQ.'},
    {id:'creative',name:'Creative Agent',icon:'zap',color:'#FFB547',desc:'Drafts ads, captions, and product photography copy.'},
    {id:'analyst',name:'Analyst Agent',icon:'chart',color:'#7AA7FF',desc:'Reads metrics, runs cohort & A/B analyses.'},
    {id:'safety',name:'Safety Agent',icon:'shield',color:'#F97066',desc:'Filters inbound messages and screens outbound creative.'},
  ];

  const [perms,setPerms]=React.useState({
    reply_dms:'auto',
    send_outbound:'approve',
    send_outbound_bulk:'approve',
    confirm_orders:'auto',
    issue_refund:'never',
    discount_code:'limit',
    edit_inventory:'never',
    spend_ads:'limit',
    pause_campaign:'auto',
    edit_creative:'auto',
    publish_creative:'approve',
    contact_supplier:'approve',
  });

  const setPerm=(k,v)=>setPerms({...perms,[k]:v});

  const groups=[
    {title:'Conversations',items:[
      {k:'reply_dms',l:'Reply to inbound DMs',d:'Auto-reply to customers in WhatsApp / IG / Meta.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'send_outbound',l:'Send outbound messages (1:1)',d:'Send a message to a single contact who has not messaged first.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'send_outbound_bulk',l:'Bulk broadcasts (≥ 50 recipients)',d:'Send the same message to a segment.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
    ]},
    {title:'Commerce',items:[
      {k:'confirm_orders',l:'Confirm orders & take payment',d:'Issue MoMo / Airtel / card prompts up to envelope cap.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'issue_refund',l:'Issue refunds',d:'Refund up to 10% of an order without asking.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'discount_code',l:'Generate discount codes',d:'Create one-off promo codes within budget envelope.',caps:[{v:'auto',l:'Auto'},{v:'limit',l:'Up to limit'},{v:'never',l:'Never'}]},
      {k:'edit_inventory',l:'Edit inventory & prices',d:'Change SKU price or stock count.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
    ]},
    {title:'Campaigns & creative',items:[
      {k:'spend_ads',l:'Spend on paid ads',d:'Move budget across Meta / Google / TikTok within envelope.',caps:[{v:'auto',l:'Auto'},{v:'limit',l:'Up to limit'},{v:'never',l:'Never'}]},
      {k:'pause_campaign',l:'Pause underperforming campaigns',d:'Stop a campaign when CAC exceeds threshold.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'edit_creative',l:'Edit creative drafts',d:'Iterate on captions, copy, image crops.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
      {k:'publish_creative',l:'Publish to ad accounts',d:'Push live creative to Meta / Google after edit.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
    ]},
    {title:'Operations',items:[
      {k:'contact_supplier',l:'Contact suppliers / atelier',d:'Email or message vendors about restock & timing.',caps:[{v:'auto',l:'Auto'},{v:'approve',l:'Ask first'},{v:'never',l:'Never'}]},
    ]},
  ];

  const capLabels={auto:'Auto',approve:'Ask first',never:'Never',limit:'Up to limit'};
  const capTones={auto:'success',approve:'info',never:'subtle',limit:'warn'};

  return (
    <div className="s-page">
      <div className="s-page-head">
        <div>
          <h1 className="s-h1">Agent permissions</h1>
          <p className="s-sub">What each agent can do without asking. Change anything — defaults are conservative.</p>
        </div>
        <div className="s-page-actions">
          <button className="s-btn s-btn-secondary">Reset to defaults</button>
          <button className="s-btn s-btn-primary">Save changes</button>
        </div>
      </div>

      <div className="s-perm-banner">
        <SIcon name="shield" size={18}/>
        <div>
          <strong>Trust budget — what's at stake right now</strong>
          <span>3 actions auto-run · 4 ask first · 1 never · 4 capped by envelope. Last review 2 days ago.</span>
        </div>
        <button className="s-btn s-btn-secondary">View audit log →</button>
      </div>

      <div className="s-perm-grid">
        <aside className="s-perm-side">
          <h3>Agents</h3>
          {agents.map(a=>(
            <button key={a.id} className={`s-perm-agent ${agent===a.id?'s-perm-agent-on':''}`} onClick={()=>setAgent(a.id)}>
              <span className="s-perm-agent-ico" style={{background:a.color+'22',color:a.color}}><SIcon name={a.icon} size={14}/></span>
              <div>
                <strong>{a.name}</strong>
                <span>{a.desc}</span>
              </div>
              <SIcon name="chevronRight" size={14}/>
            </button>
          ))}
          <div className="s-perm-side-foot">
            <SIcon name="info" size={14}/>
            <span>Permissions are per-agent. Owner & Admin can change them; Operator can only read.</span>
          </div>
        </aside>

        <section className="s-perm-detail">
          <div className="s-perm-detail-head">
            <h3>{agents.find(a=>a.id===agent).name}</h3>
            <span className="s-mono">{Object.values(perms).filter(v=>v==='auto').length} auto · {Object.values(perms).filter(v=>v==='approve').length} ask first · {Object.values(perms).filter(v=>v==='limit').length} capped · {Object.values(perms).filter(v=>v==='never').length} never</span>
          </div>

          {groups.map(g=>(
            <div key={g.title} className="s-perm-group">
              <div className="s-perm-group-head">{g.title}</div>
              {g.items.map(it=>(
                <div key={it.k} className="s-perm-row">
                  <div className="s-perm-row-label">
                    <strong>{it.l}</strong>
                    <span>{it.d}</span>
                    {it.k==='spend_ads' && <a className="s-perm-link">Edit envelope: $400/wk →</a>}
                    {it.k==='discount_code' && <a className="s-perm-link">Edit limit: 10% off, 5 codes/day →</a>}
                    {it.k==='issue_refund' && <a className="s-perm-link">Edit cap: 10% of order →</a>}
                  </div>
                  <div className="s-perm-row-control">
                    <div className="s-seg">
                      {it.caps.map(c=>(
                        <button key={c.v} className={`s-seg-btn ${perms[it.k]===c.v?'s-seg-on':''}`} data-tone={capTones[c.v]} onClick={()=>setPerm(it.k,c.v)}>
                          {c.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="s-perm-foot">
            <SIcon name="info" size={14}/>
            <span>Anything set to <strong>Ask first</strong> appears in your approval queue. Anything <strong>capped</strong> auto-pauses when the envelope is hit.</span>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── INTEGRATIONS ── */
function IntegrationsView(){
  const cats=[
    {title:'Channels',items:[
      {n:'WhatsApp Business',v:'+250 788 102 884',i:'whatsapp',c:'#25D366',s:'connected',extra:'Verified · 2,140 messages/30d'},
      {n:'Instagram',v:'@inema_boutique',i:'instagram',c:'#E1306C',s:'connected',extra:'12.4K followers'},
      {n:'Meta Messenger',v:'Inema Boutique Page',i:'plug',c:'#1877F2',s:'connected',extra:'Auto-reply on'},
      {n:'TikTok Shop',v:'',i:'plug',c:'#FE2C55',s:'available',extra:'Available — connect to enable Creative Agent on TikTok'},
    ]},
    {title:'Payments',items:[
      {n:'MTN Mobile Money',v:'Merchant 4488221',i:'cash',c:'#FFCC00',s:'connected',extra:'Live · 84% of revenue'},
      {n:'Airtel Money',v:'Merchant 9921048',i:'cash',c:'#ED1C24',s:'connected',extra:'Live · 11% of revenue'},
      {n:'Stripe',v:'acct_inema_2024',i:'card',c:'#635BFF',s:'connected',extra:'Cards EU/US · 5% of revenue'},
      {n:'Wave',v:'',i:'cash',c:'#1DC8E9',s:'available',extra:'Available — coming for Senegal & Côte d\'Ivoire'},
    ]},
    {title:'Inventory & shipping',items:[
      {n:'Sol Inventory',v:'Built-in',i:'box',c:'#5B7CFF',s:'connected',extra:'47 SKUs · synced 2 min ago'},
      {n:'DHL Express',v:'Account D-RW-22188',i:'plug',c:'#D40511',s:'connected',extra:'International rates · live'},
      {n:'Sendwave',v:'',i:'plug',c:'#1DC8E9',s:'available',extra:'Available'},
    ]},
    {title:'Data & analytics',items:[
      {n:'Meta Ads',v:'act_31882741',i:'plug',c:'#1877F2',s:'connected',extra:'Read-only · Spend last 7d $284'},
      {n:'Google Ads',v:'',i:'plug',c:'#4285F4',s:'available',extra:'Available'},
      {n:'GA4',v:'G-INEMA-2',i:'chart',c:'#F4B400',s:'connected',extra:'Read-only'},
    ]},
  ];
  return (
    <div className="s-page">
      <div className="s-page-head">
        <div>
          <h1 className="s-h1">Integrations</h1>
          <p className="s-sub">Channels, payments, and data sources your agents can act on.</p>
        </div>
        <div className="s-page-actions">
          <button className="s-btn s-btn-secondary">API & webhooks</button>
          <button className="s-btn s-btn-primary"><SIcon name="plus" size={14}/> Add integration</button>
        </div>
      </div>

      {cats.map(c=>(
        <section key={c.title} className="s-card">
          <div className="s-card-head"><h2>{c.title}</h2></div>
          <div className="s-int-grid">
            {c.items.map(it=>(
              <div key={it.n} className={`s-int-card ${it.s==='available'?'s-int-available':''}`}>
                <div className="s-int-head">
                  <span className="s-int-icon" style={{background:it.c+'22',color:it.c}}><SIcon name={it.i} size={18}/></span>
                  <div className="s-int-meta">
                    <strong>{it.n}</strong>
                    {it.v && <span className="s-mono">{it.v}</span>}
                  </div>
                  {it.s==='connected' ? <Pill tone="success">Connected</Pill> : <Pill tone="subtle">Available</Pill>}
                </div>
                <p className="s-int-extra">{it.extra}</p>
                <div className="s-int-actions">
                  {it.s==='connected' ? (
                    <>
                      <button className="s-btn s-btn-text">Configure</button>
                      <button className="s-btn s-btn-text s-btn-danger">Disconnect</button>
                    </>
                  ) : (
                    <button className="s-btn s-btn-secondary" style={{width:'100%',justifyContent:'center'}}>Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ── BILLING & USAGE ── */
function BillingView(){
  return (
    <div className="s-page">
      <div className="s-page-head">
        <div>
          <h1 className="s-h1">Billing & usage</h1>
          <p className="s-sub">Plan, agent runs, and spend envelopes for May 2026.</p>
        </div>
        <button className="s-btn s-btn-secondary"><SIcon name="download" size={14}/> Download invoices</button>
      </div>

      <section className="s-card s-plan-card">
        <div className="s-plan-grid">
          <div>
            <div className="s-plan-tag">Current plan</div>
            <h2 className="s-plan-name">Growth</h2>
            <p className="s-plan-desc">For shops doing $10K–$80K/mo. Up to 4 agents, 200K runs, 5 channels.</p>
            <div className="s-plan-actions">
              <button className="s-btn s-btn-secondary">Compare plans</button>
              <button className="s-btn s-btn-primary">Upgrade to Scale</button>
            </div>
          </div>
          <div className="s-plan-price">
            <div className="s-mono-lg"><span className="s-mono-cur">US$</span>89<span className="s-mono-cur">/mo</span></div>
            <p className="s-helper">Billed monthly · Next charge 1 June · Visa •• 4421</p>
          </div>
        </div>
      </section>

      <div className="s-bill-grid">
        <section className="s-card">
          <div className="s-card-head"><h2>Usage this period</h2><span className="s-mono">1–10 May · resets in 21 days</span></div>
          <div className="s-usage-list">
            {[
              {l:'Agent runs',u:38420,m:200000,unit:''},
              {l:'Outbound messages',u:1284,m:5000,unit:''},
              {l:'Connected channels',u:5,m:5,unit:''},
              {l:'Storage (creative library)',u:6.4,m:50,unit:'GB'},
            ].map(r=>{
              const pct=Math.min(100,r.u/r.m*100);
              const tone=pct>85?'danger':pct>65?'warn':'ok';
              return (
                <div key={r.l} className="s-usage-row">
                  <div className="s-usage-row-head">
                    <span>{r.l}</span>
                    <span className="s-mono">{r.u.toLocaleString()}{r.unit} / {r.m.toLocaleString()}{r.unit}</span>
                  </div>
                  <div className="s-usage-bar"><div className={`s-usage-fill s-usage-${tone}`} style={{width:pct+'%'}}/></div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="s-card">
          <div className="s-card-head"><h2>Spend envelopes</h2><a className="s-perm-link">Edit →</a></div>
          <p className="s-helper" style={{padding:'0 18px 12px'}}>Caps that prevent agents from over-spending. They auto-pause when hit.</p>
          <div className="s-env-list">
            {[
              {l:'Paid ads (weekly)',u:284,m:400,c:'$'},
              {l:'Discounts (daily)',u:5,m:10,c:'codes'},
              {l:'Refunds (monthly)',u:62,m:300,c:'$'},
              {l:'Outbound bulk (daily)',u:1840,m:2500,c:'msgs'},
            ].map(r=>{
              const pct=Math.min(100,r.u/r.m*100);
              const tone=pct>85?'danger':pct>65?'warn':'ok';
              return (
                <div key={r.l} className="s-usage-row">
                  <div className="s-usage-row-head">
                    <span>{r.l}</span>
                    <span className="s-mono">{r.c==='$'?'$':''}{r.u.toLocaleString()} / {r.c==='$'?'$':''}{r.m.toLocaleString()} {r.c!=='$'?r.c:''}</span>
                  </div>
                  <div className="s-usage-bar"><div className={`s-usage-fill s-usage-${tone}`} style={{width:pct+'%'}}/></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="s-card">
        <div className="s-card-head"><h2>Recent invoices</h2></div>
        <table className="s-table">
          <thead><tr><th>Period</th><th>Plan</th><th>Add-ons</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {[
              {p:'Apr 2026',pl:'Growth',a:'+ 12K extra runs',amt:'$112.40',s:'paid'},
              {p:'Mar 2026',pl:'Growth',a:'—',amt:'$89.00',s:'paid'},
              {p:'Feb 2026',pl:'Growth',a:'—',amt:'$89.00',s:'paid'},
              {p:'Jan 2026',pl:'Starter',a:'+ Channel pack',amt:'$54.00',s:'paid'},
            ].map(r=>(
              <tr key={r.p}>
                <td><strong>{r.p}</strong></td>
                <td>{r.pl}</td>
                <td className="s-mono">{r.a}</td>
                <td className="s-mono">{r.amt}</td>
                <td><Pill tone="success">Paid</Pill></td>
                <td><button className="s-btn s-btn-text">Download PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

/* ── AUDIT LOG ── */
function AuditView(){
  const events=[
    {t:'10:42 EAT',d:'Today',who:'Sales Agent',k:'agent',action:'Replied to Aline Mukamana on WhatsApp',meta:'Run #SA-7314 · 142ms · $0.0009',tone:'info'},
    {t:'10:38 EAT',d:'Today',who:'Sales Agent',k:'agent',action:'Added customer to waitlist #4823 (indigo tee, size M)',meta:'Auto · permission auto',tone:'info'},
    {t:'10:21 EAT',d:'Today',who:'Creative Agent',k:'agent',action:'Drafted 3 ad variants for "Indigo restock"',meta:'Awaiting approval · permission ask-first',tone:'warn'},
    {t:'09:58 EAT',d:'Today',who:'Claudine N.',k:'human',action:'Approved campaign "Indigo restock — Kigali"',meta:'IP 41.215.•••.22 · Kigali · MFA',tone:'ok'},
    {t:'09:42 EAT',d:'Today',who:'Safety Agent',k:'safety',action:'Quarantined inbound message — prompt-injection (96% confidence)',meta:'Sender +250 78•••4421 · run #SF-9921',tone:'danger'},
    {t:'09:14 EAT',d:'Today',who:'Eric Habimana',k:'human',action:'Changed permission: Sales · "Issue refunds" → Ask first',meta:'Was: Auto · Reason: customer feedback',tone:'warn'},
    {t:'22:08 EAT',d:'Yesterday',who:'Sales Agent',k:'agent',action:'Auto-paused campaign "Win-back · 60d" — reply rate 4.2% under threshold',meta:'Ran 9 days · spent $52.18',tone:'warn'},
    {t:'18:34 EAT',d:'Yesterday',who:'Analyst Agent',k:'agent',action:'Generated weekly report (12 cohorts)',meta:'Read-only · permission auto',tone:'info'},
    {t:'14:12 EAT',d:'Yesterday',who:'Aisha Mutoni',k:'human',action:'Logged in from new device · Pixel 8 · Kigali',meta:'IP 41.215.•••.78 · MFA challenge passed',tone:'ok'},
  ];
  const toneIcon={info:'sparkles',ok:'check',warn:'alert',danger:'alert'};

  return (
    <div className="s-page">
      <div className="s-page-head">
        <div>
          <h1 className="s-h1">Audit log</h1>
          <p className="s-sub">Every action by every human and agent. Tamper-evident, exportable, kept 13 months.</p>
        </div>
        <div className="s-page-actions">
          <button className="s-btn s-btn-secondary">Filter</button>
          <button className="s-btn s-btn-secondary"><SIcon name="download" size={14}/> Export CSV</button>
        </div>
      </div>

      <div className="s-audit-filters">
        {['All','Agents','Humans','Permission changes','Safety','Money'].map((t,i)=>(
          <button key={t} className={`s-chip ${i===0?'s-chip-on':''}`}>{t}</button>
        ))}
        <div className="s-search s-search-inline">
          <SIcon name="search" size={14}/>
          <input placeholder="Search events…"/>
        </div>
      </div>

      <section className="s-card">
        <ul className="s-audit-list">
          {events.map((e,i)=>(
            <React.Fragment key={i}>
              {(i===0 || events[i-1].d!==e.d) && <li className="s-audit-day">{e.d}</li>}
              <li className="s-audit-row">
                <span className={`s-audit-ico s-audit-${e.tone}`}><SIcon name={toneIcon[e.tone]} size={12}/></span>
                <div className="s-audit-time">
                  <strong>{e.t}</strong>
                </div>
                <div className="s-audit-body">
                  <div className="s-audit-line">
                    <Pill tone={e.k==='agent'?'info':e.k==='human'?'neutral':e.k==='safety'?'danger':'subtle'}>{e.who}</Pill>
                    <span>{e.action}</span>
                  </div>
                  <span className="s-audit-meta">{e.meta}</span>
                </div>
                <button className="s-btn s-btn-text">Details</button>
              </li>
            </React.Fragment>
          ))}
        </ul>
        <div className="s-audit-foot">
          <span>Showing 9 of 18,420 events · 13 months retention</span>
          <button className="s-btn s-btn-text">Load more</button>
        </div>
      </section>
    </div>
  );
}

window.ProfileView = ProfileView;
window.TeamView = TeamView;
window.PermissionsView = PermissionsView;
window.IntegrationsView = IntegrationsView;
window.BillingView = BillingView;
window.AuditView = AuditView;
