import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-recovery">
          <img src="/icon-192.png" alt="KenoAi" width="52" height="52" />
          <h1>Something went wrong</h1>
          <p>KenoAi could not render this view. Your saved conversations are still stored locally.</p>
          <button type="button" onClick={() => window.location.reload()}>Reload KenoAi</button>
        </main>
      );
    }
    return this.props.children;
  }
}

// Google OAuth Client ID (set via .env or replace with your client ID)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

