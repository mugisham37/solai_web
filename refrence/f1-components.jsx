/* SolAI Flow 1 — Marketing Site Shared Components */

/* ── Nav ── */
function MarketingNav({ currentScreen, onNavigate, theme, onThemeToggle }) {
  const links = [
    { id: 'landing', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'africa', label: 'For Africa' },
    { id: 'demo', label: 'Contact' },
  ];
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="mk-nav">
      <div className="mk-nav-inner">
        <a href="#" className="mk-logo" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2"/><circle cx="14" cy="14" r="5" fill="var(--brand)"/></svg>
          <span>SolAI</span>
        </a>
        <nav className="mk-nav-links" data-open={mobileOpen}>
          {links.map(l => (
            <a key={l.id} href="#" className={currentScreen === l.id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onNavigate(l.id); setMobileOpen(false); }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mk-nav-actions">
          <button className="mk-theme-btn" onClick={onThemeToggle} aria-label="Toggle theme">
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a href="#" className="mk-nav-login" onClick={(e) => e.preventDefault()}>Log in</a>
          <a href="#" className="mk-btn-cta" onClick={(e) => { e.preventDefault(); onNavigate('demo'); }}>Start free</a>
        </div>
        <button className="mk-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}

/* ── Footer ── */
function MarketingFooter({ onNavigate }) {
  return (
    <footer className="mk-footer">
      <div className="mk-footer-inner">
        <div className="mk-footer-brand">
          <div className="mk-logo" style={{marginBottom: 12}}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2"/><circle cx="14" cy="14" r="5" fill="var(--brand)"/></svg>
            <span>SolAI</span>
          </div>
          <p>The autonomous revenue engine for e-commerce sellers. Built by Digisi Rwanda.</p>
        </div>
        <div className="mk-footer-col">
          <h4>Product</h4>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('features'); }}>Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('pricing'); }}>Pricing</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('africa'); }}>For Africa</a>
          <a href="#">Changelog</a>
        </div>
        <div className="mk-footer-col">
          <h4>Company</h4>
          <a href="#">About Digisi</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('demo'); }}>Contact</a>
        </div>
        <div className="mk-footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">GDPR</a>
          <a href="#">Rwanda DPL</a>
        </div>
      </div>
      <div className="mk-footer-bottom">
        <span>© 2026 Digisi Rwanda. All rights reserved.</span>
        <div className="mk-compliance-strip">
          <span className="mk-compliance-badge">Hard caps</span>
          <span className="mk-compliance-badge">Audit-grade</span>
          <span className="mk-compliance-badge">GDPR</span>
          <span className="mk-compliance-badge">POPIA</span>
          <span className="mk-compliance-badge">Rwanda DPL</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Section Label (monospace uppercase, RevenueBase-style) ── */
function SectionLabel({ children }) {
  return <p className="mk-section-label">{children}</p>;
}

/* ── Stat Block ── */
function StatBlock({ value, label }) {
  return (
    <div className="mk-stat">
      <span className="mk-stat-value">{value}</span>
      <span className="mk-stat-label">{label}</span>
    </div>
  );
}

/* ── FAQ Accordion ── */
function FAQ({ items }) {
  const [openIdx, setOpenIdx] = React.useState(null);
  return (
    <div className="mk-faq-list">
      {items.map((item, i) => (
        <div key={i} className={`mk-faq-item ${openIdx === i ? 'mk-faq-open' : ''}`}>
          <button className="mk-faq-trigger" onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}>
            <span className="mk-faq-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="mk-faq-q">{item.q}</span>
            <svg className="mk-faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {openIdx === i && (
            <div className="mk-faq-answer">
              <p>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Testimonial Card ── */
function TestimonialCard({ name, company, location, quote }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const colors = ['#5B7CFF', '#34D399', '#FFB547', '#F97066', '#7AA7FF', '#34A853'];
  const color = colors[name.length % colors.length];
  return (
    <div className="mk-testimonial">
      <p className="mk-testimonial-quote">"{quote}"</p>
      <div className="mk-testimonial-author">
        <div className="mk-testimonial-avatar" style={{ background: color + '18', color }}>{initials}</div>
        <div>
          <span className="mk-testimonial-name">{name}</span>
          <span className="mk-testimonial-co">{company} · {location}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Icon helper (minimal Lucide-style) ── */
function MkIcon({ name, size = 20 }) {
  const paths = {
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    messageCircle: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>,
    barChart: <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    creditCard: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    refreshCw: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.helpCircle}
    </svg>
  );
}

window.MarketingNav = MarketingNav;
window.MarketingFooter = MarketingFooter;
window.SectionLabel = SectionLabel;
window.StatBlock = StatBlock;
window.FAQ = FAQ;
window.TestimonialCard = TestimonialCard;
window.MkIcon = MkIcon;
