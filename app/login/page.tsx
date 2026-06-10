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
      else setMessage('Check your email! Click the confirmation link to activate your account.')
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
          min-height: 100vh;
          background: #2e1065;
        }

        .login-card {
          background: rgba(0,0,0,0.4);
          border-radius: 24px;
          padding: 2.75rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .input-field::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .input-field:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(255,255,255,0.14);
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
          transition: all 0.2s ease;
          margin-top: 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .toggle-link {
          color: #a78bfa;
          cursor: pointer;
          font-weight: 700;
          transition: color 0.2s;
        }

        .toggle-link:hover {
          color: #c4b5fd;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 1.5rem 0;
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 2.25rem 1.75rem;
            max-width: 100%;
          }
          body {
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.75rem 1.25rem;
            margin: 0 1rem;
            border-radius: 16px;
          }
          .input-field {
            padding: 11px 14px;
            font-size: 13px;
            border-radius: 10px;
          }
          .submit-btn {
            padding: 12px;
            font-size: 14px;
            border-radius: 10px;
            margin-top: 3px;
          }
          .toggle-link {
            font-size: 13px;
          }
          .divider {
            margin: 1.25rem 0;
          }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, background: '#2e1065', zIndex: 0 }}>
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%)' }} />
      </div>

      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              ✦ Clarity
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </div>
          </div>

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
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
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

          <div style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="toggle-link" onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </div>

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
