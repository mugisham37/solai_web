/* SolAI Flow 2 — Authentication Screens */

/* ── Shared Auth Layout (60/40 split) ── */
function AuthLayout({ children, panel }) {
  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <a href="#" className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12" stroke="var(--brand)" strokeWidth="2"/><circle cx="14" cy="14" r="5" fill="var(--brand)"/></svg>
          <span>SolAI</span>
        </a>
        <div className="auth-form-content">
          {children}
        </div>
        <div className="auth-form-footer">
          <span>© 2026 Digisi Rwanda</span>
          <div className="auth-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="auth-panel-side">
        {panel}
      </div>
    </div>
  );
}

/* ── Auth Icon ── */
function AuthIcon({ name, size = 20 }) {
  const paths = {
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></>,
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    key: <><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    fingerprint: <><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><circle cx="12" cy="12" r="2"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    refreshCw: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.mail}
    </svg>
  );
}

/* ── Divider ── */
function AuthDivider({ text }) {
  return (
    <div className="auth-divider">
      <span>{text || 'or'}</span>
    </div>
  );
}

/* ════════════════════════════════════════════
   SCREEN 1: SIGN UP
   ════════════════════════════════════════════ */
function SignUpScreen({ onNavigate }) {
  const [showPw, setShowPw] = React.useState(false);
  const [consent, setConsent] = React.useState({ required: true, marketing: false });
  const [method, setMethod] = React.useState('email'); // email | passkey | magic

  const panel = (
    <div className="auth-panel-content">
      <div className="auth-panel-label">What happens next</div>
      <div className="auth-panel-steps">
        {[
          { num: '01', title: 'Verify your email', desc: 'A 6-digit code lands in your inbox.' },
          { num: '02', title: 'Connect your store', desc: 'OAuth into Shopify, WooCommerce, or paste a product URL.' },
          { num: '03', title: 'Set your spend cap', desc: 'Choose a daily limit. SolAI can never exceed it.' },
          { num: '04', title: 'Launch', desc: 'Upload a product and SolAI builds your first campaign.' },
        ].map(s => (
          <div key={s.num} className="auth-panel-step">
            <span className="auth-panel-step-num">{s.num}</span>
            <div>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="auth-panel-trust">
        <div className="auth-trust-badge"><AuthIcon name="shield" size={16}/> Hard spend caps</div>
        <div className="auth-trust-badge"><AuthIcon name="eye" size={16}/> 100% explainable</div>
        <div className="auth-trust-badge"><AuthIcon name="globe" size={16}/> GDPR · Rwanda DPL</div>
      </div>
    </div>
  );

  return (
    <AuthLayout panel={panel}>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Start free. No credit card required.</p>

      <div className="auth-method-tabs">
        {[{id:'email',label:'Email'},{id:'passkey',label:'Passkey'},{id:'magic',label:'Magic link'}].map(m => (
          <button key={m.id} className={method===m.id?'active':''} onClick={()=>setMethod(m.id)}>{m.label}</button>
        ))}
      </div>

      {method === 'email' && (
        <form className="auth-form" onSubmit={e => e.preventDefault()}>
          <div className="auth-field">
            <label>Full name</label>
            <div className="auth-input-wrap">
              <AuthIcon name="user" size={16}/>
              <input type="text" placeholder="Kalisa Mugisha" autoComplete="name"/>
            </div>
          </div>
          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <AuthIcon name="mail" size={16}/>
              <input type="email" placeholder="kalisa@inema.rw" autoComplete="email"/>
            </div>
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <AuthIcon name="lock" size={16}/>
              <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" autoComplete="new-password"/>
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle password visibility">
                <AuthIcon name={showPw ? 'eyeOff' : 'eye'} size={16}/>
              </button>
            </div>
            <div className="auth-pw-strength">
              <div className="auth-pw-bar"><div className="auth-pw-fill" style={{width:'60%',background:'var(--warning)'}}></div></div>
              <span className="auth-pw-label">Moderate</span>
            </div>
          </div>

          <div className="auth-consents">
            <label className="auth-consent-row">
              <span className={`auth-check ${consent.required ? 'auth-check-on' : ''}`}>
                {consent.required && <AuthIcon name="check" size={12}/>}
              </span>
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. <em className="auth-required">Required</em></span>
            </label>
            <label className="auth-consent-row" onClick={() => setConsent({...consent, marketing: !consent.marketing})}>
              <span className={`auth-check ${consent.marketing ? 'auth-check-on' : ''}`}>
                {consent.marketing && <AuthIcon name="check" size={12}/>}
              </span>
              <span>Send me product updates and tips. <em className="auth-optional">Optional</em></span>
            </label>
          </div>

          <div className="auth-consent-region">
            <AuthIcon name="shield" size={14}/>
            <span>Your data is processed under <strong>Rwanda Law N° 058/2021</strong> and <strong>GDPR</strong>. Stored in AWS af-south-1 (Cape Town).</span>
          </div>

          <button type="submit" className="auth-btn-primary" onClick={() => onNavigate('verify')}>
            Create account <AuthIcon name="arrowRight" size={16}/>
          </button>
        </form>
      )}

      {method === 'passkey' && (
        <div className="auth-alt-method">
          <div className="auth-alt-icon"><AuthIcon name="fingerprint" size={40}/></div>
          <h3>Use a passkey</h3>
          <p>Sign up with Face ID, Touch ID, or your security key. No password needed.</p>
          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <AuthIcon name="mail" size={16}/>
              <input type="email" placeholder="kalisa@inema.rw" autoComplete="email"/>
            </div>
          </div>
          <button className="auth-btn-primary" style={{width:'100%'}}>
            <AuthIcon name="fingerprint" size={16}/> Create passkey
          </button>
        </div>
      )}

      {method === 'magic' && (
        <div className="auth-alt-method">
          <div className="auth-alt-icon"><AuthIcon name="zap" size={40}/></div>
          <h3>Magic link</h3>
          <p>We'll email you a one-time link. No password to remember.</p>
          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <AuthIcon name="mail" size={16}/>
              <input type="email" placeholder="kalisa@inema.rw" autoComplete="email"/>
            </div>
          </div>
          <button className="auth-btn-primary" style={{width:'100%'}}>
            <AuthIcon name="mail" size={16}/> Send magic link
          </button>
        </div>
      )}

      <p className="auth-switch">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signin'); }}>Sign in</a></p>
    </AuthLayout>
  );
}


/* ════════════════════════════════════════════
   SCREEN 2: SIGN IN
   ════════════════════════════════════════════ */
function SignInScreen({ onNavigate }) {
  const [showPw, setShowPw] = React.useState(false);

  const panel = (
    <div className="auth-panel-content">
      <div className="auth-panel-quote">
        <p>"I uploaded my ceramics, set a RWF 50,000 daily cap, and walked away. Two weeks later — 340 orders."</p>
        <div className="auth-panel-quote-author">
          <div className="auth-panel-avatar" style={{background:'rgba(52,211,153,.15)',color:'var(--success)'}}>MU</div>
          <div>
            <strong>Marie Uwimana</strong>
            <span>Inema Boutique · Kigali</span>
          </div>
        </div>
      </div>
      <div className="auth-panel-stats">
        <div className="auth-panel-stat"><span className="auth-panel-stat-val">15 min</span><span>Optimisation cycle</span></div>
        <div className="auth-panel-stat"><span className="auth-panel-stat-val">5</span><span>Autonomous agents</span></div>
        <div className="auth-panel-stat"><span className="auth-panel-stat-val">100%</span><span>Decisions explained</span></div>
      </div>
    </div>
  );

  return (
    <AuthLayout panel={panel}>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your SolAI dashboard.</p>

      <form className="auth-form" onSubmit={e => e.preventDefault()}>
        <div className="auth-field">
          <label>Email address</label>
          <div className="auth-input-wrap">
            <AuthIcon name="mail" size={16}/>
            <input type="email" placeholder="kalisa@inema.rw" autoComplete="email"/>
          </div>
        </div>
        <div className="auth-field">
          <label>
            Password
            <a href="#" className="auth-forgot" onClick={(e) => { e.preventDefault(); onNavigate('reset'); }}>Forgot?</a>
          </label>
          <div className="auth-input-wrap">
            <AuthIcon name="lock" size={16}/>
            <input type={showPw ? 'text' : 'password'} placeholder="Enter password" autoComplete="current-password"/>
            <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)} aria-label="Toggle">
              <AuthIcon name={showPw ? 'eyeOff' : 'eye'} size={16}/>
            </button>
          </div>
        </div>
        <button type="submit" className="auth-btn-primary">
          Sign in <AuthIcon name="arrowRight" size={16}/>
        </button>
      </form>

      <AuthDivider text="or continue with"/>

      <div className="auth-social-row">
        <button className="auth-social-btn"><AuthIcon name="fingerprint" size={18}/> Passkey</button>
        <button className="auth-social-btn"><AuthIcon name="zap" size={18}/> Magic link</button>
      </div>

      <p className="auth-switch">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }}>Sign up free</a></p>
    </AuthLayout>
  );
}


/* ════════════════════════════════════════════
   SCREEN 3: VERIFY EMAIL
   ════════════════════════════════════════════ */
function VerifyEmailScreen({ onNavigate }) {
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const refs = React.useRef([]);

  const handleInput = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const panel = (
    <div className="auth-panel-content" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
      <div className="auth-verify-visual">
        <div className="auth-verify-envelope">
          <AuthIcon name="mail" size={48}/>
        </div>
        <p style={{fontSize:14,color:'var(--text-muted)',marginTop:16}}>We sent a 6-digit code to</p>
        <p style={{fontSize:16,fontWeight:600,color:'var(--text)',marginTop:4}}>kalisa@inema.rw</p>
      </div>
    </div>
  );

  return (
    <AuthLayout panel={panel}>
      <h1 className="auth-title">Verify your email</h1>
      <p className="auth-subtitle">Enter the 6-digit code we sent to <strong>kalisa@inema.rw</strong></p>

      <div className="auth-code-grid">
        {code.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} type="text" inputMode="numeric" maxLength={1}
            className="auth-code-input" value={d}
            onChange={e => handleInput(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            aria-label={`Digit ${i + 1}`}/>
        ))}
      </div>

      <button className="auth-btn-primary" style={{width:'100%',marginTop:20}} onClick={() => onNavigate('2fa')}>
        Verify <AuthIcon name="check" size={16}/>
      </button>

      <div className="auth-resend">
        <p>Didn't receive a code? <button className="auth-link-btn">Resend code</button></p>
        <p className="auth-resend-timer">You can resend in <strong>58s</strong></p>
      </div>

      <button className="auth-back-link" onClick={() => onNavigate('signup')}>
        <AuthIcon name="arrowLeft" size={14}/> Back to sign up
      </button>
    </AuthLayout>
  );
}


/* ════════════════════════════════════════════
   SCREEN 4: RESET PASSWORD
   ════════════════════════════════════════════ */
function ResetPasswordScreen({ onNavigate }) {
  const [step, setStep] = React.useState('request'); // request | sent | newpw
  const [showPw, setShowPw] = React.useState(false);

  const panel = (
    <div className="auth-panel-content" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
      <AuthIcon name="key" size={48}/>
      <p style={{fontSize:15,color:'var(--text-muted)',marginTop:16,maxWidth:280}}>We'll send you a secure link to reset your password. No security questions, no hassle.</p>
    </div>
  );

  return (
    <AuthLayout panel={panel}>
      {step === 'request' && (
        <>
          <h1 className="auth-title">Reset password</h1>
          <p className="auth-subtitle">Enter the email on your account and we'll send a reset link.</p>
          <form className="auth-form" onSubmit={e => { e.preventDefault(); setStep('sent'); }}>
            <div className="auth-field">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <AuthIcon name="mail" size={16}/>
                <input type="email" placeholder="kalisa@inema.rw" autoComplete="email"/>
              </div>
            </div>
            <button type="submit" className="auth-btn-primary" style={{width:'100%'}}>Send reset link</button>
          </form>
        </>
      )}

      {step === 'sent' && (
        <div className="auth-success-state">
          <div className="auth-success-icon"><AuthIcon name="mail" size={32}/></div>
          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-subtitle">We sent a reset link to <strong>kalisa@inema.rw</strong>. It expires in 1 hour.</p>
          <button className="auth-btn-secondary" onClick={() => setStep('newpw')} style={{width:'100%',marginTop:16}}>
            I have the link → Set new password
          </button>
          <div className="auth-resend" style={{marginTop:16}}>
            <p>Didn't get it? <button className="auth-link-btn">Resend link</button></p>
          </div>
        </div>
      )}

      {step === 'newpw' && (
        <>
          <h1 className="auth-title">Set new password</h1>
          <p className="auth-subtitle">Choose a strong password for your account.</p>
          <form className="auth-form" onSubmit={e => { e.preventDefault(); onNavigate('signin'); }}>
            <div className="auth-field">
              <label>New password</label>
              <div className="auth-input-wrap">
                <AuthIcon name="lock" size={16}/>
                <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" autoComplete="new-password"/>
                <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                  <AuthIcon name={showPw ? 'eyeOff' : 'eye'} size={16}/>
                </button>
              </div>
            </div>
            <div className="auth-field">
              <label>Confirm password</label>
              <div className="auth-input-wrap">
                <AuthIcon name="lock" size={16}/>
                <input type="password" placeholder="Repeat password" autoComplete="new-password"/>
              </div>
            </div>
            <button type="submit" className="auth-btn-primary" style={{width:'100%'}}>
              Set password & sign in <AuthIcon name="arrowRight" size={16}/>
            </button>
          </form>
        </>
      )}

      <button className="auth-back-link" onClick={() => onNavigate('signin')}>
        <AuthIcon name="arrowLeft" size={14}/> Back to sign in
      </button>
    </AuthLayout>
  );
}


/* ════════════════════════════════════════════
   SCREEN 5: 2FA SETUP
   ════════════════════════════════════════════ */
function TwoFactorScreen({ onNavigate }) {
  const [method, setMethod] = React.useState('app'); // app | sms
  const [step, setStep] = React.useState('choose'); // choose | codes | done
  const [saved, setSaved] = React.useState(false);

  const recoveryCodes = ['HXKW-9F3P','QRJN-7D2T','LMVB-4A8S','WNGT-6C1R','PZFX-5E7Y','DJMK-2H9U','BTRL-8G4V','YSCN-3K6W'];

  const panel = (
    <div className="auth-panel-content" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
      <AuthIcon name="shield" size={48}/>
      <h3 style={{marginTop:16,fontSize:18,fontWeight:600}}>Secure your account</h3>
      <p style={{fontSize:14,color:'var(--text-muted)',marginTop:8,maxWidth:280}}>Two-factor authentication adds a second layer of protection. SolAI handles real money — security isn't optional.</p>
      <div className="auth-panel-trust" style={{marginTop:24}}>
        <div className="auth-trust-badge"><AuthIcon name="lock" size={14}/> Encrypted at rest</div>
        <div className="auth-trust-badge"><AuthIcon name="shield" size={14}/> SOC 2 ready</div>
      </div>
    </div>
  );

  return (
    <AuthLayout panel={panel}>
      {step === 'choose' && (
        <>
          <h1 className="auth-title">Set up 2FA</h1>
          <p className="auth-subtitle">Choose how you'd like to receive your second factor.</p>

          <div className="auth-2fa-options">
            <button className={`auth-2fa-option ${method==='app'?'auth-2fa-selected':''}`} onClick={() => setMethod('app')}>
              <div className="auth-2fa-option-icon"><AuthIcon name="smartphone" size={24}/></div>
              <div>
                <strong>Authenticator app</strong>
                <p>Google Authenticator, Authy, 1Password, etc.</p>
              </div>
              <div className="auth-2fa-radio"><div className={method==='app'?'auth-2fa-radio-dot':''}></div></div>
            </button>
            <button className={`auth-2fa-option ${method==='sms'?'auth-2fa-selected':''}`} onClick={() => setMethod('sms')}>
              <div className="auth-2fa-option-icon"><AuthIcon name="mail" size={24}/></div>
              <div>
                <strong>SMS</strong>
                <p>We'll text a code to your phone number.</p>
              </div>
              <div className="auth-2fa-radio"><div className={method==='sms'?'auth-2fa-radio-dot':''}></div></div>
            </button>
          </div>

          {method === 'app' && (
            <div className="auth-2fa-qr">
              <div className="auth-qr-placeholder">
                <div className="auth-qr-grid">
                  {Array(64).fill(0).map((_, i) => (
                    <div key={i} style={{background: Math.random() > 0.5 ? 'var(--text)' : 'transparent'}}></div>
                  ))}
                </div>
              </div>
              <div className="auth-2fa-manual">
                <span className="auth-2fa-manual-label">Can't scan? Enter manually:</span>
                <code className="auth-2fa-secret">JBSWY3DPEHPK3PXP</code>
              </div>
              <div className="auth-field" style={{marginTop:12}}>
                <label>Enter 6-digit code from app</label>
                <input type="text" inputMode="numeric" maxLength={6} className="auth-input" placeholder="000 000" style={{textAlign:'center',letterSpacing:'0.3em',fontFamily:"'JetBrains Mono',monospace"}}/>
              </div>
            </div>
          )}

          {method === 'sms' && (
            <div className="auth-field" style={{marginTop:16}}>
              <label>Phone number</label>
              <div className="auth-input-wrap">
                <span style={{fontSize:13,color:'var(--text-subtle)',paddingRight:4}}>+250</span>
                <input type="tel" placeholder="788 000 000"/>
              </div>
            </div>
          )}

          <button className="auth-btn-primary" style={{width:'100%',marginTop:16}} onClick={() => setStep('codes')}>
            Enable 2FA <AuthIcon name="shield" size={16}/>
          </button>
        </>
      )}

      {step === 'codes' && (
        <>
          <h1 className="auth-title">Recovery codes</h1>
          <p className="auth-subtitle">Save these codes somewhere safe. Each can be used once if you lose access to your 2FA device.</p>

          <div className="auth-recovery-grid">
            {recoveryCodes.map((c, i) => (
              <div key={i} className="auth-recovery-code">
                <span className="auth-recovery-num">{i + 1}</span>
                <code>{c}</code>
              </div>
            ))}
          </div>

          <div className="auth-recovery-actions">
            <button className="auth-btn-secondary"><AuthIcon name="copy" size={14}/> Copy all</button>
            <button className="auth-btn-secondary"><AuthIcon name="download" size={14}/> Download .txt</button>
          </div>

          <label className="auth-consent-row auth-save-gate" onClick={() => setSaved(!saved)}>
            <span className={`auth-check ${saved ? 'auth-check-on' : ''}`}>
              {saved && <AuthIcon name="check" size={12}/>}
            </span>
            <span>I've saved these recovery codes in a safe place.</span>
          </label>

          <button className="auth-btn-primary" style={{width:'100%',marginTop:12,opacity:saved?1:0.4,pointerEvents:saved?'auto':'none'}}
            onClick={() => setStep('done')}>
            Continue <AuthIcon name="arrowRight" size={16}/>
          </button>
        </>
      )}

      {step === 'done' && (
        <div className="auth-success-state">
          <div className="auth-success-icon" style={{background:'rgba(52,211,153,.12)',color:'var(--success)'}}><AuthIcon name="shield" size={32}/></div>
          <h1 className="auth-title">Account secured</h1>
          <p className="auth-subtitle">Two-factor authentication is active. You'll be asked for a code on each new sign-in.</p>
          <button className="auth-btn-primary" style={{width:'100%',marginTop:20}} onClick={() => onNavigate('signin')}>
            Go to dashboard <AuthIcon name="arrowRight" size={16}/>
          </button>
        </div>
      )}
    </AuthLayout>
  );
}


window.AuthLayout = AuthLayout;
window.AuthIcon = AuthIcon;
window.AuthDivider = AuthDivider;
window.SignUpScreen = SignUpScreen;
window.SignInScreen = SignInScreen;
window.VerifyEmailScreen = VerifyEmailScreen;
window.ResetPasswordScreen = ResetPasswordScreen;
window.TwoFactorScreen = TwoFactorScreen;
