'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/'
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-attachment: fixed;
          min-height: 100vh;
        }

        @keyframes blob {
          0%,100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
          50%      { border-radius: 40% 60% 30% 70% / 60% 40% 70% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }

        .login-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 2.75rem;
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.6s ease forwards;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          font-size: 14px;
          outline: none;
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.35); }
        .input-field:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #0d9488);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          margin-top: 4px;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .toggle-link {
          color: #a78bfa;
          cursor: pointer;
          font-weight: 700;
          transition: color 0.2s;
        }
        .toggle-link:hover { color: #c4b5fd; }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 1.5rem 0;
        }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      {/* Page */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <div className="login-card">

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', marginBottom: '6px', textShadow: '0 0 30px rgba(167,139,250,0.5)' }}>
              ✦ Clarity
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </div>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
            />

            {message && (
              <div style={{
                fontSize: '13px',
                color: message.includes('Check') ? '#6ee7b7' : '#fca5a5',
                background: message.includes('Check') ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${message.includes('Check') ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}`,
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: '500',
              }}>
                {message}
              </div>
            )}

            <button className="submit-btn" onClick={handleAuth} disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="divider" />

          {/* Toggle */}
          <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="toggle-link" onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </div>

          {/* Back to landing */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span
              onClick={() => window.location.href = '/landing'}
              style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s', fontWeight: '500' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              ← Back to home
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
