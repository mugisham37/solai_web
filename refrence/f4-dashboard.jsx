/* SolAI Flow 4 — Dashboard Screens */

/* ══════════════════════════════════
   SCREEN 1: DASHBOARD HOME
   ══════════════════════════════════ */
function DashboardHome() {
  const [whyOpen, setWhyOpen] = React.useState(null);

  const kpis = [
    {label:'Total Spend', value:'US$ 4,231', delta:'+12.3%', up:true, sub:'of US$ 10,000 cap', spark:[28,24,26,20,18,14,10,12,6]},
    {label:'Revenue (ROAS)', value:'US$ 18,420', delta:'3.2x', up:true, sub:'7-day attributed', spark:[20,18,16,14,10,8,6,8,4]},
    {label:'CPA', value:'US$ 8.45', delta:'-6.2%', up:true, sub:'Target: US$ 12.00', spark:[18,16,14,12,14,10,8,10,8]},
    {label:'Active Conversations', value:'47', delta:'+8', up:true, sub:'12 closing now', spark:[22,20,18,16,14,16,12,10,8]},
    {label:'Closed Orders', value:'214', delta:'+31 today', up:true, sub:'RWF 1.2M total', spark:[26,22,20,18,14,12,10,8,6]},
    {label:'CTR', value:'2.8%', delta:'-0.3%', up:false, sub:'Below 3% baseline', spark:[8,10,6,12,16,14,20,22,26]},
  ];

  const timeline = [
    {time:'2 min ago', agent:'Optimizer', msg:'Increased Instagram Reels budget by 15% — CPA tracking 18% under target.', type:'success'},
    {time:'18 min ago', agent:'Sales Agent', msg:'Closed sale via WhatsApp · MTN MoMo · RWF 24,500. Buyer: Kalisa Mugisha.', type:'success'},
    {time:'34 min ago', agent:'Optimizer', msg:'Paused Google Search ad set "broad-keywords-2" — CTR fell to 0.4%.', type:'warning'},
    {time:'1h ago', agent:'Creative', msg:'Generated 3 new Reels variants for "Ankara Print Tee — Indigo".', type:'info'},
    {time:'2h ago', agent:'Safety', msg:'Quarantined inbound DM as suspected prompt-injection. Blocked and logged.', type:'danger'},
    {time:'3h ago', agent:'Planner', msg:'Campaign "Cape Threads Linen Shirt" moved from Learning to Live.', type:'success'},
    {time:'4h ago', agent:'Sales Agent', msg:'Generated payment link for Amara Diallo — Stripe · US$ 89.00.', type:'info'},
    {time:'5h ago', agent:'Optimizer', msg:'Reallocated US$ 45 from Google Display to Meta Reels (higher CTR).', type:'success'},
  ];

  const needsAttention = [
    {icon:'alertTriangle', color:'var(--warning)', title:'Budget approaching cap', desc:'US$ 8,500 of US$ 10,000 spent. 2 days remaining at current pace.', action:'Increase cap'},
    {icon:'shield', color:'var(--danger)', title:'Anomaly detected', desc:'Spend velocity 2.3× baseline on "Ankara Tee" Google Search.', action:'Review'},
    {icon:'eye', color:'var(--info)', title:'Pending approval', desc:'Creative Agent wants to test TikTok-style vertical video. Requires opt-in.', action:'Approve'},
    {icon:'messageCircle', color:'var(--brand)', title:'Handoff requested', desc:'Customer Amara Diallo asking about bulk pricing — beyond Sales Agent scope.', action:'Take over'},
  ];

  const agents = [
    {name:'Campaign Planner', emoji:'📊', task:'Researching Meta audiences for "Ankara Print Tee"', runtime:'4m 12s', health:'running', color:'var(--brand)'},
    {name:'Creative Generator', emoji:'🎨', task:'Generating 3 Reels variants', runtime:'1m 45s', health:'running', color:'var(--info)'},
    {name:'Real-time Optimizer', emoji:'📈', task:'Idle — next tick in 11 min', runtime:'—', health:'idle', color:'var(--success)'},
    {name:'Sales Agent', emoji:'💬', task:'Qualifying lead: Kalisa Mugisha (WhatsApp)', runtime:'32s', health:'running', color:'var(--warning)'},
    {name:'Order Handoff', emoji:'📦', task:'Paused — no pending orders', runtime:'—', health:'paused', color:'var(--text-subtle)'},
  ];

  const healthColor = {running:'var(--success)', idle:'var(--info)', paused:'var(--text-subtle)'};
  const typeColor = {success:'var(--success)',warning:'var(--warning)',danger:'var(--danger)',info:'var(--info)'};

  return (
    <div className="dash-page">
      {/* KPI Grid */}
      <div className="dash-kpi-grid">
        {kpis.map((k,i) => (
          <div key={i} className="dash-kpi-card">
            <div className="dash-kpi-header">
              <span className="dash-kpi-label">{k.label}</span>
              <button className="dash-why-btn" onClick={()=>setWhyOpen(whyOpen===i?null:i)}>Why?</button>
            </div>
            <div className="dash-kpi-row">
              <span className="dash-kpi-value">{k.value}</span>
              <span className={`dash-kpi-delta ${k.up?'dash-delta-up':'dash-delta-down'}`}>{k.delta}</span>
            </div>
            <svg className="dash-sparkline" viewBox="0 0 120 32">
              <polyline points={k.spark.map((v,j)=>`${j*(120/(k.spark.length-1))},${v}`).join(' ')} fill="none" stroke={k.up?'var(--success)':'var(--danger)'} strokeWidth="1.5"/>
            </svg>
            <span className="dash-kpi-sub">{k.sub}</span>
            {whyOpen === i && (
              <div className="dash-why-popover">
                <div className="dash-why-header">
                  <strong>Why this number?</strong>
                  <button onClick={()=>setWhyOpen(null)} className="dash-why-close"><ShIcon name="x" size={14}/></button>
                </div>
                <p className="dash-why-headline">SolAI optimised budget allocation based on 7-day rolling performance.</p>
                <ul className="dash-why-list">
                  <li>Reels CTR 3.2% — 1.8× above Feed average</li>
                  <li>CPA tracking 18% under target</li>
                  <li>Budget shifted from underperformers automatically</li>
                </ul>
                <div className="dash-why-meta">
                  <span className="dash-why-agent">Real-time Optimizer</span>
                  <code>run_7f3a…e91c</code>
                </div>
                <a href="#" className="dash-why-link">Open full decision <ShIcon name="arrowRight" size={12}/></a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main content: Timeline (8 cols) + Needs Attention (4 cols) */}
      <div className="dash-main-grid">
        <div className="dash-timeline-section">
          <h2 className="dash-section-title">What SolAI did for you today</h2>
          <div className="dash-timeline">
            {timeline.map((e,i) => (
              <div key={i} className="dash-timeline-item">
                <div className="dash-timeline-dot" style={{background:typeColor[e.type]}}/>
                <div className="dash-timeline-body">
                  <div className="dash-timeline-meta">
                    <span style={{color:typeColor[e.type], fontWeight:500}}>{e.agent}</span>
                    <span className="dash-timeline-time">{e.time}</span>
                    <button className="dash-why-btn" style={{marginLeft:'auto'}}>Why?</button>
                  </div>
                  <p>{e.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-attention-section">
          <h2 className="dash-section-title">Needs your eyes</h2>
          <div className="dash-attention-list">
            {needsAttention.map((a,i) => (
              <div key={i} className="dash-attention-card">
                <div className="dash-attention-icon" style={{color:a.color}}><ShIcon name={a.icon} size={18}/></div>
                <div className="dash-attention-body">
                  <strong>{a.title}</strong>
                  <p>{a.desc}</p>
                  <button className="dash-action-btn">{a.action} <ShIcon name="arrowRight" size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="dash-agents-section">
        <h2 className="dash-section-title">Agent Status</h2>
        <div className="dash-agents-table">
          <div className="dash-agent-header">
            <span>Agent</span><span>Current Task</span><span>Runtime</span><span>Health</span><span></span>
          </div>
          {agents.map((a,i) => (
            <div key={i} className="dash-agent-row">
              <div className="dash-agent-name">
                <span className="dash-agent-emoji" style={{background:a.color+'18',borderColor:a.color+'44'}}>{a.emoji}</span>
                <span>{a.name}</span>
              </div>
              <span className="dash-agent-task">{a.task}</span>
              <code className="dash-agent-runtime">{a.runtime}</code>
              <span className="dash-agent-health">
                <span className="dash-health-dot" style={{background:healthColor[a.health]}}/>
                {a.health.charAt(0).toUpperCase()+a.health.slice(1)}
              </span>
              <button className="dash-why-btn">Why?</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 2: COPILOT SIDEBAR
   ══════════════════════════════════ */
function CopilotSidebar({expanded, onToggle}) {
  const [input, setInput] = React.useState('');
  const messages = [
    {role:'user', text:'Why did you pause the Google Search ad set?'},
    {role:'ai', text:'The "broad-keywords-2" ad set had a CTR of 0.4% over the last 3 ticks (45 minutes) — well below the 1.5% baseline. CPA spiked to US$ 22.80, nearly 2× your target of US$ 12.00. I paused it to protect budget.', agent:'Real-time Optimizer', runId:'run_8b2c…d41f'},
    {role:'user', text:'What would happen if I resumed it?'},
    {role:'ai', text:'Based on current trends, resuming would likely spend ~US$ 120 over the next 3 hours with a projected CPA of US$ 19-24. I\'d recommend instead reallocating that budget to Instagram Reels, which is delivering a 3.2% CTR and US$ 6.20 CPA.', agent:'Real-time Optimizer', runId:'run_8b2c…d41f'},
    {role:'user', text:'Do it. Move the budget to Reels.'},
    {role:'ai', text:'Done. Reallocated US$ 85 from Google Search to Instagram Reels. The Optimizer will track the change over the next 3 ticks and report back.', agent:'Real-time Optimizer', runId:'run_9c3d…e52g'},
  ];

  if (!expanded) {
    return (
      <div className="copilot-collapsed" onClick={onToggle}>
        <ShIcon name="zap" size={20}/>
      </div>
    );
  }

  return (
    <div className="copilot-panel">
      <div className="copilot-header">
        <div className="copilot-title"><ShIcon name="zap" size={16}/> <span>SolAI Copilot</span></div>
        <button className="copilot-close" onClick={onToggle}><ShIcon name="x" size={16}/></button>
      </div>
      <div className="copilot-messages">
        {messages.map((m,i) => (
          <div key={i} className={`copilot-msg copilot-msg-${m.role}`}>
            {m.role === 'ai' && <div className="copilot-msg-avatar"><ShIcon name="zap" size={14}/></div>}
            <div className="copilot-msg-bubble">
              <p>{m.text}</p>
              {m.agent && (
                <div className="copilot-msg-meta">
                  <span className="copilot-agent">{m.agent}</span>
                  <code>{m.runId}</code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="copilot-input-area">
        <input type="text" placeholder="Ask SolAI anything…" value={input} onChange={e=>setInput(e.target.value)} className="copilot-input"/>
        <button className="copilot-send" disabled={!input.trim()}><ShIcon name="send" size={16}/></button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   SCREEN 3: EMPTY DASHBOARD
   ══════════════════════════════════ */
function EmptyDashboard() {
  return (
    <div className="dash-page">
      <div className="dash-empty">
        <div className="dash-empty-icon"><ShIcon name="zap" size={40}/></div>
        <h2>Your dashboard is waiting</h2>
        <p>Upload your first product and SolAI will create your campaigns, start conversations, and close orders — all automatically.</p>
        <div className="dash-empty-actions">
          <button className="dash-btn-primary"><ShIcon name="arrowRight" size={16}/> Upload first product</button>
          <button className="dash-btn-secondary">Watch a demo</button>
        </div>
        <div className="dash-empty-preview">
          {['Total Spend','Revenue','CPA','Conversations','Orders','CTR'].map((k,i) => (
            <div key={i} className="dash-empty-kpi">
              <div className="dash-skel dash-skel-sm"></div>
              <div className="dash-skel dash-skel-lg"></div>
              <div className="dash-skel dash-skel-bar"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DashboardHome = DashboardHome;
window.CopilotSidebar = CopilotSidebar;
window.EmptyDashboard = EmptyDashboard;
