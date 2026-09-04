import React from 'react';
import Login from './Login.jsx';
import { IcoSpark } from './icons.jsx';

export default function Landing({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = React.useState(false);

  if (showLogin) {
    return <Login onSuccess={onLoginSuccess} />;
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <IcoSpark />
          <span>KenoAi</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowLogin(true)}>
          Sign in
        </button>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1>Unlock the Power of AI</h1>
            <p className="hero-subtitle">
              Meet <strong>KenoAi</strong> — your intelligent assistant for coding, writing, analysis, and creativity.
              Private, fast, and streaming. No tracking. No ads.
            </p>
            <button type="button" className="btn btn-primary btn-large" onClick={() => setShowLogin(true)}>
              Get Started with Google
            </button>
            <p className="hero-note">Sign in with Google to access your personal AI assistant</p>
          </div>
          <div className="hero-image">
            <img src="/kenoai-avatar.png" alt="KenoAi" width="200" height="200" />
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-features">
          <h2>Why Choose KenoAi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Real-time streaming responses powered by cutting-edge models. Get answers instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>100% Private</h3>
              <p>Your conversations stay on your device. No tracking, no selling your data. Ever.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Multi-Purpose</h3>
              <p>Code, write emails, brainstorm ideas, analyze data. One assistant for everything.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Smart Personas</h3>
              <p>Choose Professional, Developer, or Casual mode. AI adapts to your style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Usage Dashboard</h3>
              <p>Track your API usage with beautiful analytics. Never be surprised by costs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Anywhere, Anytime</h3>
              <p>Works on desktop, tablet, and mobile. Responsive design that looks great everywhere.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="landing-how">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign In</h3>
              <p>Connect with your Google account in seconds. No password to remember.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Pick Your Style</h3>
              <p>Choose between Professional, Developer, or Casual personas to shape AI's responses.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start Chatting</h3>
              <p>Type your question, attach images, and get instant AI-powered answers.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Monitor Usage</h3>
              <p>Track token usage and costs in real-time via the built-in analytics dashboard.</p>
            </div>
          </div>
        </section>

        {/* Ads Section */}
        <section className="landing-ads">
          <div className="ads-container">
            <h2>Explore Our Ecosystem</h2>
            <p>KenoAi is part of a suite of AI-powered tools designed to boost your productivity.</p>
            <div className="ads-grid">
              <div className="ad-card">
                <h4>KenoAi Pro</h4>
                <p>Unlimited access to all AI models and premium features.</p>
                <a href="#" className="ad-link">Learn more →</a>
              </div>
              <div className="ad-card">
                <h4>API Access</h4>
                <p>Integrate KenoAi into your applications with our powerful REST API.</p>
                <a href="#" className="ad-link">Explore API →</a>
              </div>
              <div className="ad-card">
                <h4>Team Plans</h4>
                <p>Collaborate with your team on shared conversations and projects.</p>
                <a href="#" className="ad-link">See pricing →</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="landing-cta">
          <div className="cta-content">
            <h2>Ready to Experience AI?</h2>
            <p>Join thousands of users already using KenoAi to boost their productivity.</p>
            <button type="button" className="btn btn-primary btn-large" onClick={() => setShowLogin(true)}>
              Sign In with Google
            </button>
          </div>
        </section>
      </main>

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
