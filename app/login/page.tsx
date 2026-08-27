'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getAuthConfirmUrl, getPasswordResetUrl, getPostAuthPath } from '../../lib/auth'

type Mode = 'signin' | 'signup' | 'forgot'

export default function Login() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('')

  const switchMode = (next: Mode) => {
    setMode(next)
    setMessage('')
    setMessageType('')
  }

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    setMessageType('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: getAuthConfirmUrl() },
      })
      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else {
        setMessage('Check your email! Click the confirmation link to activate your account.')
        setMessageType('success')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else {
        window.location.href = await getPostAuthPath()
      }
    }
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage('Enter your email address first.')
      setMessageType('error')
      return
    }
    setLoading(true)
    setMessage('')
    setMessageType('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetUrl(),
    })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else {
      setMessage('Check your email for a reset link.')
      setMessageType('success')
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    if (loading) return
    if (mode === 'forgot') handleForgotPassword()
    else handleAuth()
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #fafdfb;
        }

        @keyframes auroraDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.08); }
        }

        .aurora { position: absolute; border-radius: 9999px; filter: blur(90px); }
        .aurora-a {
          width: 560px; height: 560px; top: -200px; left: -160px;
          background: radial-gradient(circle, rgba(16,185,129,0.32), transparent 70%);
          animation: auroraDrift 22s ease-in-out infinite;
        }
        .aurora-b {
          width: 480px; height: 480px; bottom: -180px; right: -160px;
          background: radial-gradient(circle, rgba(5,150,105,0.22), transparent 70%);
          animation: auroraDrift 27s ease-in-out infinite reverse;
        }

        .login-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.75rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px -24px rgba(16,185,129,0.35);
          border: 1px solid rgba(16,185,129,0.15);
        }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(16,185,129,0.15);
          background: rgba(16,185,129,0.03);
          color: #0f1c17;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .input-field::placeholder {
          color: #5b6b64;
        }

        .input-field:focus {
          border-color: rgba(16,185,129,0.5);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
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
          box-shadow: 0 8px 24px -6px rgba(16,185,129,0.5);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .toggle-link {
          color: #059669;
          cursor: pointer;
          font-weight: 700;
          transition: color 0.2s;
        }

        .toggle-link:hover {
          color: #065f46;
        }

        .forgot-link {
          color: #5b6b64;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #065f46;
        }

        .divider {
          height: 1px;
          background: rgba(16,185,129,0.12);
          margin: 1.5rem 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .aurora { animation: none !important; }
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

      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
      </div>

      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="login-card">
          {/* Social proof bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: '100px', padding: '6px 16px' }}>
            <div style={{ display: 'flex', marginRight: '2px' }}>
              {['#10b981', '#059669', '#fbbf24'].map((c, i) => (
                <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: c, border: '2px solid #ffffff', marginLeft: i > 0 ? '-8px' : 0, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {['🎬', '✍️', '🎙️'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '12px', color: '#065f46', fontWeight: '600' }}>2,400+ creators already inside</span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f1c17', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              <span style={{ backgroundImage: 'linear-gradient(135deg,#10b981,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</span> Clarity
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f1c17', marginBottom: '4px' }}>
              {mode === 'signup' ? 'Start organizing your ideas' : mode === 'forgot' ? 'Reset your password' : 'Welcome back'}
            </div>
            <div style={{ fontSize: '13px', color: '#5b6b64', fontWeight: '500' }}>
              {mode === 'forgot' ? "Enter your email and we'll send a reset link" : 'Dump your ideas. Get an instant action plan.'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />

            {mode !== 'forgot' && (
              <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            )}

            {mode === 'signin' && (
              <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                <span className="forgot-link" onClick={() => switchMode('forgot')}>
                  Forgot password?
                </span>
              </div>
            )}

            {message && (
              <div style={{
                fontSize: '13px',
                color: messageType === 'error' ? '#dc2626' : '#065f46',
                background: messageType === 'error' ? 'rgba(220,38,38,0.06)' : 'rgba(16,185,129,0.08)',
                border: `1px solid ${messageType === 'error' ? 'rgba(220,38,38,0.2)' : 'rgba(16,185,129,0.2)'}`,
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: '500',
              }}>
                {message}
              </div>
            )}

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Loading...' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}
            </button>
          </div>

          <div className="divider" />

          {mode === 'forgot' ? (
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#5b6b64' }}>
              <span className="toggle-link" onClick={() => switchMode('signin')}>
                ← Back to sign in
              </span>
            </div>
          ) : (
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#5b6b64' }}>
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span className="toggle-link" onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}>
                {mode === 'signup' ? 'Sign in' : 'Sign up'}
              </span>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <span
              onClick={() => window.location.href = '/landing'}
              style={{ fontSize: '13px', color: '#5b6b64', cursor: 'pointer', transition: 'color 0.2s', fontWeight: '500' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0f1c17')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5b6b64')}>
              ← Back to home
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
