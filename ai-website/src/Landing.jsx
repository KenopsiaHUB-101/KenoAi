import React, { useEffect, useRef, useState } from 'react';
import Login from './Login.jsx';
import './Landing.css';

/* ---------- inline SVG icons (stroke style, no emoji) ---------- */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IcoHome = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>);
const IcoChat = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3 21l1.9-5.4a8.2 8.2 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.5-8.3 8.5 8.5 0 0 1 8.5 8.3z"/></svg>);
const IcoTask = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>);
const IcoInbox = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>);
const IcoCalendar = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IcoReport = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/></svg>);
const IcoSpark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.8 14.1 8.3a4.5 4.5 0 0 0 2.87 2.87l6.5 2.1-6.5 2.1a4.5 4.5 0 0 0-2.87 2.87L12 24.7 9.9 18.2a4.4 4.4 0 0 0-2.86-2.86L.5 13.25 7 11.15a4.5 4.5 0 0 0 2.9-2.9L12 1.8z" transform="scale(0.95) translate(0.7,0.7)"/>
  </svg>
);
const IcoMic = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);
const IcoPlus = () => (<svg width="14" height="14" viewBox="0 0 24 24" {...S}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IcoGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
  </svg>
);
const IcoShield = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...S}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const IcoCheck = ({ size = 16 }) => (<svg width={size} height={size} viewBox="0 0 24 24" {...S} strokeWidth="2.4"><polyline points="20 6 9 17 4 12"/></svg>);
const IcoArrow = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S} strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>);
const IcoBolt = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...S}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
const IcoBrain = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...S}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 17.5a2.5 2.5 0 0 1-1.98-4.03A2.5 2.5 0 0 1 3 9.5a2.5 2.5 0 0 1 2.04-2.46A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 17.5a2.5 2.5 0 0 0 1.98-4.03A2.5 2.5 0 0 0 21 9.5a2.5 2.5 0 0 0-2.04-2.46A2.5 2.5 0 0 0 14.5 2z"/></svg>);
const IcoTarget = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const IcoGithub = () => (<svg width="18" height="18" viewBox="0 0 24 24" {...S}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 5.44 5.44 0 0 0 3.5 8.55c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>);
const IcoGlobe = () => (<svg width="22" height="22" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const IcoVideo = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="m23 7-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>);
const IcoDoc = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>);
const IcoTrend = () => (<svg width="16" height="16" viewBox="0 0 24 24" {...S}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>);
const IcoStar = () => (<svg width="15" height="15" viewBox="0 0 24 24" {...S} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);

export default function Landing({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const io = useRef(null);

  /* Smooth anchors active only while the landing page is mounted */
  useEffect(() => {
    document.documentElement.classList.add('k-landing-on');
    return () => document.documentElement.classList.remove('k-landing-on');
  }, []);

  /* Navbar elevation on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Scroll-reveal via IntersectionObserver */
  useEffect(() => {
    io.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.current.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => io.current.observe(el));
    return () => { if (io.current) io.current.disconnect(); };
  }, [showLogin]);

  const go = () => setShowLogin(true);

  if (showLogin) return <Login onSuccess={onLoginSuccess} />;

  return (
    <div className="k-page">

      {/* ================= NAVBAR ================= */}
      <header className={`k-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="k-container k-nav-in">
          <a
            className="k-brand"
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <img src="/icon-192.png" alt="KenoAi logo" width="36" height="36" className="k-logo" />
            <span className="k-brand-name">KenoAi</span>
          </a>
          <nav className="k-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#business">For business</a>
            <a href="#cta">Get started</a>
          </nav>
          <div className="k-nav-cta">
            <button type="button" className="k-btn k-btn-ghost k-btn-sm" onClick={go}>Sign in</button>
            <button type="button" className="k-btn k-btn-primary k-btn-sm" onClick={go}>
              Get started <IcoArrow />
            </button>
            <a className="k-btn k-btn-ghost k-btn-sm" href="https://github.com/KenopsiaHUB-101/KenoAi" target="_blank" rel="noreferrer">
              <IcoGithub /> GitHub
            </a>
            <a className="k-btn k-btn-ghost k-btn-sm" href="https://www.buymeacoffee.com/kenopsia" target="_blank" rel="noreferrer">
              <IcoStar /> Donate
            </a>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="k-hero" id="hero">
        <div className="k-hero-bg">
          <div className="k-orb o1" />
          <div className="k-orb o2" />
          <div className="k-orb o3" />
        </div>

        <div className="k-container k-hero-grid">
          <div className="k-hero-copy">
            <span className="k-badge">
              <span className="k-badge-dot" /> KenoAi 2.0 — AI Assistant for Business &amp; Teams
            </span>
            <h1>
              The AI workspace your <span className="k-grad">whole team</span> can rely on
            </h1>
            <p className="k-hero-sub">
              <strong>KenoAi</strong> brings AI conversations, projects, and daily priorities together in one clean workspace —
              so you can serve clients faster, deliver on time, and never let a detail slip.
            </p>
            <div className="k-hero-ctas">
              <button type="button" className="k-btn k-btn-primary k-btn-lg" onClick={go}>
                <IcoGoogle /> Get started with Google
              </button>
              <a className="k-btn k-btn-ghost k-btn-lg" href="#how">
                <IcoVideo /> See how it works
              </a>
            </div>
            <ul className="k-trust">
              <li><IcoCheck size={15} /> Free to start</li>
              <li><IcoShield /> Private by design</li>
              <li><IcoBolt /> 99.9% uptime</li>
            </ul>
          </div>

          {/* -------- dashboard mockup (reference style, KenoAi branding) -------- */}
          <div className="k-hero-visual">
            <div className="k-hero-mock">
              <div className="mk">
                <div className="mk-chrome">
                  <span className="mk-dot r" />
                  <span className="mk-dot y" />
                  <span className="mk-dot g" />
                  <span className="mk-title">KenoAi — Workspace</span>
                  <span className="mk-live"><i />LIVE</span>
                </div>

                <div className="mk-body">
                  {/* mini sidebar */}
                  <aside className="mk-side">
                    <div className="mk-me">
                      <span className="mk-ava"><img src="/icon-192.png" alt="" /></span>
                      <span className="mk-me-t"><b>Kenopsia</b><small>Workspace owner</small></span>
                    </div>
                    <nav className="mk-menu">
                      <span className="mk-item on"><IcoHome /> Home</span>
                      <span className="mk-item"><IcoSpark /> KenoAi Assistant</span>
                      <span className="mk-item"><IcoTask /> My tasks<i className="mk-count">3</i></span>
                      <span className="mk-item"><IcoInbox /> Inbox<i className="mk-count">1</i></span>
                      <span className="mk-item"><IcoCalendar /> Calendar</span>
                      <span className="mk-item"><IcoReport /> Reports &amp; Analytics</span>
                    </nav>
                    <div className="mk-projects">
                      <span className="mk-h">My projects <em>+</em></span>
                      <span className="mk-proj"><i className="pp" /> Product Launch</span>
                      <span className="mk-proj"><i className="pt" /> Client Onboarding</span>
                      <span className="mk-proj"><i className="po" /> Team Brainstorm</span>
                    </div>
                    <div className="mk-cta">
                      <img src="/icon-192.png" alt="" />
                      <b>KenoAi Pro</b>
                      <small>Unlimited AI + priority support</small>
                    </div>
                  </aside>

                  {/* mini main */}
                  <div className="mk-main">
                    <div className="mk-hello">
                      <h3>Hello, Kenopsia</h3>
                      <p>How can I help you today?</p>
                      <div className="mk-ask">
                        <span className="mk-ask-btn"><IcoSpark size={14} /></span>
                        <span className="mk-ask-input">Ask KenoAi to plan, draft, or summarize anything…</span>
                        <span style={{ marginLeft: 'auto', color: 'var(--k-muted)' }}><IcoMic /></span>
                      </div>
                    </div>

                    <div className="mk-tasks">
                      <div className="mk-tcol">
                        <div className="mk-tcol-h">IN PROGRESS <em>3 tasks</em></div>
                        <div className="mk-task">
                          <span className="mk-check" />
                          <span className="mk-tname">Kickoff agenda for new client</span>
                          <i className="mk-pri mk-pri-high">HIGH</i>
                          <span className="mk-due">Due today</span>
                        </div>
                        <div className="mk-task">
                          <span className="mk-check" />
                          <span className="mk-tname">Status update for stakeholders</span>
                          <i className="mk-pri mk-pri-normal">NORMAL</i>
                          <span className="mk-due">3 days left</span>
                        </div>
                        <div className="mk-task">
                          <span className="mk-check" />
                          <span className="mk-tname">Review onboarding docs</span>
                          <i className="mk-pri mk-pri-low">LOW</i>
                          <span className="mk-due">5 days left</span>
                        </div>
                        <div className="mk-add"><IcoPlus /> Add task</div>
                      </div>

                      <div className="mk-tcol">
                        <div className="mk-tcol-h">TO DO <em>1 task</em></div>
                        <div className="mk-task">
                          <span className="mk-check" />
                          <span className="mk-tname">Send quarterly report to client</span>
                          <i className="mk-pri mk-pri-normal">NORMAL</i>
                          <span className="mk-due">4 days left</span>
                        </div>
                        <div className="mk-tcol-h" style={{ marginTop: 14 }}>UPCOMING <em>2 tasks</em></div>
                        <div className="mk-task">
                          <span className="mk-check" />
                          <span className="mk-tname">Prepare pricing proposal</span>
                          <i className="mk-pri mk-pri-high">HIGH</i>
                          <span className="mk-due">Next week</span>
                        </div>
                        <div className="mk-add"><IcoPlus /> Add task</div>
                      </div>
                    </div>
                  </div>

                  {/* mini right panel */}
                  <aside className="mk-right">
                    <div className="mk-panel">
                      <span className="mk-h">Projects</span>
                      <div className="mk-pcard">
                        <i className="pp" />
                        <span className="mk-pcard-t"><b>Product Launch</b><small>Launch in 2 weeks</small></span>
                        <span className="mk-prog"><b style={{ width: '73%' }} /></span>
                      </div>
                      <div className="mk-pcard">
                        <i className="pt" />
                        <span className="mk-pcard-t"><b>Client Onboarding</b><small>3 active accounts</small></span>
                        <span className="mk-prog"><b style={{ width: '45%' }} /></span>
                      </div>
                      <div className="mk-new"><IcoPlus /> Create new project</div>
                    </div>

                    <div className="mk-panel">
                      <span className="mk-h">Calendar</span>
                      <div className="mk-cal">
                        <span>04</span><span>05</span><span>06</span><span className="on">07</span><span>08</span><span>09</span><span>10</span>
                      </div>
                      <div className="mk-ev">
                        <span className="mk-ev-ico">G</span>
                        <span><b>Client review — Google Meet</b><small>10:00–11:00 · 5 invited</small></span>
                      </div>
                      <div className="mk-ev" style={{ marginTop: 8 }}>
                        <span className="mk-ev-ico" style={{ color: 'var(--k-purple)' }}>K</span>
                        <span><b>KenoAi weekly summary</b><small>Auto-generated every Friday</small></span>
                      </div>
                    </div>

                    <div className="mk-panel">
                      <span className="mk-h">Reminders</span>
                      <div className="mk-rem">
                        <span className="mk-avset"><i /><i /><i /></span>
                        <span><b>Team standup tomorrow</b><small>9:00 AM · 4 members</small></span>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>

              <button type="button" className="mk-fab" aria-label="Ask KenoAi" onClick={go}>
                <IcoSpark size={20} />
              </button>
            </div>

            <div className="k-float-card k-float-a">
              <span className="k-fl-ico"><IcoCheck size={17} /></span>
              <span><b>Proposal delivered on time</b><small>Client confirmation scheduled</small></span>
            </div>
            <div className="k-float-card k-float-b">
              <span className="k-fl-ico k-fl-ico-teal"><IcoTrend /></span>
              <span><b>+32% team throughput</b><small>since switching to KenoAi</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK STARTS ================= */}
      <section className="k-quick" data-animate>
        <div className="k-container">
          <div className="k-sec-head">
            <span className="k-kicker">QUICK STARTS</span>
            <h2>What would you like to do today?</h2>
            <p>Ask anything — or start from a suggestion. KenoAi understands context, files, and follow-ups.</p>
          </div>
          <div className="k-quick-grid">
            <button type="button" className="k-qcard" onClick={go}>
              <span className="k-q-ico"><IcoSpark size={20} /></span>
              <span className="k-q-text">Summarize this week's client feedback into 3 action items</span>
              <span className="k-q-meta"><i className="k-tag">Popular</i><span className="k-q-arrow"><IcoArrow /></span></span>
            </button>
            <button type="button" className="k-qcard" onClick={go}>
              <span className="k-q-ico"><IcoTask /></span>
              <span className="k-q-text">Draft a professional reply to the client's pricing question</span>
              <span className="k-q-meta"><i className="k-tag">For business</i><span className="k-q-arrow"><IcoArrow /></span></span>
            </button>
            <button type="button" className="k-qcard" onClick={go}>
              <span className="k-q-ico"><IcoDoc /></span>
              <span className="k-q-text">Turn my rough notes into a clean meeting agenda</span>
              <span className="k-q-meta"><i className="k-tag">Time saver</i><span className="k-q-arrow"><IcoArrow /></span></span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="k-features" id="features" data-animate>
        <div className="k-container">
          <div className="k-sec-head">
            <span className="k-kicker">FEATURES</span>
            <h2>Everything you need to run work with AI</h2>
            <p>A professional assistant that fits into how your team already works — not another tab to babysit.</p>
          </div>
          <div className="k-feat-grid">
            <div className="k-fcard">
              <div className="k-fico c-purple"><IcoSpark size={22} /></div>
              <h3>Streaming AI chat</h3>
              <p>Answers appear word-by-word from the strongest models — fast, focused, and easy to steer.</p>
            </div>
            <div className="k-fcard">
              <div className="k-fico c-teal"><IcoBolt /></div>
              <h3>Task &amp; project tracking</h3>
              <p>Track requests end-to-end from brief to delivery, with priorities, due dates, and owners.</p>
            </div>
            <div className="k-fcard">
              <div className="k-fico c-orange"><IcoBrain /></div>
              <h3>Smart personas</h3>
              <p>Professional for clients, Developer for code, Casual for quick thoughts. The tone adapts.</p>
            </div>
            <div className="k-fcard">
              <div className="k-fico c-blue"><IcoGlobe /></div>
              <h3>Understands images &amp; docs</h3>
              <p>Attach screenshots or documents — ask questions and get structured answers back.</p>
            </div>
            <div className="k-fcard">
              <div className="k-fico c-purple"><IcoGithub /></div>
              <h3>GitHub connected</h3>
              <p>Ask about repositories, files, and issues. KenoAi reads your codebase to answer precisely.</p>
            </div>
            <div className="k-fcard">
              <div className="k-fico c-green"><IcoShield /></div>
              <h3>Private by design</h3>
              <p>Self-hosted and open source. Your data stays on your infrastructure — no tracking, no selling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="k-how" id="how" data-animate>
        <div className="k-container">
          <div className="k-sec-head">
            <span className="k-kicker">HOW IT WORKS</span>
            <h2>From sign-in to first result in minutes</h2>
            <p>No onboarding calls. No complex setup. Just sign in and work.</p>
          </div>
          <div className="k-steps">
            <div className="k-step">
              <div className="k-step-n">1</div>
              <h3>Sign in with Google</h3>
              <p>One tap and your workspace is ready. No new password to remember.</p>
            </div>
            <div className="k-step">
              <div className="k-step-n">2</div>
              <h3>Ask or assign</h3>
              <p>Type a question, paste a brief, or add a task. KenoAi handles the rest.</p>
            </div>
            <div className="k-step">
              <div className="k-step-n">3</div>
              <h3>Get work done</h3>
              <p>Answers, drafts, and summaries stream in seconds — ready to send or edit.</p>
            </div>
            <div className="k-step">
              <div className="k-step-n">4</div>
              <h3>Track &amp; follow up</h3>
              <p>Pin important chats, track usage, and let reminders keep you honest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOR BUSINESS ================= */}
      <section className="k-teams" id="business" data-animate>
        <div className="k-container">
          <div className="k-sec-head">
            <span className="k-kicker">FOR BUSINESS</span>
            <h2>Built for teams that serve customers</h2>
            <p>When every client matters, you need an assistant that keeps pace with real work — not demos.</p>
          </div>
          <div className="k-teams-grid">
            <div className="k-tcard">
              <div className="k-t-visual">
                <div className="k-t-chat">
                  <div className="k-bubble k-bubble-user">Can you draft the kickoff email for our new client?</div>
                  <div className="k-bubble k-bubble-ai">
                    <img src="/icon-192.png" alt="" />
                    <span>Sure — here's a warm, professional draft with timeline, contacts, and next steps. Want me to adjust the tone?</span>
                  </div>
                </div>
              </div>
              <h3>Client care, on autopilot</h3>
              <p>Professional replies, follow-up reminders, and meeting agendas — drafted in seconds, in your voice.</p>
              <button type="button" className="k-link" onClick={go}>Try it now <IcoArrow /></button>
            </div>

            <div className="k-tcard">
              <div className="k-t-visual">
                <div className="k-t-bars">
                  <div className="k-bar"><span>Product Launch</span><em>73%</em><i><b style={{ '--w': '73%' }} /></i></div>
                  <div className="k-bar"><span>Client Onboarding</span><em>45%</em><i><b style={{ '--w': '45%' }} /></i></div>
                  <div className="k-bar"><span>Q1 Marketing</span><em>11%</em><i><b style={{ '--w': '11%' }} /></i></div>
                </div>
              </div>
              <h3>Projects under control</h3>
              <p>Every request becomes a trackable task — priorities, due dates, and progress at a glance.</p>
              <button type="button" className="k-link" onClick={go}>See it in action <IcoArrow /></button>
            </div>

            <div className="k-tcard">
              <div className="k-t-visual">
                <div className="k-t-docs">
                  <div className="k-doc"><i className="d-purple" />Brand guidelines 2026 <IcoCheck size={14} /></div>
                  <div className="k-doc"><i className="d-teal" />Client onboarding checklist <IcoCheck size={14} /></div>
                  <div className="k-doc"><i className="d-orange" />Weekly client digest <IcoCheck size={14} /></div>
                </div>
              </div>
              <h3>Knowledge that stays</h3>
              <p>Summaries, docs, and decisions are saved in organized history — searchable anytime.</p>
              <button type="button" className="k-link" onClick={go}>Explore history <IcoArrow /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="k-stats" data-animate>
        <div className="k-container">
          <div className="k-stats-in">
            <div className="k-stat"><b>50K+</b><span>Active users</span></div>
            <div className="k-stat"><b>100M+</b><span>Tokens processed</span></div>
            <div className="k-stat"><b>99.9%</b><span>Uptime</span></div>
            <div className="k-stat"><b>24/7</b><span>Priority support</span></div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="k-cta" id="cta" data-animate>
        <div className="k-container">
          <button type="button" className="k-cta-card" onClick={go}>
            <div className="k-cta-orb a" />
            <div className="k-cta-orb b" />
            <h2>Ready to work the smart way?</h2>
            <p>Join thousands of professionals and teams already using KenoAi to serve clients faster and deliver better work.</p>
            <span className="k-btn k-btn-white k-btn-lg"><IcoGoogle /> Sign in with Google — it's free</span>
            <small>No credit card required · Your data stays yours</small>
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="k-foot">
        <div className="k-container k-foot-in">
          <div className="k-foot-brand">
            <a
              className="k-brand k-brand-light"
              href="#hero"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img src="/icon-192.png" alt="KenoAi logo" width="36" height="36" className="k-logo" />
              <span className="k-brand-name">KenoAi</span>
            </a>
            <p>The AI workspace for teams that serve customers. Open source, self-hosted, private by design.</p>
          </div>
          <div className="k-foot-cols">
            <div>
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#business">For business</a>
              <a href="#cta">Get started</a>
              <a href="https://github.com/KenopsiaHUB-101/KenoAi" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <div>
              <h5>Resources</h5>
              <a href="https://github.com/KenopsiaHUB-101/KenoAi#readme" target="_blank" rel="noreferrer">Documentation</a>
              <a href="#features">Changelog</a>
              <a href="#business">Case studies</a>
              <a href="https://www.buymeacoffee.com/kenopsia" target="_blank" rel="noreferrer">Donate</a>
            </div>
            <div>
              <h5>Company</h5>
              <a href="#cta">About</a>
              <a href="#cta">Contact</a>
              <a href="#cta">Privacy</a>
              <a href="#cta">Terms</a>
            </div>
          </div>
        </div>
        <div className="k-foot-bar">
          <div className="k-container">
            © 2026 KenoAi. All rights reserved. No data collection. No tracking. Open source.
          </div>
        </div>
      </footer>
    </div>
  );
}
