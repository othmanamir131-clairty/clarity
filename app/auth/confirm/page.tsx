'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AuthConfirm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your account...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token_hash = params.get('token_hash')
    const type = params.get('type')

    if (!token_hash || !type) {
      setStatus('error')
      setMessage('Invalid confirmation link. Please try signing up again.')
      setTimeout(() => { window.location.href = '/login' }, 3000)
      return
    }

    supabase.auth.verifyOtp({ token_hash, type: type as 'signup' | 'email' }).then(({ error }) => {
      if (error) {
        setStatus('error')
        setMessage(error.message || 'Confirmation failed. Please try again.')
        setTimeout(() => { window.location.href = '/login' }, 3000)
      } else {
        setStatus('success')
        setMessage('Account confirmed! Taking you to the dashboard...')
        setTimeout(() => { window.location.href = '/' }, 1500)
      }
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #2e1065; }

        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-30px) scale(1.05); }
          66% { transform: translate(-20px,20px) scale(0.97); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: '#2e1065', zIndex: 0 }}>
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%)' }} />
      </div>

      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 600, height: 600, top: -200, left: -150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 550, height: 550, bottom: -150, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, top: '40%', left: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,28,135,0.25) 0%, transparent 70%)', animation: 'blob 20s ease-in-out infinite 2s' }} />
      </div>

      {/* Card */}
      <div style={{ position: 'relative', minHeight: '100vh', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          {/* Icon */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            {status === 'loading' && (
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTop: '3px solid #a78bfa',
                animation: 'spin 0.9s linear infinite',
              }} />
            )}
            {status === 'success' && (
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(13,148,136,0.3), rgba(52,211,153,0.2))',
                border: '1px solid rgba(52,211,153,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>✓</div>
            )}
            {status === 'error' && (
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
              }}>✗</div>
            )}
          </div>

          <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', marginBottom: '10px' }}>
            ✦ Clarity
          </div>

          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', fontWeight: '500', lineHeight: 1.6 }}>
            {message}
          </div>

          {status !== 'loading' && (
            <div style={{ marginTop: '1rem', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              Redirecting you shortly...
            </div>
          )}
        </div>
      </div>
    </>
  )
}
