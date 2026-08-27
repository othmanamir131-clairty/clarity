'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Status = 'verifying' | 'ready' | 'invalid' | 'done'

export default function ResetPassword() {
  const [status, setStatus] = useState<Status>('verifying')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')

    if (!token_hash || type !== 'recovery') {
      setStatus('invalid')
      return
    }

    supabase.auth.verifyOtp({ token_hash, type: 'recovery' }).then(({ error }) => {
      setStatus(error ? 'invalid' : 'ready')
    })
  }, [])

  const handleSubmit = async () => {
    setFormError('')
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (error) {
      setFormError(error.message)
      return
    }

    setStatus('done')
    setTimeout(() => { window.location.href = '/login' }, 2000)
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
        @keyframes spin { to { transform: rotate(360deg); } }

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

        .reset-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.75rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px -24px rgba(16,185,129,0.35);
          border: 1px solid rgba(16,185,129,0.15);
          text-align: center;
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

        @media (prefers-reduced-motion: reduce) {
          .aurora { animation: none !important; }
        }

        @media (max-width: 480px) {
          .reset-card {
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
          }
        }
      `}</style>

      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
      </div>

      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="reset-card">
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f1c17', letterSpacing: '-0.5px', marginBottom: '1.5rem' }}>
            <span style={{ backgroundImage: 'linear-gradient(135deg,#10b981,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</span> Clarity
          </div>

          {status === 'verifying' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(16,185,129,0.15)', borderTop: '3px solid #10b981', animation: 'spin 0.9s linear infinite' }} />
              </div>
              <div style={{ fontSize: '15px', color: '#5b6b64', fontWeight: '500' }}>Verifying your reset link...</div>
            </>
          )}

          {status === 'invalid' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#dc2626' }}>✗</div>
              </div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f1c17', marginBottom: '8px' }}>
                This reset link is invalid or has expired
              </div>
              <div style={{ fontSize: '14px', color: '#5b6b64', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Please request a new password reset link.
              </div>
              <span className="toggle-link" onClick={() => window.location.href = '/login'}>
                ← Back to login
              </span>
            </>
          )}

          {status === 'ready' && (
            <>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f1c17', marginBottom: '4px' }}>Set a new password</div>
              <div style={{ fontSize: '13px', color: '#5b6b64', fontWeight: '500', marginBottom: '1.5rem' }}>
                Choose a new password for your account.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                <input
                  className="input-field"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <input
                  className="input-field"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />

                {formError && (
                  <div style={{ fontSize: '13px', color: '#dc2626', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', padding: '10px 14px', borderRadius: '10px', fontWeight: '500' }}>
                    {formError}
                  </div>
                )}

                <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </>
          )}

          {status === 'done' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#059669' }}>✓</div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f1c17', marginBottom: '8px' }}>
                Password updated — please sign in
              </div>
              <div style={{ fontSize: '13px', color: '#5b6b64' }}>Redirecting you to login...</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
