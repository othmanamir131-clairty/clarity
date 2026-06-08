'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function VideoAnalysis() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
    })
  }, [])

  const analyze = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `You are a content strategy expert. A user wants to analyze a YouTube video. Based on the URL provided, make educated guesses about the content and provide a detailed strategy. The URL is: ${url}

Return ONLY a raw JSON object, no markdown, no backticks, no explanation. Just this exact JSON structure: {"title":"Guessed video topic","score":82,"hooks":["Hook 1","Hook 2","Hook 3","Hook 4","Hook 5"],"contentIdeas":["Idea 1","Idea 2","Idea 3","Idea 4","Idea 5","Idea 6"],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],"strategy":"2-3 sentence strategy here","postingTips":["Tip 1","Tip 2","Tip 3"],"niche":"Fitness/Tech/etc","format":"Short form/Long form/Tutorial"}`
      }),
    })
    const data = await res.json()
    try {
      const clean = data.reply.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)
    } catch {
      setError('Could not analyze this video. Try a different URL.')
    }
    setLoading(false)
  }

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
  } as React.CSSProperties

  const scoreColor = result ? (result.score >= 70 ? '#34d399' : result.score >= 40 ? '#fbbf24' : '#f87171') : '#a78bfa'
  const scoreGlow  = result ? (result.score >= 70 ? 'rgba(52,211,153,0.4)' : result.score >= 40 ? 'rgba(251,191,36,0.4)' : 'rgba(248,113,113,0.4)') : 'rgba(167,139,250,0.4)'

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
        @keyframes blob  { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

        .url-input {
          flex: 1; padding: 13px 16px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);
          font-size: 14px; outline: none; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .url-input::placeholder { color: rgba(255,255,255,0.3); }
        .url-input:focus { border-color: rgba(167,139,250,0.5); background: rgba(255,255,255,0.12); }

        .analyze-btn {
          background: white; color: #4c1d95;
          border: none; border-radius: 12px;
          padding: 13px 28px; font-size: 15px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; white-space: nowrap;
          display: flex; align-items: center; gap: 8px;
        }
        .analyze-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.2); }
        .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(76,29,149,0.3); border-top: 2px solid #4c1d95; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .spinner-white { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top: 2px solid white; border-radius: 50%; animation: spin 0.8s linear infinite; }

        .bubble { display: inline-block; padding: 8px 14px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: default; transition: transform 0.2s; }
        .bubble:hover { transform: scale(1.05); }

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
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', textShadow: '0 0 30px rgba(167,139,250,0.5)' }}>✦ Clarity</div>
            <span className="back-link" onClick={() => window.location.href = '/'}>← Dashboard</span>
          </div>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-block', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '100px', padding: '6px 18px', fontSize: '12px', color: '#fcd34d', fontWeight: '700', marginBottom: '1rem', letterSpacing: '0.06em' }}>⭐ PREMIUM FEATURE</div>
            <h1 style={{ fontSize: '38px', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '10px' }}>🎬 Video Analysis</h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto', fontWeight: '500' }}>Paste any YouTube URL and get a full content strategy — hooks, ideas, hashtags, and more.</p>
          </div>

          {/* Input */}
          <div style={{ ...glass, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>🔗 Paste your YouTube URL</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input className="url-input" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze()} placeholder="https://www.youtube.com/watch?v=..." />
              <button className="analyze-btn" onClick={analyze} disabled={loading}>
                {loading ? <><div className="spinner" /> Analyzing...</> : '✨ Analyze'}
              </button>
            </div>
            {error && <div style={{ marginTop: '12px', fontSize: '13px', color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 14px', borderRadius: '10px' }}>{error}</div>}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', animation: 'float 1.5s ease-in-out infinite' }}>🎬</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>Analyzing your video...</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Extracting hooks, ideas, and strategy</div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeUp 0.4s ease' }}>

              {/* Score + meta */}
              <div style={{ ...glass, padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: `0 4px 24px ${scoreGlow}` }}>
                <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0, boxShadow: `0 0 24px ${scoreGlow}`, animation: 'float 3s ease-in-out infinite' }}>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: scoreColor }}>{result.score}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>{result.title}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>📌 {result.niche}</span>
                    <span style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>🎥 {result.format}</span>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div style={{ ...glass, padding: '1.75rem', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>🧠 Content Strategy</div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.75' }}>{result.strategy}</div>
              </div>

              {/* Hooks */}
              <div style={{ ...glass, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>🎣 Scroll-Stopping Hooks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.hooks?.map((hook: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#c4b5fd', flexShrink: 0 }}>{i+1}</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.55' }}>{hook}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Ideas */}
              <div style={{ ...glass, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>💡 Content Ideas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {result.contentIdeas?.map((idea: string, i: number) => (
                    <div key={i} className="bubble" style={{ background: ['rgba(167,139,250,0.15)','rgba(52,211,153,0.12)','rgba(251,191,36,0.12)'][i%3], color: ['#c4b5fd','#6ee7b7','#fcd34d'][i%3], border: `1px solid ${['rgba(167,139,250,0.25)','rgba(52,211,153,0.2)','rgba(251,191,36,0.2)'][i%3]}` }}>
                      {idea}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div style={{ ...glass, padding: '1.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>#️⃣ Hashtags</div>
                  <button onClick={() => { navigator.clipboard.writeText(result.hashtags?.join(' ')); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    style={{ background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.08)', border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '100px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', color: copied ? '#6ee7b7' : 'rgba(255,255,255,0.5)', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
                    {copied ? '✓ Copied!' : '📋 Copy all'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.hashtags?.map((tag: string, i: number) => (
                    <div key={i} className="bubble" style={{ background: 'rgba(52,211,153,0.1)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.2)' }}>{tag}</div>
                  ))}
                </div>
              </div>

              {/* Posting Tips */}
              <div style={{ ...glass, padding: '1.75rem', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>⚡ Posting Tips</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.postingTips?.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{'💡⚡🎯'[i]}</span>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>{tip}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}
