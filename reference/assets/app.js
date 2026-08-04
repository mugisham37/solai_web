/* =========================================================
   SolAI — demo runtime v3
   Two products in one prototype:
     · the seller / buyer app  — screens 1-15, mobile-first
     · the admin console       — screens A1-A6, desktop-first
   The device switcher in the top bar resizes the container,
   and every layout rule is a container query, so what you see
   is what a real phone / tablet / laptop renders.
   ========================================================= */

const STEPS = [
  {n:1, c:'1',  f:'01-live.html',  id:'s01', t:'What are you selling?',  act:'Go live',  track:'app'},
  {n:2, c:'2',  f:'01-live.html',  id:'s02', t:'SolAI builds it',        act:'Go live',  track:'app'},
  {n:3, c:'3',  f:'01-live.html',  id:'s03', t:'Phone + wallet',         act:'Go live',  track:'app'},
  {n:4, c:'4',  f:'01-live.html',  id:'s04', t:'Your store is live',     act:'Go live',  track:'app'},
  {n:5, c:'5',  f:'01-live.html',  id:'s05', t:'Share it',               act:'Go live',  track:'app'},

  {n:6, c:'6',  f:'02-money.html', id:'s06', t:'Home',                   act:'Money',    track:'app', nav:'home'},
  {n:7, c:'7',  f:'02-money.html', id:'s07', t:'Order · held in escrow', act:'Money',    track:'app', nav:'orders'},
  {n:8, c:'8',  f:'02-money.html', id:'s08', t:'Delivery code',          act:'Money',    track:'app', nav:'orders'},
  {n:9, c:'9',  f:'02-money.html', id:'s09', t:'Paid out',               act:'Money',    track:'app', nav:'money'},
  {n:10,c:'10', f:'02-money.html', id:'s10', t:'Plans, after the sale',  act:'Money',    track:'app', nav:'money'},

  {n:11,c:'11', f:'03-grow.html',  id:'s11', t:'WhatsApp catalogue',     act:'Grow',     track:'app', nav:'grow'},
  {n:12,c:'12', f:'03-grow.html',  id:'s12', t:'Boost it',               act:'Grow',     track:'app', nav:'grow'},

  {n:13,c:'13', f:'04-buyer.html', id:'s13', t:'Buyer · storefront',     act:'Buyer',    track:'app'},
  {n:14,c:'14', f:'04-buyer.html', id:'s14', t:'Buyer · checkout',       act:'Buyer',    track:'app'},
  {n:15,c:'15', f:'04-buyer.html', id:'s15', t:'Buyer · protected',      act:'Buyer',    track:'app'},

  {n:16,c:'A1', f:'05-admin.html', id:'a01', t:'Operations overview',    act:'Admin',    track:'admin', nav:'ov'},
  {n:17,c:'A2', f:'05-admin.html', id:'a02', t:'Dispute queue',          act:'Admin',    track:'admin', nav:'dis'},
  {n:18,c:'A3', f:'05-admin.html', id:'a03', t:'Resolve a dispute',      act:'Admin',    track:'admin', nav:'dis'},
  {n:19,c:'A4', f:'05-admin.html', id:'a04', t:'Seller file',            act:'Admin',    track:'admin', nav:'ppl'},
  {n:20,c:'A5', f:'05-admin.html', id:'a05', t:'Listing moderation',     act:'Admin',    track:'admin', nav:'mod'},
  {n:21,c:'A6', f:'05-admin.html', id:'a06', t:'Ledger & audit',         act:'Admin',    track:'admin', nav:'led'}
];
const TOTAL = {app:15, admin:6};

/* seller app navigation (sidebar on desktop, tabs on phone) */
const APPNAV = [
  {k:'home',   label:'Home',      icon:'home',  step:6},
  {k:'orders', label:'Orders',    icon:'tag',   step:7, dot:true},
  {k:'money',  label:'Money',     icon:'wallet',step:9},
  {k:'grow',   label:'Grow',      icon:'mega',  step:11}
];
/* admin console navigation */
const ADMNAV = [
  {k:'ov',  label:'Overview',   icon:'grid',   step:16},
  {k:'dis', label:'Disputes',   icon:'alert',  step:17, dot:true},
  {k:'ppl', label:'People',     icon:'users',  step:19},
  {k:'mod', label:'Listings',   icon:'image',  step:20},
  {k:'led', label:'Ledger',     icon:'chart',  step:21}
];

/* ---------- icon sprite ---------------------------------- */
const ICONS = {
  bolt:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  camera:'<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a1 1 0 0 0 .8-.4l.9-1.2A1 1 0 0 1 9.2 4h5.6a1 1 0 0 1 .8.4l.9 1.2a1 1 0 0 0 .8.4h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/><circle cx="12" cy="12.5" r="3.4"/>',
  arrowR:'<path d="M5 12h13M13 6l6 6-6 6"/>',
  arrowL:'<path d="M19 12H6M11 18l-6-6 6-6"/>',
  check:'<path d="m4.5 12.5 5 5 10-11"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  spark:'<path d="M12 3l1.9 5.4L19 10l-5.1 1.6L12 17l-1.9-5.4L5 10l5.1-1.6z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  store:'<path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 9 5.6 4.6A1 1 0 0 1 6.5 4h11a1 1 0 0 1 .9.6L20 9"/><path d="M9 20v-6h6v6"/>',
  image:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 4.5-4.5a2 2 0 0 1 2.8 0L20 20"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>',
  tablet:'<rect x="4.5" y="2.5" width="15" height="19" rx="2.4"/><path d="M11 18.6h2"/>',
  laptop:'<rect x="3.5" y="4.5" width="17" height="11" rx="1.8"/><path d="M2 18.5h20"/>',
  wallet:'<path d="M3.5 7.5A2 2 0 0 1 5.5 5.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z"/><path d="M16 12h2.5"/>',
  shield:'<path d="M12 3 5 6v5.5c0 4.3 3 8.2 7 9.5 4-1.3 7-5.2 7-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
  lock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  key:'<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15.5 12v2.4"/>',
  truck:'<path d="M2.5 7.5h10v9h-10z"/><path d="M12.5 11h4l3 3v2.5h-7z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/>',
  wa:'<path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4a8.4 8.4 0 1 1 15.5-4.4z"/><path d="M8.9 8.6c.6-.2 1 0 1.2.5l.5 1.1c.1.3 0 .5-.2.7l-.4.4c.5 1 1.3 1.7 2.3 2.2l.4-.4c.2-.2.5-.3.7-.2l1.1.5c.5.2.6.7.5 1.1-.3.9-1.4 1.2-2.3.9a8 8 0 0 1-4.6-4.5c-.3-.9 0-2 .8-2.3z"/>',
  mega:'<path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7.5 7.5 0 0 1 0 10"/>',
  card:'<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/>',
  coins:'<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/><path d="M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M17 14.4a6 6 0 0 1 4 4.6"/>',
  chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 17v-5M13 17V8M18 17v-8"/>',
  home:'<path d="m4 10.5 8-6.5 8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 20v-6h4v6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  refresh:'<path d="M20 11a8 8 0 0 0-13.7-5.3L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 13.7 5.3L20 16"/><path d="M20 20v-4h-4"/>',
  cal:'<rect x="3.5" y="5.5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a14 14 0 0 1 0 17a14 14 0 0 1 0-17z"/>',
  bell:'<path d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 3h15z"/><path d="M10 21h4"/>',
  tag:'<path d="M11 3H5a2 2 0 0 0-2 2v6l9.5 9.5a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8z"/><circle cx="7.8" cy="7.8" r="1.4"/>',
  meta:'<path d="M2.5 14.5c0-4.4 2.2-8 5-8 1.9 0 3.2 1.5 4.5 4 1.3-2.5 2.6-4 4.5-4 2.8 0 5 3.6 5 8 0 2.4-1.2 4-3 4-2.6 0-4-4-6.5-8-2.5 4-3.9 8-6.5 8-1.8 0-3-1.6-3-4z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  alert:'<path d="M12 4 2.8 20h18.4z"/><path d="M12 10v4M12 17h.01"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  edit:'<path d="m4 20 .8-3.6L15.6 5.6a2 2 0 0 1 2.8 0l.9.9a2 2 0 0 1 0 2.8L8.6 19.2z"/>',
  link:'<path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 1 0-5.7-5.7l-1.3 1.3"/><path d="M14 10.5a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 1 0 5.7 5.7l1.3-1.3"/>',
  qr:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><path d="M13.5 13.5h3v3h-3zM20.5 13.5v3M17 20.5h3.5M13.5 20.5h.01"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
  chevR:'<path d="m9 6 6 6-6 6"/>',
  chevD:'<path d="m6 9 6 6 6-6"/>',
  down:'<path d="M12 4v13M6 12l6 6 6-6"/>',
  signal:'<path d="M4 20v-4M9 20v-8M14 20V8M19 20V4"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  filter:'<path d="M3.5 5.5h17l-6.5 7.5V19l-4 2v-8z"/>',
  ban:'<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>',
  flag:'<path d="M5.5 21V4"/><path d="M5.5 5h11l-2 3.5 2 3.5h-11"/>',
  file:'<path d="M6.5 3.5h7l4.5 4.5v12a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z"/><path d="M13.5 3.5V8H18"/>',
  scale:'<path d="M12 4v16M6 8h12"/><path d="m6 8-3 6h6zM18 8l-3 6h6z"/>',
  undo:'<path d="M4 10h9a5 5 0 1 1 0 10H9"/><path d="M4 10 8 6M4 10l4 4"/>'
};
function icon(name, cls){
  return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||''}</svg>`;
}
function paintIcons(root){
  (root||document).querySelectorAll('[data-ic]').forEach(el=>{
    el.outerHTML = icon(el.getAttribute('data-ic'), el.className);
  });
}

/* ---------- device switcher ------------------------------- */
const DEVICES = [
  {k:'auto',    icon:'refresh', label:'Fit the window'},
  {k:'phone',   icon:'phone',   label:'Phone · 412px'},
  {k:'tablet',  icon:'tablet',  label:'Tablet · 840px'},
  {k:'desktop', icon:'laptop',  label:'Desktop · 1340px'}
];
const device = ()=>{ try{return localStorage.getItem('sol-dev')||'auto'}catch(e){return 'auto'} };
function setDevice(k){
  try{localStorage.setItem('sol-dev',k)}catch(e){}
  DEVICES.forEach(d=>document.body.classList.toggle('dev-'+d.k, d.k===k));
  document.querySelectorAll('.devsw button').forEach(b=>
    b.setAttribute('aria-selected', b.dataset.dev===k));
  const url = document.querySelector('.chrome-web .url');
  if(url && window.__step) url.textContent =
    (window.__step.track==='admin' ? 'admin.solai.africa/' : 'app.solai.africa/') + window.__step.id;
}

/* ---------- language -------------------------------------- */
const LANGS = ['EN','RW','SW','FR'];
const DICT = {
  sell_q:     ['What are you selling?','Ugurisha iki?','Unauza nini?','Que vendez-vous ?'],
  start:      ['Start','Tangira','Anza','Commencer'],
  your_store: ['Your store','Iduka ryawe','Duka lako','Votre boutique'],
  get_paid:   ['Get paid','Kwishyurwa','Kulipwa','Être payé'],
  phone_no:   ['Phone number','Nimero ya telefoni','Namba ya simu','Numéro de téléphone'],
  store_live: ['Your store is live','Iduka ryawe rirakora','Duka lako liko hewani','Votre boutique est en ligne'],
  share:      ['Share','Sangiza','Shiriki','Partager'],
  held:       ['Held safely','Amafaranga arabitswe','Pesa imehifadhiwa','Fonds sécurisés'],
  released:   ['Sent to your wallet','Yoherejwe muri wallet','Imetumwa kwenye wallet','Envoyé sur votre portefeuille'],
  confirm_del:['Confirm delivery','Emeza ko byagejejwe','Thibitisha uwasilishaji','Confirmer la livraison'],
  pay:        ['Pay','Ishyura','Lipa','Payer'],
  total:      ['Total','Igiteranyo','Jumla','Total'],
  balance:    ['Balance','Amafaranga asigaye','Salio','Solde'],
  free:       ['Free until you sell','Ni ubuntu kugeza ugurishije','Bure hadi uuze','Gratuit jusqu’à la vente']
};
const lang = ()=>{ try{return +(localStorage.getItem('sol-lang')||0)}catch(e){return 0} };
function setLang(i){
  try{localStorage.setItem('sol-lang',i)}catch(e){}
  document.querySelectorAll('[data-t]').forEach(el=>{
    const row = DICT[el.dataset.t]; if(row) el.textContent = row[i]||row[0];
  });
  document.querySelectorAll('.lang button').forEach((b,k)=>b.setAttribute('aria-selected', k===i));
}

/* ---------- progress memory ------------------------------- */
const seen = ()=>{ try{return JSON.parse(sessionStorage.getItem('sol-seen')||'[]')}catch(e){return[]} };
const mark = n =>{ try{const s=seen(); if(!s.includes(n)){s.push(n);sessionStorage.setItem('sol-seen',JSON.stringify(s))}}catch(e){} };

/* ---------- routing --------------------------------------- */
function currentFile(){
  const parts = location.pathname.split('/').filter(Boolean);
  const p = parts[parts.length-1];
  if(!p) return 'index.html';
  return p.endsWith('.html') ? p : p + '.html';
}
function stepFromHash(){
  const h = location.hash.replace('#','');
  const here = STEPS.filter(s=>s.f===currentFile());
  return here.find(s=>s.id===h) || here[0];
}
function go(step){
  if(!step) return;
  if(step.f === currentFile()){ show(step); history.replaceState(null,'','#'+step.id); }
  else { location.href = step.f + '#' + step.id; }
}
function show(step){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = document.getElementById(step.id);
  if(!el) return;
  el.classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  mark(step.n);
  window.__step = step;
  paintTag(step);
  paintRail(step);
  paintNav(step);
  setDevice(device());
  el.dispatchEvent(new CustomEvent('screen:enter',{bubbles:true}));
}
const step0 = ()=> window.__step || STEPS[0];

/* ---------- top bar --------------------------------------- */
function paintTag(step){
  let bar = document.querySelector('.tagbar');
  if(!bar){ bar = document.createElement('div'); bar.className='tagbar'; document.body.prepend(bar); }
  const adm = step.track==='admin';
  bar.innerHTML =
    `<span class="n ${adm?'adm':''}">${adm?'ADMIN':'SCREEN'} ${step.c} / ${TOTAL[step.track]}</span>
     <span class="ttl">${step.t}</span><span class="act">· ${step.act}</span>
     <span class="right">
       <span class="devsw" role="tablist" aria-label="Preview device">
         ${DEVICES.map(d=>`<button role="tab" data-dev="${d.k}" title="${d.label}" aria-label="${d.label}">${icon(d.icon)}</button>`).join('')}
       </span>
       <a class="home" href="index.html">Map</a>
     </span>`;
  bar.querySelectorAll('.devsw button').forEach(b=>b.onclick=()=>setDevice(b.dataset.dev));
}

/* ---------- bottom rail ----------------------------------- */
function paintRail(step){
  let rail = document.querySelector('.rail');
  if(!rail){
    rail = document.createElement('nav');
    rail.className='rail'; rail.setAttribute('aria-label','Prototype screens');
    rail.innerHTML = `
      <button class="rail-btn" data-nav="prev" aria-label="Previous screen">${icon('arrowL')}</button>
      <div class="rail-track"></div>
      <div class="rail-meta"></div>
      <div class="lang" role="tablist" aria-label="Language">
        ${LANGS.map(l=>`<button role="tab" aria-selected="false">${l}</button>`).join('')}
      </div>
      <button class="rail-btn" data-nav="next" aria-label="Next screen">${icon('arrowR')}</button>`;
    document.body.appendChild(rail);
    rail.querySelector('[data-nav="prev"]').onclick = ()=>go(STEPS[step0().n-2]);
    rail.querySelector('[data-nav="next"]').onclick = ()=>go(STEPS[step0().n]);
    rail.querySelectorAll('.lang button').forEach((b,i)=>b.onclick=()=>setLang(i));
  }
  const track = rail.querySelector('.rail-track');
  const done = seen();
  const acts = [...new Set(STEPS.map(s=>s.act))];
  track.innerHTML = acts.map(a=>`<div class="rail-act">${
    STEPS.filter(s=>s.act===a).map(s=>
      `<button class="rail-dot ${s.track==='admin'?'adm':''} ${s.n===step.n?'on':''} ${done.includes(s.n)?'seen':''}"
        data-step="${s.n}" title="${s.c}. ${s.t}">${s.c}</button>`).join('')
  }</div>`).join('');
  track.querySelectorAll('.rail-dot').forEach(b=>{ b.onclick=()=>go(STEPS[+b.dataset.step-1]); });
  rail.querySelector('.rail-meta').innerHTML =
    `<div class="t">${step.t}</div><div class="s">${step.act} · ${step.c} of ${TOTAL[step.track]}</div>`;
  rail.querySelector('[data-nav="prev"]').disabled = step.n===1;
  rail.querySelector('[data-nav="next"]').disabled = step.n===STEPS.length;
  const on = track.querySelector('.rail-dot.on');
  if(on) on.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
}

/* ---------- product navigation (sidebar / tab bar) --------- */
function paintNav(step){
  const frame = document.querySelector('.frame');
  const side  = document.querySelector('.sidebar');
  const tabs  = document.querySelector('.tabbar');
  if(!frame || !side || !tabs) return;

  if(!step.nav){
    frame.classList.remove('has-nav');
    tabs.classList.remove('on');
    side.innerHTML=''; tabs.innerHTML='';
    return;
  }
  const admin = step.track==='admin';
  const items = admin ? ADMNAV : APPNAV;
  frame.classList.add('has-nav');
  tabs.classList.add('on');

  side.innerHTML =
    `<div class="brand">
       <span class="mark" style="width:26px;height:26px;border-radius:9px;background:var(--sun);display:grid;place-items:center;color:#2A0A02">${icon('bolt')}</span>
       <span style="font-family:var(--font-d);font-weight:800;text-transform:uppercase">Sol<span style="color:var(--sun-deep)">AI</span></span>
       ${admin?'<span class="role" style="margin-left:auto">Admin</span>':''}
     </div>` +
    items.map(i=>`<button class="navitem ${i.k===step.nav?'on':''}" data-jump="${i.step}">
        ${icon(i.icon)}<span>${i.label}</span>${i.dot?'<span class="dotn"></span>':''}</button>`).join('') +
    `<div class="foot">
       <p class="tiny">${admin?'Signed in as N. Habimana · Support agent':'Amara Beads · Kigali'}</p>
     </div>`;

  tabs.innerHTML = items.map(i=>`<button class="${i.k===step.nav?'on':''}" data-jump="${i.step}">
      ${icon(i.icon)}<span>${i.label}</span></button>`).join('');

  document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>go(STEPS[+b.dataset.jump-1]));
}

/* ---------- generic interactions --------------------------- */
function wireCommon(root){
  const r = root || document;

  r.querySelectorAll('[data-go]').forEach(el=>{
    el.addEventListener('click', e=>{ e.preventDefault(); go(STEPS[+el.dataset.go-1]); });
  });

  r.querySelectorAll('[data-choice]').forEach(group=>{
    group.querySelectorAll('[data-val]').forEach(opt=>{
      opt.addEventListener('click',()=>{
        group.querySelectorAll('[data-val]').forEach(o=>o.setAttribute('aria-checked','false'));
        opt.setAttribute('aria-checked','true');
        if(group.dataset.reveal){
          document.querySelectorAll('[data-when]').forEach(p=>{
            if(p.closest('.screen')===group.closest('.screen')) p.hidden = p.dataset.when!==opt.dataset.val;
          });
        }
      });
    });
  });

  r.querySelectorAll('[data-multi]').forEach(group=>{
    group.querySelectorAll('[data-val]').forEach(opt=>{
      opt.addEventListener('click',()=>{
        opt.setAttribute('aria-checked', opt.getAttribute('aria-checked')==='true'?'false':'true');
      });
    });
  });

  r.querySelectorAll('.switch').forEach(sw=>{
    sw.addEventListener('click',()=>sw.setAttribute('aria-checked', sw.getAttribute('aria-checked')==='true'?'false':'true'));
  });

  r.querySelectorAll('.seg').forEach(seg=>{
    seg.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click',()=>{
        seg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected','false'));
        b.setAttribute('aria-selected','true');
        const t=b.dataset.tab;
        if(t) document.querySelectorAll('[data-panel]').forEach(p=>{
          if(p.closest('.screen')===b.closest('.screen')) p.hidden = p.dataset.panel!==t;
        });
      });
    });
  });

  r.querySelectorAll('.ai-field .input').forEach(inp=>{
    const clear=()=>inp.closest('.ai-field').classList.add('touched');
    inp.addEventListener('input',clear); inp.addEventListener('focus',clear);
  });

  r.querySelectorAll('[data-type]').forEach(el=>{
    const words=el.dataset.type.split('|'); let w=0,i=0,del=false;
    const tick=()=>{
      const word=words[w]; i = del?i-1:i+1;
      el.textContent = word.slice(0,i);
      let wait = del?40:70;
      if(!del && i===word.length){wait=1600;del=true}
      else if(del && i===0){del=false;w=(w+1)%words.length;wait=260}
      setTimeout(tick,wait);
    };
    tick();
  });

  r.querySelectorAll('[data-sheet-open]').forEach(b=>{
    b.addEventListener('click',()=>{
      const s=document.querySelector(b.dataset.sheetOpen); if(s) s.classList.add('open');
    });
  });
  r.querySelectorAll('[data-sheet-close]').forEach(b=>{
    b.addEventListener('click',()=>b.closest('.sheet-bg').classList.remove('open'));
  });

  r.querySelectorAll('.otp').forEach(box=>{
    const cells=[...box.querySelectorAll('input')];
    cells.forEach((c,i)=>{
      c.addEventListener('input',()=>{
        c.value=c.value.replace(/\D/g,'').slice(0,1);
        c.classList.toggle('filled',!!c.value);
        if(c.value && cells[i+1]) cells[i+1].focus();
        const btn=document.querySelector(box.dataset.arm||'');
        if(btn) btn.disabled = !cells.every(x=>x.value);
      });
      c.addEventListener('keydown',e=>{ if(e.key==='Backspace' && !c.value && cells[i-1]) cells[i-1].focus(); });
    });
  });

  /* admin: resolution picker arms the action button and swaps its label */
  r.querySelectorAll('[data-resolve]').forEach(group=>{
    const btn=document.querySelector(group.dataset.resolve);
    group.querySelectorAll('[data-val]').forEach(opt=>{
      opt.addEventListener('click',()=>{
        if(!btn) return;
        btn.disabled=false;
        btn.className='btn btn-block btn-lg ' + (opt.dataset.tone||'btn-sun');
        btn.innerHTML = opt.dataset.action || 'Apply';
      });
    });
  });
}

function runCounters(scope){
  scope.querySelectorAll('[data-count-to]').forEach(el=>{
    if(el.dataset.done==='1') return;
    el.dataset.done='1';
    const to=+el.dataset.countTo, dur=800, t0=performance.now();
    const tick=t=>{
      const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
      el.textContent = Math.round(to*e).toLocaleString('en-US');
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- staged AI theatre ------------------------------ */
function runGeneration(box){
  if(box.dataset.ran==='1') return;
  box.dataset.ran='1';
  const stages=[...box.querySelectorAll('.gen-stage')];
  const bar=box.querySelector('.progress span');
  const after=box.querySelector('[data-gen-after]');
  const during=box.querySelector('[data-gen-during]');
  let idx=0;
  const step=()=>{
    if(idx>0) stages[idx-1].classList.add('done');
    if(idx>=stages.length){
      if(bar) bar.style.width='100%';
      if(during) during.hidden=true;
      if(after) after.hidden=false;
      return;
    }
    const s=stages[idx];
    s.classList.add('on');
    if(bar) bar.style.width=Math.round((idx/stages.length)*100)+'%';
    idx++;
    setTimeout(step, +s.dataset.ms || 1000);
  };
  step();
}
document.addEventListener('screen:enter', e=>{
  e.target.querySelectorAll('[data-gen]').forEach(runGeneration);
  runCounters(e.target);
});
function wireReplay(){
  document.querySelectorAll('[data-replay]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const box=document.querySelector(btn.dataset.replay); if(!box) return;
      box.dataset.ran='0';
      box.querySelectorAll('.gen-stage').forEach(s=>s.classList.remove('on','done'));
      const after=box.querySelector('[data-gen-after]');  if(after) after.hidden=true;
      const during=box.querySelector('[data-gen-during]');if(during) during.hidden=false;
      const bar=box.querySelector('.progress span');      if(bar) bar.style.width='0';
      runGeneration(box);
    });
  });
}

/* ---------- keyboard --------------------------------------- */
document.addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea')) return;
  if(e.key==='ArrowRight') go(STEPS[step0().n]);
  if(e.key==='ArrowLeft')  go(STEPS[step0().n-2]);
});

/* ---------- boot ------------------------------------------- */
document.addEventListener('DOMContentLoaded',()=>{
  paintIcons();
  wireCommon();
  wireReplay();
  if(document.querySelector('.screen')){
    const s=stepFromHash(); if(s) show(s);
  } else {
    DEVICES.forEach(d=>document.body.classList.remove('dev-'+d.k));
  }
  setLang(lang());
  window.addEventListener('hashchange',()=>{
    const s=stepFromHash(); if(s && s.n!==step0().n) show(s);
  });
});
