/* SolAI Flow 5 — Campaigns: List, Detail/Plan, Creatives, A/B Test, Approve Modal */

const CAMPAIGNS = [
  {id:'c1', name:'Ankara Print Tee — Indigo Launch', state:'live', stage:'Optimizing', channels:['meta','google','whatsapp'], spend:2840, cap:5000, roas:4.2, orders:84, cpa:33.81, lastEdit:'Optimizer · 12m ago'},
  {id:'c2', name:'Cape Threads Linen Collection', state:'live', stage:'Live', channels:['meta','whatsapp'], spend:1290, cap:3000, roas:3.6, orders:42, cpa:30.71, lastEdit:'Optimizer · 47m ago'},
  {id:'c3', name:'Holiday Gift Bundles 2026', state:'learning', stage:'Learning', channels:['meta','google'],spend:480, cap:2500, roas:2.1, orders:9, cpa:53.33, lastEdit:'Planner · 2h ago'},
  {id:'c4', name:'Diaspora Outreach — EU + UK', state:'paused', stage:'Paused', channels:['meta','google'],spend:1640, cap:4000, roas:1.8, orders:18, cpa:91.11, lastEdit:'You · 1d ago'},
  {id:'c5', name:'WhatsApp Re-engagement Q1', state:'draft', stage:'Awaiting approval', channels:['whatsapp'],spend:0, cap:1500, roas:null, orders:0, cpa:null, lastEdit:'Planner · 6h ago'},
];

function ChannelChip({c}) {
  const map={meta:{bg:'rgba(91,124,255,.12)',color:'#5B7CFF',label:'Meta'},google:{bg:'rgba(255,181,71,.12)',color:'#FFB547',label:'Google'},whatsapp:{bg:'rgba(52,211,153,.12)',color:'#34D399',label:'WhatsApp'}};
  const m=map[c]||{bg:'var(--surface-2)',color:'var(--text-muted)',label:c};
  return <span className="cmp-chip" style={{background:m.bg,color:m.color}}>{m.label}</span>;
}

function StatePill({state}) {
  const map={live:{bg:'rgba(52,211,153,.12)',c:'#34D399',l:'Live'},learning:{bg:'rgba(122,167,255,.12)',c:'#7AA7FF',l:'Learning'},paused:{bg:'rgba(255,181,71,.12)',c:'#FFB547',l:'Paused'},draft:{bg:'var(--surface-2)',c:'var(--text-muted)',l:'Draft'}};
  const m=map[state]||map.draft;
  return <span className="cmp-state" style={{background:m.bg,color:m.c}}><span className="cmp-state-dot" style={{background:m.c}}/>{m.l}</span>;
}

function MoneyVal({v,c='US$'}) {
  if (v==null) return <span className="cmp-muted">—</span>;
  return <span className="cmp-money">{c} {v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</span>;
}

function BudgetBar({spend,cap}){
  const pct=Math.min((spend/cap)*100,100);
  const tone=pct>85?'var(--warning)':pct>95?'var(--danger)':'var(--brand)';
  return (
    <div className="cmp-bar"><div className="cmp-bar-fill" style={{width:pct+'%',background:tone}}/></div>
  );
}

/* ── Campaign List ── */
function CampaignsList({onOpen, onApprove}) {
  const [filter,setFilter]=React.useState('all');
  const filtered = filter==='all'?CAMPAIGNS:CAMPAIGNS.filter(c=>c.state===filter);
  return (
    <div className="cmp-page">
      <div className="cmp-page-head">
        <div>
          <h1 className="cmp-h1">Campaigns</h1>
          <p className="cmp-sub">5 campaigns · 3 live · US$ 6,250 spent this month</p>
        </div>
        <div className="cmp-page-actions">
          <button className="cmp-btn cmp-btn-secondary"><ShIcon name="settings" size={14}/> Bulk edit</button>
          <button className="cmp-btn cmp-btn-primary"><ShIcon name="zap" size={14}/> New campaign</button>
        </div>
      </div>

      <div className="cmp-filter-row">
        {[{id:'all',l:'All',n:5},{id:'live',l:'Live',n:2},{id:'learning',l:'Learning',n:1},{id:'paused',l:'Paused',n:1},{id:'draft',l:'Awaiting approval',n:1}].map(f=>(
          <button key={f.id} className={`cmp-filter ${filter===f.id?'cmp-filter-on':''}`} onClick={()=>setFilter(f.id)}>
            {f.l} <span className="cmp-filter-num">{f.n}</span>
          </button>
        ))}
        <div className="cmp-filter-spacer"/>
        <div className="cmp-search-wrap">
          <ShIcon name="search" size={14}/>
          <input className="cmp-search" placeholder="Search campaigns…"/>
        </div>
      </div>

      <div className="cmp-table-wrap">
        <table className="cmp-table">
          <thead>
            <tr>
              <th>Name</th><th>State</th><th>Channels</th><th>Spend / Cap</th><th>ROAS</th><th>Orders</th><th>CPA</th><th>Last edit</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} className="cmp-row" onClick={()=>onOpen(c)}>
                <td><strong className="cmp-name">{c.name}</strong></td>
                <td><StatePill state={c.state}/></td>
                <td><div className="cmp-chips">{c.channels.map(ch=><ChannelChip key={ch} c={ch}/>)}</div></td>
                <td className="cmp-cell-budget"><MoneyVal v={c.spend}/> / <span className="cmp-muted">{c.cap.toLocaleString()}</span><BudgetBar spend={c.spend} cap={c.cap}/></td>
                <td className="cmp-num">{c.roas==null?<span className="cmp-muted">—</span>:c.roas.toFixed(1)+'×'}</td>
                <td className="cmp-num">{c.orders}</td>
                <td className="cmp-num">{c.cpa==null?<span className="cmp-muted">—</span>:<MoneyVal v={c.cpa}/>}</td>
                <td className="cmp-edit">{c.lastEdit}</td>
                <td>
                  {c.state==='draft' ? (
                    <button className="cmp-btn cmp-btn-primary cmp-btn-sm" onClick={e=>{e.stopPropagation();onApprove(c);}}>Review</button>
                  ) : (
                    <button className="cmp-btn-icon" onClick={e=>{e.stopPropagation();onOpen(c);}}><ShIcon name="chevronRight" size={16}/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Detail / Plan view ── */
function CampaignDetail({campaign, onBack, onCreatives, onABTest}) {
  const c = campaign || CAMPAIGNS[0];
  const [tab,setTab] = React.useState('plan');

  const allocations = [
    {channel:'Meta — Reels (IG)', pct:35, spend:994, roas:5.1, color:'#5B7CFF'},
    {channel:'Meta — Feed (FB)', pct:25, spend:710, roas:3.8, color:'#7AA7FF'},
    {channel:'Google — Search', pct:25, spend:710, roas:4.4, color:'#FFB547'},
    {channel:'WhatsApp — Catalog', pct:15, spend:426, roas:3.2, color:'#34D399'},
  ];
  const audiences = [
    {name:'Women 25–34 · East Africa', size:'~280K', cpa:24.10, status:'scaling'},
    {name:'Diaspora · EU + UK · Fashion intent', size:'~140K', cpa:38.40, status:'steady'},
    {name:'Men 25–44 · Gift buyers · RW + KE', size:'~95K', cpa:41.20, status:'learning'},
    {name:'Lookalike 1% — past 90d buyers', size:'~210K', cpa:21.80, status:'scaling'},
  ];

  return (
    <div className="cmp-page">
      <button className="cmp-back-btn" onClick={onBack}><ShIcon name="chevronLeft" size={14}/> Campaigns</button>

      <div className="cmp-detail-head">
        <div>
          <div className="cmp-detail-meta">
            <StatePill state={c.state}/>
            <span className="cmp-meta-sep">·</span>
            <span className="cmp-meta-text">{c.stage}</span>
            <span className="cmp-meta-sep">·</span>
            <span className="cmp-meta-text">Created Apr 28, 2026</span>
          </div>
          <h1 className="cmp-h1">{c.name}</h1>
          <div className="cmp-detail-channels">{c.channels.map(ch=><ChannelChip key={ch} c={ch}/>)}</div>
        </div>
        <div className="cmp-detail-actions">
          <button className="cmp-btn cmp-btn-secondary"><ShIcon name="copy" size={14}/> Duplicate</button>
          <button className="cmp-btn cmp-btn-secondary"><ShIcon name="settings" size={14}/> Settings</button>
          <button className="cmp-btn cmp-btn-warning"><ShIcon name="x" size={14}/> Pause campaign</button>
        </div>
      </div>

      <div className="cmp-stat-grid">
        <div className="cmp-stat-card"><span className="cmp-stat-label">Spend / Cap</span><div className="cmp-stat-row"><span className="cmp-stat-val">US$ 2,840</span><span className="cmp-stat-of">/ 5,000</span></div><BudgetBar spend={c.spend} cap={c.cap}/></div>
        <div className="cmp-stat-card"><span className="cmp-stat-label">ROAS</span><span className="cmp-stat-val cmp-stat-good">4.2×</span><span className="cmp-stat-delta">+0.4× vs plan</span></div>
        <div className="cmp-stat-card"><span className="cmp-stat-label">Orders</span><span className="cmp-stat-val">84</span><span className="cmp-stat-delta cmp-stat-good">+12 today</span></div>
        <div className="cmp-stat-card"><span className="cmp-stat-label">CPA</span><span className="cmp-stat-val cmp-stat-good">US$ 33.81</span><span className="cmp-stat-delta">target ≤ 40.00</span></div>
        <div className="cmp-stat-card"><span className="cmp-stat-label">CTR</span><span className="cmp-stat-val">2.4%</span><span className="cmp-stat-delta">channel avg 1.6%</span></div>
        <div className="cmp-stat-card"><span className="cmp-stat-label">AOV</span><span className="cmp-stat-val">US$ 142</span><span className="cmp-stat-delta">+US$ 8 vs avg</span></div>
      </div>

      <div className="cmp-tabs">
        {[{id:'plan',l:'Plan'},{id:'creatives',l:'Creatives'},{id:'audience',l:'Audiences'},{id:'experiments',l:'Experiments'},{id:'history',l:'History'}].map(t=>(
          <button key={t.id} className={tab===t.id?'cmp-tab cmp-tab-on':'cmp-tab'} onClick={()=>{
            if (t.id==='creatives') onCreatives();
            else if (t.id==='experiments') onABTest();
            else setTab(t.id);
          }}>{t.l}</button>
        ))}
      </div>

      {tab==='plan' && (
        <div className="cmp-plan-grid">
          <section className="cmp-section">
            <h3 className="cmp-section-title">Channel allocation</h3>
            <p className="cmp-section-sub">Auto-rebalanced every 15 min by Optimizer Agent based on rolling ROAS.</p>
            <div className="cmp-alloc-bar">
              {allocations.map((a,i)=><div key={i} style={{width:a.pct+'%',background:a.color}} title={`${a.channel}: ${a.pct}%`}/>)}
            </div>
            <div className="cmp-alloc-list">
              {allocations.map((a,i)=>(
                <div key={i} className="cmp-alloc-row">
                  <div className="cmp-alloc-swatch" style={{background:a.color}}/>
                  <span className="cmp-alloc-name">{a.channel}</span>
                  <span className="cmp-alloc-pct">{a.pct}%</span>
                  <span className="cmp-alloc-spend">US$ {a.spend.toLocaleString()}</span>
                  <span className="cmp-alloc-roas">{a.roas.toFixed(1)}×</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cmp-section">
            <h3 className="cmp-section-title">Audiences</h3>
            <p className="cmp-section-sub">SolAI tested 7 audiences. These 4 are active.</p>
            <div className="cmp-aud-list">
              {audiences.map((a,i)=>(
                <div key={i} className="cmp-aud-row">
                  <div className="cmp-aud-info">
                    <strong>{a.name}</strong>
                    <span>{a.size} matches · CPA US$ {a.cpa.toFixed(2)}</span>
                  </div>
                  <span className={`cmp-aud-status cmp-aud-${a.status}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cmp-section cmp-section-wide">
            <h3 className="cmp-section-title">Recent agent actions</h3>
            <ol className="cmp-actions-list">
              {[
                {agent:'Optimizer',time:'12m ago',msg:'Increased Meta Reels budget +15% (US$ 119/day → 137/day) — CPA running 18% under target.'},
                {agent:'Creative',time:'1h ago',msg:'Generated 3 new Reels variants with French and Kinyarwanda voiceover.'},
                {agent:'Optimizer',time:'2h ago',msg:'Paused Google ad set "broad-keywords-2" — CTR fell to 0.4% (target ≥ 1.2%).'},
                {agent:'Sales',time:'3h ago',msg:'Closed 4 WhatsApp conversations into orders (US$ 568 total).'},
              ].map((a,i)=>(
                <li key={i} className="cmp-action-row">
                  <span className="cmp-action-bullet"/>
                  <span className="cmp-action-agent">{a.agent}</span>
                  <span className="cmp-action-time">{a.time}</span>
                  <span className="cmp-action-msg">{a.msg}</span>
                  <button className="cmp-why-btn">Why?</button>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}

      {tab==='audience' && <div className="cmp-section"><p className="cmp-empty-text">Audience tab content (placeholder for this prototype).</p></div>}
      {tab==='history' && <div className="cmp-section"><p className="cmp-empty-text">History tab content (placeholder for this prototype).</p></div>}
    </div>
  );
}

/* ── Creatives view ── */
function CreativesView({onBack}) {
  const creatives = [
    {id:'cv1',channel:'meta',format:'Reel · 9:16',copy:'When Kigali sunlight meets indigo wax-print. Hand-cut. Made for movement.',ctr:3.1,cpa:28.40,impr:42180,status:'winning'},
    {id:'cv2',channel:'meta',format:'Reel · 9:16',copy:'Ankara, but not how you remember it. Cut sharp. Worn loud.',ctr:2.4,cpa:34.20,impr:38090,status:'live'},
    {id:'cv3',channel:'meta',format:'Feed · 1:1',copy:'Indigo. Ankara. 100% cotton. Made in Kigali. Sizes XS–3XL.',ctr:1.8,cpa:41.10,impr:51220,status:'live'},
    {id:'cv4',channel:'google',format:'Search · Headline',copy:'Handmade Ankara Tees · Free shipping over US$ 80',ctr:4.2,cpa:31.80,impr:18430,status:'live'},
    {id:'cv5',channel:'meta',format:'Reel · 9:16',copy:'Three pieces. One indigo. Tell us which is yours.',ctr:0.9,cpa:62.10,impr:14280,status:'paused'},
    {id:'cv6',channel:'whatsapp',format:'Catalog card',copy:'Ankara Indigo Tee · $35 · Reply YES to order with MoMo',ctr:8.6,cpa:18.40,impr:8920,status:'winning'},
  ];

  const [selected,setSelected] = React.useState('cv1');
  const cur = creatives.find(c=>c.id===selected);

  return (
    <div className="cmp-page">
      <button className="cmp-back-btn" onClick={onBack}><ShIcon name="chevronLeft" size={14}/> Campaign overview</button>
      <div className="cmp-page-head">
        <div>
          <h1 className="cmp-h1">Creatives</h1>
          <p className="cmp-sub">Ankara Print Tee — Indigo Launch · 6 variants · Generated by Creative Agent</p>
        </div>
        <div className="cmp-page-actions">
          <button className="cmp-btn cmp-btn-secondary"><ShIcon name="copy" size={14}/> Export all</button>
          <button className="cmp-btn cmp-btn-primary"><ShIcon name="zap" size={14}/> Generate variant</button>
        </div>
      </div>

      <div className="cmp-creative-layout">
        <div className="cmp-creative-grid">
          {creatives.map(cv=>(
            <div key={cv.id} className={`cmp-creative-card ${selected===cv.id?'cmp-creative-on':''}`} onClick={()=>setSelected(cv.id)}>
              <div className={`cmp-creative-preview cmp-cp-${cv.format.includes('9:16')?'reel':cv.format.includes('1:1')?'square':'wide'}`}>
                <div className="cmp-creative-channel"><ChannelChip c={cv.channel}/></div>
                <div className="cmp-creative-fmt">{cv.format}</div>
                <div className="cmp-creative-copy">{cv.copy}</div>
                {cv.status==='winning' && <div className="cmp-winner-badge"><ShIcon name="zap" size={12}/> Winning</div>}
                {cv.status==='paused' && <div className="cmp-paused-badge">Paused</div>}
              </div>
              <div className="cmp-creative-stats">
                <div><span>CTR</span><strong>{cv.ctr}%</strong></div>
                <div><span>CPA</span><strong>${cv.cpa.toFixed(2)}</strong></div>
                <div><span>Impr.</span><strong>{(cv.impr/1000).toFixed(1)}K</strong></div>
              </div>
            </div>
          ))}
        </div>

        <aside className="cmp-creative-detail">
          <h3>Variant detail</h3>
          <div className="cmp-detail-pic">{cur.format}</div>
          <div className="cmp-detail-stats">
            <div className="cmp-detail-stat"><span>CTR</span><strong>{cur.ctr}%</strong></div>
            <div className="cmp-detail-stat"><span>CPA</span><strong>US$ {cur.cpa.toFixed(2)}</strong></div>
            <div className="cmp-detail-stat"><span>Impressions</span><strong>{cur.impr.toLocaleString()}</strong></div>
            <div className="cmp-detail-stat"><span>Status</span><strong style={{textTransform:'capitalize'}}>{cur.status}</strong></div>
          </div>
          <h4 className="cmp-detail-h4">Generation prompt</h4>
          <p className="cmp-detail-prompt">"Highlight craftsmanship and indigo dye process. Reach women 25-34 in Kigali, Nairobi, and EU diaspora. Tone: confident, not formal. Test French + Kinyarwanda voiceover."</p>
          <h4 className="cmp-detail-h4">Why this won</h4>
          <p className="cmp-detail-why">Reels {selected.toUpperCase()} drove 3.1% CTR — 1.8× the channel baseline — because the indigo dye process clip hits longer dwell. Optimizer increased its budget share to 22% on Apr 30.</p>
          <div className="cmp-detail-actions">
            <button className="cmp-btn cmp-btn-secondary"><ShIcon name="copy" size={14}/> Duplicate</button>
            <button className="cmp-btn cmp-btn-warning"><ShIcon name="x" size={14}/> Pause</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── A/B Test view ── */
function ABTestView({onBack}) {
  const tests = [
    {id:'t1',name:'CTA copy: "Shop now" vs "Get yours"',state:'running',variant:'A',winner:null,metric:'CTR',a:{name:'Shop now',val:2.1,sample:14820},b:{name:'Get yours',val:2.6,sample:14920},lift:23.8,confidence:87},
    {id:'t2',name:'Hero image: lifestyle vs flat-lay',state:'completed',variant:'B',winner:'B',metric:'CPA',a:{name:'Lifestyle',val:38.40,sample:22100},b:{name:'Flat-lay',val:31.20,sample:21980},lift:18.7,confidence:96},
    {id:'t3',name:'Voiceover language: EN vs FR vs RW',state:'running',variant:null,winner:null,metric:'CTR',a:{name:'EN',val:2.2,sample:9800},b:{name:'FR',val:2.7,sample:9740},lift:22.7,confidence:64},
    {id:'t4',name:'Price display: $35 vs $35.00 vs RWF',state:'queued',variant:null,winner:null,metric:'CTR',a:{name:'—',val:0,sample:0},b:{name:'—',val:0,sample:0},lift:0,confidence:0},
  ];
  const [selected,setSelected] = React.useState(tests[1]);

  return (
    <div className="cmp-page">
      <button className="cmp-back-btn" onClick={onBack}><ShIcon name="chevronLeft" size={14}/> Campaign overview</button>
      <div className="cmp-page-head">
        <div>
          <h1 className="cmp-h1">Experiments</h1>
          <p className="cmp-sub">Ankara Print Tee — Indigo Launch · 4 tests · Min sample 10K per variant</p>
        </div>
        <div className="cmp-page-actions">
          <button className="cmp-btn cmp-btn-primary"><ShIcon name="zap" size={14}/> New experiment</button>
        </div>
      </div>

      <div className="cmp-ab-layout">
        <div className="cmp-ab-list">
          {tests.map(t=>(
            <button key={t.id} className={`cmp-ab-row ${selected.id===t.id?'cmp-ab-on':''}`} onClick={()=>setSelected(t)}>
              <div className="cmp-ab-row-name">
                <strong>{t.name}</strong>
                <span className={`cmp-ab-state cmp-ab-state-${t.state}`}>{t.state}</span>
              </div>
              {t.state==='completed' && <span className="cmp-ab-winner">Variant {t.winner} won · +{t.lift.toFixed(1)}%</span>}
              {t.state==='running' && <span className="cmp-ab-running">{t.confidence}% confidence · need {100-t.confidence}% more samples</span>}
              {t.state==='queued' && <span className="cmp-ab-queued">Awaiting capacity</span>}
            </button>
          ))}
        </div>

        <div className="cmp-ab-detail">
          <h3>{selected.name}</h3>
          <div className="cmp-ab-meta">
            <span>Metric: <strong>{selected.metric}</strong></span>
            <span className="cmp-meta-sep">·</span>
            <span>State: <strong style={{textTransform:'capitalize'}}>{selected.state}</strong></span>
            {selected.state!=='queued' && (
              <>
                <span className="cmp-meta-sep">·</span>
                <span>Confidence: <strong>{selected.confidence}%</strong></span>
              </>
            )}
          </div>

          {selected.state!=='queued' ? (
            <div className="cmp-ab-variants">
              <div className={`cmp-variant ${selected.winner==='A'?'cmp-variant-win':''}`}>
                <div className="cmp-variant-head"><span>Variant A</span>{selected.winner==='A'&&<span className="cmp-win-tag">Winner</span>}</div>
                <strong className="cmp-variant-name">{selected.a.name}</strong>
                <div className="cmp-variant-stat">
                  <span>{selected.metric}</span>
                  <strong>{selected.metric==='CPA'?'US$ ':''}{selected.a.val.toFixed(selected.metric==='CPA'?2:1)}{selected.metric==='CTR'?'%':''}</strong>
                </div>
                <div className="cmp-variant-meta">{selected.a.sample.toLocaleString()} samples</div>
                <div className="cmp-variant-bar"><div style={{width:'56%',background:selected.winner==='A'?'var(--success)':'var(--brand)'}}/></div>
              </div>
              <div className="cmp-vs-divider">vs</div>
              <div className={`cmp-variant ${selected.winner==='B'?'cmp-variant-win':''}`}>
                <div className="cmp-variant-head"><span>Variant B</span>{selected.winner==='B'&&<span className="cmp-win-tag">Winner</span>}</div>
                <strong className="cmp-variant-name">{selected.b.name}</strong>
                <div className="cmp-variant-stat">
                  <span>{selected.metric}</span>
                  <strong>{selected.metric==='CPA'?'US$ ':''}{selected.b.val.toFixed(selected.metric==='CPA'?2:1)}{selected.metric==='CTR'?'%':''}</strong>
                </div>
                <div className="cmp-variant-meta">{selected.b.sample.toLocaleString()} samples</div>
                <div className="cmp-variant-bar"><div style={{width:'74%',background:selected.winner==='B'?'var(--success)':'var(--brand)'}}/></div>
              </div>
            </div>
          ) : (
            <div className="cmp-ab-queued-card"><ShIcon name="clock" size={20}/><p>Queued. Will start when current experiment completes.</p></div>
          )}

          {selected.state==='completed' && (
            <div className="cmp-ab-decision">
              <strong>Decision</strong>
              <p>SolAI rolled Variant <strong>{selected.winner}</strong> to 100% on May 4, 2026 at 14:32 UTC. CPA improvement of <strong>{selected.lift.toFixed(1)}%</strong> sustained over 5 days.</p>
              <button className="cmp-link-btn">View audit entry →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Approve/Pause Modal ── */
function ApprovalModal({campaign,onClose}) {
  const [accepted,setAccepted] = React.useState(false);
  if (!campaign) return null;
  return (
    <div className="cmp-modal-overlay" onClick={onClose}>
      <div className="cmp-modal" onClick={e=>e.stopPropagation()}>
        <div className="cmp-modal-head">
          <h2>Review campaign plan</h2>
          <button className="cmp-modal-close" onClick={onClose}><ShIcon name="x" size={18}/></button>
        </div>

        <div className="cmp-modal-body">
          <div className="cmp-modal-banner">
            <ShIcon name="alertTriangle" size={16}/>
            <span>This campaign needs your approval before launch. SolAI built the plan — you sign off on the budget and audience.</span>
          </div>

          <h3 className="cmp-modal-h3">{campaign.name}</h3>

          <dl className="cmp-modal-dl">
            <div><dt>Channels</dt><dd>{campaign.channels.map(ch=><ChannelChip key={ch} c={ch}/>)}</dd></div>
            <div><dt>Budget cap</dt><dd><strong>US$ {campaign.cap.toLocaleString()}</strong> total · <strong>US$ {Math.round(campaign.cap/30)}/day</strong></dd></div>
            <div><dt>Duration</dt><dd>30 days</dd></div>
            <div><dt>Audience</dt><dd>WhatsApp re-engagement of 1,840 customers who placed an order in the last 90 days but haven't returned.</dd></div>
            <div><dt>Goal</dt><dd>Drive ≥ 6% reorder rate · Target ROAS ≥ 4.0×</dd></div>
            <div><dt>Built by</dt><dd>Planner Agent · Run #PL-2847</dd></div>
          </dl>

          <div className="cmp-modal-section">
            <h4>What SolAI will do automatically</h4>
            <ul className="cmp-modal-list">
              <li>Send 3 WhatsApp message variants to test (Optimizer rolls winner to 100% within 48h).</li>
              <li>Re-allocate budget every 15 minutes between variants.</li>
              <li>Pause if CPA exceeds US$ 25 for 3 consecutive hours.</li>
              <li>Attempt close-the-sale via WhatsApp Pay or MoMo when buyer signals intent.</li>
            </ul>
          </div>

          <div className="cmp-modal-section">
            <h4>What it will NOT do without you</h4>
            <ul className="cmp-modal-list cmp-modal-list-warn">
              <li>Spend more than US$ {campaign.cap.toLocaleString()} total or US$ {Math.round(campaign.cap/30)}/day (hard caps).</li>
              <li>Add new channels.</li>
              <li>Issue refunds or modify product prices.</li>
              <li>Send to anyone outside the 1,840-customer source list.</li>
            </ul>
          </div>

          <label className="cmp-modal-consent" onClick={()=>setAccepted(!accepted)}>
            <span className={`cmp-check ${accepted?'cmp-check-on':''}`}>{accepted&&<ShIcon name="check" size={12}/>}</span>
            <span>I authorise SolAI to spend up to <strong>US$ {campaign.cap.toLocaleString()}</strong> on this campaign with the constraints above. I understand budget caps are hard limits and the campaign auto-pauses on the conditions listed.</span>
          </label>
        </div>

        <div className="cmp-modal-foot">
          <button className="cmp-btn cmp-btn-secondary" onClick={onClose}>Send back to Planner</button>
          <button className="cmp-btn cmp-btn-primary" disabled={!accepted} onClick={onClose}>Approve & launch</button>
        </div>
      </div>
    </div>
  );
}

window.CampaignsList = CampaignsList;
window.CampaignDetail = CampaignDetail;
window.CreativesView = CreativesView;
window.ABTestView = ABTestView;
window.ApprovalModal = ApprovalModal;
window.CAMPAIGNS = CAMPAIGNS;
