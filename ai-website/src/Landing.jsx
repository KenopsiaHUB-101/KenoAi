import React, { useEffect, useState } from 'react';
import Login from './Login.jsx';
import { IcoSpark } from './icons.jsx';

/* Inline SVG icons (no emoji) */
const IcoGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/>
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/>
  </svg>
);
const IcoBolt = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
);
const IcoLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IcoTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const IcoBrain = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 17.5a2.5 2.5 0 0 1-1.98-4.03A2.5 2.5 0 0 1 3 9.5a2.5 2.5 0 0 1 2.04-2.46A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 17.5a2.5 2.5 0 0 0 1.98-4.03A2.5 2.5 0 0 0 21 9.5a2.5 2.5 0 0 0-2.04-2.46A2.5 2.5 0 0 0 14.5 2z"/></svg>
);
const IcoChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/></svg>
);
const IcoGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IcoUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IcoPalette = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.2"/><circle cx="17.5" cy="10.5" r="1.2"/><circle cx="8.5" cy="7.5" r="1.2"/><circle cx="6.5" cy="12.5" r="1.2"/><path d="M12 2C6.5 2 2 6.5 2 12s3.5 9 8 9c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H14c4.4 0 8-3.6 8-8 0-4-4.5-6.8-10-6.8z"/></svg>
);
const IcoChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3 21l1.9-5.4a8.2 8.2 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.5-8.3 8.5 8.5 0 0 1 8.5 8.3z"/></svg>
);
const IcoTrend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
const IcoCrown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 18h20"/><path d="M3 8l4.5 3L12 4l4.5 7L21 8l-1.5 10h-15L3 8z"/></svg>
);
const IcoPlug = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z"/><path d="M12 17v5"/></svg>
);
const IcoUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IcoDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
);
const IcoArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

export default function Landing({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = React.useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (showLogin) {
    return <Login onSuccess={onLoginSuccess} />;
  }

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="landing-bg-animation">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon-wrapper">
            <IcoSpark />
          </div>
          <span className="logo-text">KenoAi</span>
        </div>
        <button type="button" className="btn btn-primary btn-header" onClick={() => setShowLogin(true)}>
          Sign in
        </button>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero" id="hero" data-animate>
          <div className="hero-content" style={{ opacity: 1 - scrollY / 800 }}>
            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-powered conversations
            </div>
            <h1 className="hero-title">
              Unlock the Power of <span className="gradient-text">AI Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Meet <strong>KenoAi</strong> — your intelligent assistant for coding, writing, analysis, and creativity.
              Private, fast, and streaming. No tracking. No ads.
            </p>
            <div className="hero-buttons">
              <button type="button" className="btn btn-primary btn-large btn-glow" onClick={() => setShowLogin(true)}>
                <IcoGoogle />
                Get Started with Google
              </button>
              <button type="button" className="btn btn-secondary btn-large">
                <IcoDoc />
                View Docs
              </button>
            </div>
            <p className="hero-note">Sign in with Google to access your personal AI assistant</p>

            {/* Floating Card */}
            <div className="hero-floating-card">
              <div className="floating-content">
                <div className="floating-icon"><IcoChat /></div>
                <div className="floating-text">
                  <p className="floating-title">Smart Conversations</p>
                  <p className="floating-desc">Real-time AI responses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero mockup: KenoAi chat window (no emoji, pure CSS/SVG) */}
          <div className="hero-image" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <div className="mockup-window">
              <div className="mockup-titlebar">
                <span className="mockup-dot dot-r"></span>
                <span className="mockup-dot dot-y"></span>
                <span className="mockup-dot dot-g"></span>
                <span className="mockup-title">KenoAi — Assistant</span>
                <span className="mockup-pill"><span className="badge-dot"></span>online</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-msg user">
                  <div className="mockup-bubble user-b">
                    <p>Explain how transformers work, simply</p>
                  </div>
                </div>
                <div className="mockup-msg ai">
                  <div className="mockup-avatar"><IcoSpark /></div>
                  <div className="mockup-bubble ai-b">
                    <p>Sure — think of a transformer as a team of readers:</p>
                    <p>1. Every word looks at every other word.</p>
                    <p>2. Attention decides what matters most.</p>
                    <div className="mockup-code">
                      <span className="mc-key">def</span> <span className="mc-fn">attend</span>(q, k, v):
                      <br />&nbsp;&nbsp;<span className="mc-key">return</span> softmax(q @ k.T / sqrt(d)) @ v
                    </div>
                    <p className="mockup-typing">
                      <span className="badge-dot"></span>
                      <span className="badge-dot"></span>
                      <span className="badge-dot"></span>
                    </p>
                  </div>
                </div>
                <div className="mockup-composer">
                  <span className="mockup-c-text">Message KenoAi…</span>
                  <span className="mockup-send"><IcoArrowRight /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={`landing-features ${visibleSections['features'] ? 'visible' : ''}`}
          id="features"
          data-animate
        >
          <div className="features-header">
            <h2>Why Choose KenoAi?</h2>
            <p>Enterprise-grade AI features built for productivity</p>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-card-1">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoBolt /></div>
              </div>
              <h3>Lightning Fast</h3>
              <p>Real-time streaming responses powered by cutting-edge models. Get answers instantly.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-2">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoLock /></div>
              </div>
              <h3>100% Private</h3>
              <p>Your conversations stay on your device. No tracking, no selling your data. Ever.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-3">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoTarget /></div>
              </div>
              <h3>Multi-Purpose</h3>
              <p>Code, write emails, brainstorm ideas, analyze data. One assistant for everything.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-4">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoBrain /></div>
              </div>
              <h3>Smart Personas</h3>
              <p>Choose Professional, Developer, or Casual mode. AI adapts to your style.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-5">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoChart /></div>
              </div>
              <h3>Usage Dashboard</h3>
              <p>Track your API usage with beautiful analytics. Never be surprised by costs.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-6">
              <div className="feature-icon-wrapper">
                <div className="feature-icon"><IcoGlobe /></div>
              </div>
              <h3>Anywhere, Anytime</h3>
              <p>Works on desktop, tablet, and mobile. Responsive design that looks great everywhere.</p>
              <div className="feature-accent"></div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className={`landing-how ${visibleSections['how-it-works'] ? 'visible' : ''}`}
          id="how-it-works"
          data-animate
        >
          <div className="how-header">
            <h2>Getting Started is Easy</h2>
            <p>4 simple steps to start using KenoAi</p>
          </div>

          <div className="steps-container">
            <div className="step step-1">
              <div className="step-number-wrapper">
                <div className="step-number">1</div>
              </div>
              <h3>Sign In</h3>
              <p>Connect with your Google account in seconds. No password to remember.</p>
              <div className="step-icon"><IcoUser /></div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-2">
              <div className="step-number-wrapper">
                <div className="step-number">2</div>
              </div>
              <h3>Pick Your Style</h3>
              <p>Choose between Professional, Developer, or Casual personas to shape AI's responses.</p>
              <div className="step-icon"><IcoPalette /></div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-3">
              <div className="step-number-wrapper">
                <div className="step-number">3</div>
              </div>
              <h3>Start Chatting</h3>
              <p>Type your question, attach images, and get instant AI-powered answers.</p>
              <div className="step-icon"><IcoChat /></div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-4">
              <div className="step-number-wrapper">
                <div className="step-number">4</div>
              </div>
              <h3>Monitor Usage</h3>
              <p>Track token usage and costs in real-time via the built-in analytics dashboard.</p>
              <div className="step-icon"><IcoTrend /></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`landing-stats ${visibleSections['stats'] ? 'visible' : ''}`} id="stats" data-animate>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">50K+</h3>
              <p className="stat-label">Active Users</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">100M+</h3>
              <p className="stat-label">Tokens Processed</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">99.9%</h3>
              <p className="stat-label">Uptime</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Support</p>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section
          className={`landing-ecosystem ${visibleSections['ecosystem'] ? 'visible' : ''}`}
          id="ecosystem"
          data-animate
        >
          <div className="ecosystem-header">
            <h2>Explore Our Ecosystem</h2>
            <p>KenoAi is part of a suite of AI-powered tools designed to boost your productivity</p>
          </div>

          <div className="ecosystem-grid">
            <div className="ecosystem-card ecosystem-card-1">
              <div className="card-header">
                <div className="card-icon"><IcoCrown /></div>
                <h4>KenoAi Pro</h4>
              </div>
              <p>Unlimited access to all AI models and premium features. Priority support included.</p>
              <a href="#" className="card-link">
                Learn more <IcoArrowRight />
              </a>
            </div>

            <div className="ecosystem-card ecosystem-card-2">
              <div className="card-header">
                <div className="card-icon"><IcoPlug /></div>
                <h4>API Access</h4>
              </div>
              <p>Integrate KenoAi into your applications with our powerful REST API.</p>
              <a href="#" className="card-link">
                Explore API <IcoArrowRight />
              </a>
            </div>

            <div className="ecosystem-card ecosystem-card-3">
              <div className="card-header">
                <div className="card-icon"><IcoUsers /></div>
                <h4>Team Plans</h4>
              </div>
              <p>Collaborate with your team on shared conversations and projects.</p>
              <a href="#" className="card-link">
                See pricing <IcoArrowRight />
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="landing-cta" id="cta" data-animate>
          <div className="cta-content">
            <h2>Ready to Experience AI?</h2>
            <p>Join thousands of users already using KenoAi to boost their productivity</p>
            <button type="button" className="btn btn-primary btn-large btn-glow" onClick={() => setShowLogin(true)}>
              Sign In with Google
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2026 KenoAi. All rights reserved. No data collection. No tracking. Open source.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Docs</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
