import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { store } from './lib.js';

export default function Login({ onSuccess }) {
  const handleLoginSuccess = (credentialResponse) => {
    // Simpan token ke localStorage
    store.set('kenoai_auth_token', credentialResponse.credential);
    store.set('kenoai_auth_timestamp', Date.now());
    
    // Trigger parent callback untuk refresh auth state
    if (onSuccess) onSuccess();
  };

  const handleLoginError = () => {
    console.error('Google login failed');
    alert('Login failed. Please try again.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/kenoai-avatar.png" alt="KenoAi" width="80" height="80" />
          <h1>Welcome to KenoAi</h1>
          <p>Sign in with your Google account to continue</p>
        </div>

        <div className="login-form">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            useOneTap
          />
        </div>

        <div className="login-footer">
          <p className="login-note">We respect your privacy. We never sell your data.</p>
          <div className="login-features">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🌐 Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
