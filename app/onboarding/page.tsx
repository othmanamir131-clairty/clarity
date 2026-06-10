'use client'

// Required SQL (run in Supabase SQL Editor once):
// ALTER TABLE profiles
//   ADD COLUMN IF NOT EXISTS display_name text,
//   ADD COLUMN IF NOT EXISTS creator_type text,
//   ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false;

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { completeOnboarding, isUserOnboarded } from '../../lib/onboarding'

const CREATOR_TYPES = [
  { id: 'youtube',   label: 'YouTuber',   emoji: '▶️', desc: 'Long & short-form video' },
  { id: 'instagram', label: 'Instagram',  emoji: '📸', desc: 'Photos, Reels & Stories' },
  { id: 'tiktok',    label: 'TikTok',     emoji: '🎵', desc: 'Short-form video' },
  { id: 'blogger',   label: 'Blogger',    emoji: '✍️', desc: 'Articles & written content' },
  { id: 'podcaster', label: 'Podcaster',  emoji: '🎙️', desc: 'Audio & interviews' },
  { id: 'other',     label: 'Other',      emoji: '✦',  desc: 'Something unique' },
]

export default function Onboarding() {
  const [step, setStep]               = useState(1)
  const [name, setName]               = useState('')
  const [creatorType, setCreatorType] = useState('')
  const [saving, setSaving]           = useState(false)
  const [saveError, setSaveError]     = useState('')
  const [user, setUser]               = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      supabase
        .from('profiles')
        .select('onboarded, display_name')
        .eq('user_id', data.user.id)
        .maybeSingle()
        .then(({ data: profile }) => {
          if (isUserOnboarded(data.user, profile)) {
            window.location.href = '/'
            return
          }
          if (data.user.user_metadata?.display_name) {
            setName(data.user.user_metadata.display_name as string)
          } else if (profile?.display_name) {
            setName(profile.display_name)
          }
        })
    })
  }, [])

  const saveAndComplete = async () => {
    if (!user || !creatorType) return
    setSaving(true)
    setSaveError('')

    const result = await completeOnboarding({
      userId: user.id,
      email: user.email,
      displayName: name,
      creatorType,
    })

    setSaving(false)

    if (!result.ok) {
      setSaveError(result.error || 'Could not save your profile. Please try again.')
      return
    }

    setStep(3)
  }

  const displayName = name.trim() || user?.email?.split('@')[0] || 'there'

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
          color: white;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes blob   { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .ob-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 28px;
          padding: 3rem 2.75rem;
          width: 100%;
          max-width: 520px;
          animation: fadeUp 0.5s ease;
        }

        .ob-input {
          width: 100%; padding: 14px 18px;
          border-radius: 14px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.09);
          font-size: 16px; outline: none; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .ob-input::placeholder { color: rgba(255,255,255,0.3); }
        .ob-input:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(255,255,255,0.13);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.12);
        }

        .ob-btn {
          width: 100%; padding: 15px;
          border-radius: 14px; border: none;
          background: linear-gradient(135deg, #7c3aed, #0d9488);
          color: white; font-size: 16px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
          min-height: 52px;
        }
        .ob-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(124,58,237,0.4); }
        .ob-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .ob-btn-ghost {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px; padding: 13px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; min-height: 48px;
          width: 100%;
        }
        .ob-btn-ghost:hover { background: rgba(255,255,255,0.14); color: white; }

        .creator-card {
          padding: 1.125rem 1rem; border-radius: 16px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          cursor: pointer; transition: all 0.18s ease;
          text-align: center;
        }
        .creator-card:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .creator-card.selected {
          background: rgba(167,139,250,0.2);
          border-color: rgba(167,139,250,0.5);
          box-shadow: 0 4px 20px rgba(124,58,237,0.25);
        }

        .progress-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }
        .progress-dot.active {
          background: #a78bfa;
          width: 24px; border-radius: 100px;
          box-shadow: 0 0 10px rgba(167,139,250,0.6);
        }
        .progress-dot.done { background: #34d399; }

        .success-ring {
          width: 88px; height: 88px; border-radius: 50%;
          background: rgba(52,211,153,0.15);
          border: 2px solid rgba(52,211,153,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; margin: 0 auto 1.5rem;
          animation: float 2.5s ease-in-out infinite;
          box-shadow: 0 0 32px rgba(52,211,153,0.3);
        }

        @media (max-width: 600px) {
          .ob-card { padding: 2rem 1.5rem; border-radius: 20px; }
          .creator-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .ob-btn { font-size: 15px; }
          .ob-input { font-size: 15px; }
        }
        @media (max-width: 400px) {
          .ob-card { padding: 1.75rem 1.25rem; margin: 0 0.5rem; }
        }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

        {/* Logo */}
        <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(167,139,250,0.6)', marginBottom: '2.5rem' }}>✦ Clarity</div>

        <div className="ob-card">

          {/* Progress dots */}
          {step < 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '2rem' }}>
              <div className={`progress-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`} />
              <div className={`progress-dot ${step >= 2 ? 'active' : ''}`} />
            </div>
          )}

          {/* ── STEP 1: Name ── */}
          {step === 1 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Step 1 of 2</div>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: 'white', letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '10px' }}>
                Welcome to Clarity! 👋
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', lineHeight: 1.65 }}>
                Let's set up your creator profile in 2 quick steps.
              </p>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>What should we call you?</div>
                <input
                  className="ob-input"
                  type="text"
                  placeholder="Your name..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                  autoFocus
                />
              </div>

              <button className="ob-btn" onClick={() => setStep(2)} disabled={!name.trim()}>
                Next →
              </button>

              <button className="ob-btn-ghost" style={{ marginTop: '10px' }} onClick={() => setStep(2)}>
                Skip for now
              </button>
            </div>
          )}

          {/* ── STEP 2: Creator type ── */}
          {step === 2 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Step 2 of 2</div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.75px', lineHeight: 1.2, marginBottom: '8px' }}>
                What kind of creator are you?
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                We'll personalize Clarity for your content style.
              </p>

              <div className="creator-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.75rem' }}>
                {CREATOR_TYPES.map(ct => (
                  <div
                    key={ct.id}
                    className={`creator-card ${creatorType === ct.id ? 'selected' : ''}`}
                    onClick={() => setCreatorType(ct.id)}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px', lineHeight: 1 }}>{ct.emoji}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: creatorType === ct.id ? '#c4b5fd' : 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>{ct.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{ct.desc}</div>
                  </div>
                ))}
              </div>

              {saveError && (
                <div style={{ fontSize: '13px', color: '#fca5a5', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '10px 14px', marginBottom: '12px', lineHeight: 1.5 }}>
                  {saveError}
                </div>
              )}

              <button className="ob-btn" onClick={saveAndComplete} disabled={!creatorType || saving}>
                {saving ? 'Setting up...' : 'Launch my workspace →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <span onClick={() => setStep(1)} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontWeight: '600', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                  ← Back
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center', animation: 'popIn 0.5s ease' }}>
              <div className="success-ring">✦</div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', letterSpacing: '-0.75px', lineHeight: 1.15, marginBottom: '12px' }}>
                Your workspace is ready!
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Welcome to Clarity, <span style={{ color: 'white', fontWeight: '700' }}>{displayName}</span>. Start dumping ideas and let the AI organize everything for you.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
                {['AI Brain Dump', 'Ideas Library', 'Clarity Score', 'Content Tools'].map(f => (
                  <div key={f} style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', fontWeight: '600', color: '#c4b5fd' }}>
                    {f}
                  </div>
                ))}
              </div>

              <button className="ob-btn" onClick={() => window.location.href = '/'}>
                Open Clarity →
              </button>
            </div>
          )}
        </div>

        {step < 3 && (
          <p style={{ marginTop: '1.5rem', fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontWeight: '500' }}>
            Takes 30 seconds · No credit card required
          </p>
        )}
      </div>
    </>
  )
}
