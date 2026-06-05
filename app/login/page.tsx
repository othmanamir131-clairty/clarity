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
    <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px', margin: '1rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#2d5a27', marginBottom: '8px' }}>✦ Clarity</div>
          <div style={{ fontSize: '14px', color: '#888' }}>{isSignUp ? 'Create your account' : 'Welcome back'}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #d6cfc0', fontSize: '14px', outline: 'none', backgroundColor: '#faf8f4', color: '#333' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #d6cfc0', fontSize: '14px', outline: 'none', backgroundColor: '#faf8f4', color: '#333' }}          />

          {message && (
            <div style={{ fontSize: '13px', color: message.includes('Check') ? '#2d5a27' : '#e53e3e', backgroundColor: message.includes('Check') ? '#eaf3de' : '#fff5f5', padding: '10px 12px', borderRadius: '8px' }}>
              {message}
            </div>
          )}

          <button
            onClick={handleAuth}
            style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '4px' }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '8px' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#2d5a27', cursor: 'pointer', fontWeight: '500' }}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}