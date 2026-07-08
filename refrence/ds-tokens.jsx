/* SolAI Design System — Token Previews */

const COLORS_DARK = {
  '--bg': '#0B0D12', '--surface': '#11141B', '--surface-2': '#161A22',
  '--border': '#1F2430', '--text': '#F2F4F7', '--text-muted': '#98A2B3',
  '--text-subtle': '#667085', '--brand': '#5B7CFF', '--brand-soft': '#1B2240',
  '--success': '#34D399', '--warning': '#FFB547', '--danger': '#F97066',
  '--info': '#7AA7FF', '--accent-rwanda': '#34A853'
};
const COLORS_LIGHT = {
  '--bg': '#FFFFFF', '--surface': '#F7F8FA', '--surface-2': '#EEF1F5',
  '--border': '#E4E7EC', '--text': '#0B0D12', '--text-muted': '#475467',
  '--text-subtle': '#667085', '--brand': '#2E5BFF', '--brand-soft': '#E8EEFF',
  '--success': '#0B8A4D', '--warning': '#B25E00', '--danger': '#B42318',
  '--info': '#175CD3', '--accent-rwanda': '#1E8E3E'
};

function ColorGrid() {
  return (
    <div>
      <h3 className="ds-section-title">Colour Tokens</h3>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div>
          <p className="ds-label">Dark (Default)</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:8}}>
            {Object.entries(COLORS_DARK).map(([name, hex]) => (
              <div key={name} className="ds-color-chip">
                <div style={{width:'100%',height:48,borderRadius:8,background:hex,border:'1px solid var(--border)'}}></div>
                <code className="ds-mono-sm">{name}</code>
                <span className="ds-caption">{hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="ds-label">Light</p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:8}}>
            {Object.entries(COLORS_LIGHT).map(([name, hex]) => (
              <div key={name} className="ds-color-chip">
                <div style={{width:'100%',height:48,borderRadius:8,background:hex,border:'1px solid #E4E7EC'}}></div>
                <code className="ds-mono-sm">{name}</code>
                <span className="ds-caption">{hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TYPE_SCALE = [
  { name:'display', size:'clamp(40px,5vw,56px)', weight:600, tracking:'-0.02em', sample:'SolAI Revenue Engine' },
  { name:'h1', size:'clamp(28px,3.5vw,36px)', weight:600, tracking:'-0.01em', sample:'Dashboard Overview' },
  { name:'h2', size:'clamp(22px,2.8vw,28px)', weight:600, tracking:'0', sample:'Campaign Performance' },
  { name:'h3', size:'clamp(18px,2.2vw,22px)', weight:600, tracking:'0', sample:'Active Conversations' },
  { name:'body-lg', size:'clamp(16px,1.8vw,18px)', weight:400, tracking:'0', sample:'Increased Instagram Reels budget by 15% — CPA tracking 18% under target.' },
  { name:'body', size:'clamp(14px,1.5vw,15px)', weight:400, tracking:'0', sample:'Closed sale via WhatsApp · MTN MoMo · RWF 24,500.' },
  { name:'small', size:'clamp(12px,1.3vw,13px)', weight:400, tracking:'0', sample:'Last updated 2 min ago · run_id: 7f3a…' },
  { name:'mono', size:'clamp(12px,1.3vw,13px)', weight:400, tracking:'0', sample:'US$ 4,231.45 / 10,000 cap', mono:true },
];

function TypeScale() {
  return (
    <div>
      <h3 className="ds-section-title">Typography Scale</h3>
      <p className="ds-body-muted">Inter for UI. JetBrains Mono for money, hashes, IDs, section labels. Tabular numerals on all financial data.</p>
      <div style={{display:'flex', flexDirection:'column', gap:16, marginTop:16}}>
        {TYPE_SCALE.map(t => (
          <div key={t.name} style={{display:'flex', alignItems:'baseline', gap:16, paddingBottom:16, borderBottom:'1px solid var(--border)'}}>
            <code className="ds-mono-sm" style={{width:80, flexShrink:0, color:'var(--brand)'}}>{t.name}</code>
            <div style={{flex:1}}>
              <p style={{
                fontSize:t.size, fontWeight:t.weight, letterSpacing:t.tracking,
                fontFamily: t.mono ? "'JetBrains Mono', monospace" : "'Inter', system-ui",
                color:'var(--text)', margin:0, lineHeight:1.3,
                fontFeatureSettings: t.mono ? '"tnum"' : 'normal'
              }}>{t.sample}</p>
            </div>
            <span className="ds-caption" style={{flexShrink:0}}>{t.size} / {t.weight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SPACING = [2,4,6,8,12,16,20,24,32,40,56,80];

function SpacingRuler() {
  return (
    <div>
      <h3 className="ds-section-title">Spacing Scale</h3>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {SPACING.map(s => (
          <div key={s} style={{display:'flex', alignItems:'center', gap:12}}>
            <code className="ds-mono-sm" style={{width:40, textAlign:'right', color:'var(--brand)'}}>{s}</code>
            <div style={{width:s, height:20, background:'var(--brand)', borderRadius:3, opacity:0.7, minWidth:2}}></div>
            <span className="ds-caption">{s}px</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const RADII = [
  {name:'--r-sm', val:6, use:'Small pills, tags'},
  {name:'--r-md', val:10, use:'Inputs, buttons'},
  {name:'--r-lg', val:14, use:'Cards, panels'},
  {name:'--r-xl', val:20, use:'Modals, sheets'},
  {name:'--r-pill', val:9999, use:'Pill buttons, badges'},
];

function RadiusSamples() {
  return (
    <div>
      <h3 className="ds-section-title">Border Radius</h3>
      <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
        {RADII.map(r => (
          <div key={r.name} style={{textAlign:'center'}}>
            <div style={{width:72, height:72, borderRadius:r.val, border:'2px solid var(--brand)', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <code className="ds-mono-sm" style={{fontSize:11}}>{r.val}</code>
            </div>
            <code className="ds-mono-sm" style={{display:'block', marginTop:6, color:'var(--brand)'}}>{r.name}</code>
            <span className="ds-caption">{r.use}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ElevationSamples() {
  return (
    <div>
      <h3 className="ds-section-title">Elevation</h3>
      <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
        {[
          {name:'e1', desc:'Default surfaces', style:{border:'1px solid var(--border)'}},
          {name:'e2', desc:'Popovers, dropdowns', style:{border:'1px solid var(--border)', boxShadow:'0 1px 2px rgba(16,24,40,.06)'}},
          {name:'e3', desc:'Modals', style:{border:'1px solid var(--border)', boxShadow:'0 8px 24px rgba(16,24,40,.10)'}},
        ].map(e => (
          <div key={e.name} style={{...e.style, width:160, height:100, borderRadius:14, background:'var(--surface)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4}}>
            <code className="ds-mono-sm" style={{color:'var(--brand)'}}>{e.name}</code>
            <span className="ds-caption">{e.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MotionSamples() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div>
      <h3 className="ds-section-title">Motion</h3>
      <p className="ds-body-muted">Default 120–200ms. Ease: cubic-bezier(.2,.8,.2,1). All honour prefers-reduced-motion.</p>
      <div style={{display:'flex', gap:16, marginTop:12, alignItems:'center'}}>
        <button className="ds-btn ds-btn-secondary" onClick={() => setPlaying(!playing)}>
          {playing ? 'Reset' : 'Play transitions'}
        </button>
        <div style={{
          width:48, height:48, borderRadius:10, background:'var(--brand)',
          transform: playing ? 'translateX(120px) scale(1.1)' : 'translateX(0) scale(1)',
          opacity: playing ? 1 : 0.6,
          transition: 'all 200ms cubic-bezier(.2,.8,.2,1)',
        }}></div>
        <div style={{
          width:48, height:48, borderRadius:'50%', background:'var(--success)',
          transform: playing ? 'translateX(80px)' : 'translateX(0)',
          opacity: playing ? 1 : 0.6,
          transition: 'all 150ms cubic-bezier(.2,.8,.2,1)',
        }}></div>
      </div>
    </div>
  );
}

function TokensSection() {
  return (
    <section id="tokens">
      <h2 className="ds-h2">Design Tokens</h2>
      <div style={{display:'flex', flexDirection:'column', gap:48}}>
        <ColorGrid />
        <TypeScale />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32}}>
          <SpacingRuler />
          <div style={{display:'flex', flexDirection:'column', gap:32}}>
            <RadiusSamples />
            <ElevationSamples />
          </div>
        </div>
        <MotionSamples />
      </div>
    </section>
  );
}

window.TokensSection = TokensSection;
