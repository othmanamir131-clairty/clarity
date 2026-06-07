'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Report() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [report, setReport] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else {
        supabase.from('ideas').select('*').then(({ data: ideasData }) => {
          if (ideasData) setIdeas(ideasData)
        })
      }
    })
  }, [])

  const generateReport = async () => {
    setLoading(true)
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideas }),
    })
    const data = await res.json()
    setScore(data.score)
    setReport(data.report)
    setGenerated(true)
    setLoading(false)
  }

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
  } as React.CSSProperties

  const scoreColor = score !== null ? (score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171') : '#a78bfa'
  const scoreGlow  = score !== null ? (score >= 70 ? 'rgba(52,211,153,0.4)' : score >= 40 ? 'rgba(251,191,36,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(167,139,250,0.4)'
  const scoreLabel = score !== null ? (score >= 70 ? '🔥 On fire!' : score >= 40 ? '💡 Getting there' : '🌱 Just starting') : ''

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-attachment: fixed;
          min-height: 100vh; color: white;
        }
        @keyframes blob { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

        .generate-btn {
          background: white; color: #4c1d95;
          border: none; border-radius: 100px;
          padding: 14px 36px; font-size: 16px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }

        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.2); border-top: 2px solid white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .back-link { font-size: 13px; color: rgba(255,255,255,0.4); cursor: pointer; font-weight: 500; transition: color 0.2s; }
        .back-link:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div style={{ minHeight: '100vh', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', textShadow: '0 0 30px rgba(167,139,250,0.5)' }}>✦ Clarity</div>
            <span className="back-link" onClick={() => window.location.href = '/'}>← Dashboard</span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Weekly Report</div>
            <h1 style={{ fontSize: '38px', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '8px' }}>Your Clarity Score ✨</h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>Based on your {ideas.length} saved ideas — here's how you're doing.</p>
          </div>

          {/* Score card */}
          <div style={{ ...glass, padding: '2.25rem', marginBottom: '1.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: `radial-gradient(circle, ${scoreGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

            {!generated && !loading && (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>✨</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Ready to see your score?</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '2rem' }}>The AI will analyze all {ideas.length} of your saved ideas and give you a personal report.</div>
                <button className="generate-btn" onClick={generateReport}>
                  Generate my Clarity Score ✨
                </button>
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
                  <div className="spinner" /> Analyzing your ideas...
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>This takes a few seconds</div>
              </div>
            )}

            {generated && score !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Score ring */}
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `rgba(255,255,255,0.08)`, border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0, boxShadow: `0 0 30px ${scoreGlow}`, animation: 'float 3s ease-in-out infinite' }}>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: scoreColor }}>{score}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>/ 100</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>{scoreLabel}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                    {score >= 70 ? "You're crushing it this week 🚀" : score >= 40 ? 'Good momentum — keep going!' : 'Every idea counts — keep dumping!'}
                  </div>
                  <button onClick={generateReport} style={{ marginTop: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '7px 16px', fontSize: '12px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Report */}
          {generated && report && (
            <div style={{ ...glass, padding: '2rem', animation: 'fadeUp 0.4s ease', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📋 Your personal report</div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.9' }}
                dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a78bfa">$1</strong>').replace(/• /g, '• ') }}
              />
            </div>
          )}

        </div>
      </div>
    </>
  )
}
