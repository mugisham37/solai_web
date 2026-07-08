/* SolAI Flow 4 — App Shell (Sidebar + Topbar + Notifications Drawer) */

/* ── Icon helper ── */
function ShIcon({name, size=20}) {
  const p = {
    home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    barChart: <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    messageCircle: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>,
    shoppingBag: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
    dollarSign: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    creditCard: <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    panelLeft: <><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></>,
    menu: <><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    alertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{p[name]||p.helpCircle}</svg>;
}

const NAV_ITEMS = [
  {id:'dashboard', icon:'home', label:'Dashboard'},
  {id:'campaigns', icon:'target', label:'Campaigns'},
  {id:'conversations', icon:'messageCircle', label:'Conversations'},
  {id:'orders', icon:'shoppingBag', label:'Orders'},
  {id:'audit', icon:'clock', label:'Audit Log'},
  {id:'safety', icon:'shield', label:'Safety Center'},
  {id:'reports', icon:'pieChart', label:'Reports'},
  {id:'settings', icon:'settings', label:'Settings'},
];

/* ── Sidebar ── */
function AppSidebar({collapsed, onToggle, activeNav, onNav}) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'app-sidebar-collapsed' : ''}`}>
      <div className="app-sidebar-header">
        <a href="#" className="app-sidebar-logo" onClick={e=>{e.preventDefault();onNav('dashboard');}}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2"/><circle cx="14" cy="14" r="5" fill="var(--brand)"/></svg>
          {!collapsed && <span>SolAI</span>}
        </a>
        <button className="app-sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          <ShIcon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={16}/>
        </button>
      </div>
      <nav className="app-sidebar-nav">
        {NAV_ITEMS.map(item => (
          <a key={item.id} href="#" className={`app-nav-item ${activeNav===item.id?'app-nav-active':''}`}
            onClick={e=>{e.preventDefault();onNav(item.id);}} title={collapsed ? item.label : undefined}>
            <ShIcon name={item.icon} size={18}/>
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
      <div className="app-sidebar-footer">
        {!collapsed && (
          <div className="app-sidebar-user">
            <div className="app-user-avatar">IB</div>
            <div className="app-user-info">
              <strong>Inema Boutique</strong>
              <span>Growth plan</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── Topbar ── */
function AppTopbar({title, onNotifications, notifCount, onSearch, onThemeToggle, theme, onMenuToggle}) {
  return (
    <header className="app-topbar">
      <button className="app-topbar-menu" onClick={onMenuToggle} aria-label="Menu"><ShIcon name="menu" size={20}/></button>
      <h1 className="app-topbar-title">{title}</h1>
      <div className="app-topbar-actions">
        <button className="app-topbar-btn" onClick={onSearch} aria-label="Search" title="⌘K"><ShIcon name="search" size={18}/></button>
        <button className="app-topbar-btn" onClick={onThemeToggle} aria-label="Toggle theme">
          <ShIcon name={theme==='dark'?'sun':'moon'} size={18}/>
        </button>
        <button className="app-topbar-btn app-notif-btn" onClick={onNotifications} aria-label="Notifications">
          <ShIcon name="bell" size={18}/>
          {notifCount > 0 && <span className="app-notif-badge">{notifCount}</span>}
        </button>
      </div>
    </header>
  );
}

/* ── Notifications Drawer ── */
function NotificationsDrawer({open, onClose}) {
  const [tab, setTab] = React.useState('all');
  const notifications = [
    {type:'success', agent:'Optimizer', msg:'Increased Instagram Reels budget by 15% — CPA tracking 18% under target.', time:'2m ago'},
    {type:'success', agent:'Sales Agent', msg:'Closed sale via WhatsApp · MTN MoMo · RWF 24,500.', time:'18m ago'},
    {type:'warning', agent:'Optimizer', msg:'Paused Google Search ad set "broad-keywords-2" — CTR fell to 0.4%.', time:'34m ago'},
    {type:'info', agent:'Creative', msg:'Generated 3 new creative variants for "Ankara Print Tee — Indigo".', time:'1h ago'},
    {type:'danger', agent:'Safety', msg:'Quarantined inbound DM as suspected prompt-injection.', time:'2h ago'},
    {type:'info', agent:'Planner', msg:'Campaign "Cape Threads Linen" moved from Learning to Live.', time:'3h ago'},
  ];
  const typeColor = {success:'var(--success)',warning:'var(--warning)',danger:'var(--danger)',info:'var(--info)'};
  const filtered = tab === 'all' ? notifications : tab === 'actions' ? notifications.filter(n=>n.type==='warning'||n.type==='danger') : notifications.filter(n=>n.type==='success');

  if (!open) return null;
  return (
    <div className="app-drawer-overlay" onClick={onClose}>
      <div className="app-drawer" onClick={e=>e.stopPropagation()}>
        <div className="app-drawer-header">
          <h2>Notifications</h2>
          <button className="app-drawer-close" onClick={onClose}><ShIcon name="x" size={18}/></button>
        </div>
        <div className="app-drawer-tabs">
          {[{id:'all',label:'All'},{id:'actions',label:'Needs attention'},{id:'wins',label:'Wins'}].map(t => (
            <button key={t.id} className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="app-drawer-list">
          {filtered.map((n,i) => (
            <div key={i} className="app-notif-item">
              <div className="app-notif-dot" style={{background:typeColor[n.type]}}/>
              <div className="app-notif-content">
                <div className="app-notif-meta">
                  <span style={{color:typeColor[n.type],fontWeight:500}}>{n.agent}</span>
                  <span className="app-notif-time">{n.time}</span>
                </div>
                <p>{n.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── App Shell ── */
function AppShell({children, activeNav, onNav, screenTitle}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [theme, setTheme] = React.useState('dark');
  const [mobileMenu, setMobileMenu] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`app-shell ${collapsed ? 'app-shell-collapsed' : ''}`}>
      <AppSidebar collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)} activeNav={activeNav} onNav={(id)=>{onNav(id);setMobileMenu(false);}}/>
      {mobileMenu && <div className="app-mobile-overlay" onClick={()=>setMobileMenu(false)}/>}
      <div className="app-main-area">
        <AppTopbar title={screenTitle||'Dashboard'} onNotifications={()=>setNotifOpen(!notifOpen)} notifCount={3}
          onSearch={()=>{}} onThemeToggle={()=>setTheme(t=>t==='dark'?'light':'dark')} theme={theme}
          onMenuToggle={()=>setMobileMenu(!mobileMenu)}/>
        <main className="app-content">
          {children}
        </main>
      </div>
      <NotificationsDrawer open={notifOpen} onClose={()=>setNotifOpen(false)}/>
    </div>
  );
}

window.ShIcon = ShIcon;
window.AppShell = AppShell;
window.NAV_ITEMS = NAV_ITEMS;
