import React, { useEffect, useState } from 'react';
import Login from './Login.jsx';
import { IcoSpark } from './icons.jsx';

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
                <span className="btn-icon">✨</span>
                Get Started with Google
              </button>
              <button type="button" className="btn btn-secondary btn-large">
                <span className="btn-icon">📖</span>
                View Docs
              </button>
            </div>
            <p className="hero-note">Sign in with Google to access your personal AI assistant</p>

            {/* Floating Card */}
            <div className="hero-floating-card">
              <div className="floating-content">
                <div className="floating-icon">💬</div>
                <div className="floating-text">
                  <p className="floating-title">Smart Conversations</p>
                  <p className="floating-desc">Real-time AI responses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image with Animation */}
          <div className="hero-image" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <div className="image-placeholder">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                  <div className="preview-dot"></div>
                </div>
                <div className="preview-content">
                  <div className="preview-line short"></div>
                  <div className="preview-line"></div>
                  <div className="preview-line medium"></div>
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
                <div className="feature-icon">⚡</div>
              </div>
              <h3>Lightning Fast</h3>
              <p>Real-time streaming responses powered by cutting-edge models. Get answers instantly.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-2">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔒</div>
              </div>
              <h3>100% Private</h3>
              <p>Your conversations stay on your device. No tracking, no selling your data. Ever.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-3">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🎯</div>
              </div>
              <h3>Multi-Purpose</h3>
              <p>Code, write emails, brainstorm ideas, analyze data. One assistant for everything.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-4">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🧠</div>
              </div>
              <h3>Smart Personas</h3>
              <p>Choose Professional, Developer, or Casual mode. AI adapts to your style.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-5">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3>Usage Dashboard</h3>
              <p>Track your API usage with beautiful analytics. Never be surprised by costs.</p>
              <div className="feature-accent"></div>
            </div>

            <div className="feature-card feature-card-6">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌐</div>
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
              <div className="step-icon">👤</div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-2">
              <div className="step-number-wrapper">
                <div className="step-number">2</div>
              </div>
              <h3>Pick Your Style</h3>
              <p>Choose between Professional, Developer, or Casual personas to shape AI's responses.</p>
              <div className="step-icon">🎨</div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-3">
              <div className="step-number-wrapper">
                <div className="step-number">3</div>
              </div>
              <h3>Start Chatting</h3>
              <p>Type your question, attach images, and get instant AI-powered answers.</p>
              <div className="step-icon">💬</div>
            </div>

            <div className="step-connector"></div>

            <div className="step step-4">
              <div className="step-number-wrapper">
                <div className="step-number">4</div>
              </div>
              <h3>Monitor Usage</h3>
              <p>Track token usage and costs in real-time via the built-in analytics dashboard.</p>
              <div className="step-icon">📈</div>
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
                <div className="card-icon">👑</div>
                <h4>KenoAi Pro</h4>
              </div>
              <p>Unlimited access to all AI models and premium features. Priority support included.</p>
              <a href="#" className="card-link">
                Learn more <span>→</span>
              </a>
            </div>

            <div className="ecosystem-card ecosystem-card-2">
              <div className="card-header">
                <div className="card-icon">🔌</div>
                <h4>API Access</h4>
              </div>
              <p>Integrate KenoAi into your applications with our powerful REST API.</p>
              <a href="#" className="card-link">
                Explore API <span>→</span>
              </a>
            </div>

            <div className="ecosystem-card ecosystem-card-3">
              <div className="card-header">
                <div className="card-icon">👥</div>
                <h4>Team Plans</h4>
              </div>
              <p>Collaborate with your team on shared conversations and projects.</p>
              <a href="#" className="card-link">
                See pricing <span>→</span>
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
