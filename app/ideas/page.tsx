'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { fetchUserIdeas } from '../../lib/ideas'

export default function Ideas() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIdea, setSelectedIdea] = useState<any>(null)
  const [aiInsight, setAiInsight] = useState<{[key: string]: any}>({})
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [search, setSearch] = useState('')

  const fetchIdeas = async () => {
    const data = await fetchUserIdeas()
    setIdeas(data)
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else fetchIdeas()
    })
  }, [])

  const selectIdea = async (idea: any) => {
    setSelectedIdea(idea)
    const key = idea.id || idea.content
    if (aiInsight[key]) return
    setLoadingInsight(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `A user has this idea: "${idea.content}". Return ONLY a raw JSON object, no markdown, no backticks. Just: {"why":"Why this is great in 1-2 sentences","steps":["Step 1","Step 2","Step 3"],"nextStep":"One specific action they can take today","relatedIdeas":["Related idea 1","Related idea 2","Related idea 3"],"difficulty":"Easy","timeframe":"1-2 weeks","potential":"High"}`
      }),
    })
    const data = await res.json()
    try {
      const clean = data.reply.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAiInsight(prev => ({ ...prev, [key]: parsed }))
    } catch {
      setAiInsight(prev => ({ ...prev, [key]: { why: data.reply, steps: [], nextStep: '', relatedIdeas: [], difficulty: '', timeframe: '', potential: '' } }))
    }
    setLoadingInsight(false)
  }

  const filtered = ideas.filter(i => i.content.toLowerCase().includes(search.toLowerCase()))

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
  } as React.CSSProperties

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
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

        .idea-item {
          padding: 12px 14px; border-radius: 12px;
          cursor: pointer; transition: all 0.15s ease;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
        }
        .idea-item:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); transform: translateX(3px); }
        .idea-item.selected { background: rgba(167,139,250,0.2); border-color: rgba(167,139,250,0.4); }

        .search-input {
          width: 100%; padding: 12px 16px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);
          font-size: 14px; outline: none; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease; margin-bottom: 1rem;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-input:focus { border-color: rgba(167,139,250,0.5); background: rgba(255,255,255,0.12); }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top: 2px solid white; border-radius: 50%; animation: spin 0.8s linear infinite; }

        .back-link { font-size: 13px; color: rgba(255,255,255,0.4); cursor: pointer; font-weight: 500; transition: color 0.2s; }
        .back-link:hover { color: rgba(255,255,255,0.7); }

        .insight-bubble {
          border-radius: 14px; padding: 14px 16px;
          animation: popIn 0.3s ease forwards;
        }

        @media (max-width: 768px) {
          .layout { flex-direction: column !important; }
          .right-panel { width: 100% !important; position: static !important; }
          h1 { font-size: 24px !important; line-height: 1.2 !important; }
          p { font-size: 13px !important; }
          .back-link { font-size: 12px !important; }
          .insight-bubble { padding: 10px 12px !important; font-size: 13px !important; }
          .ideas-wrap { padding: 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .layout { gap: 0.75rem !important; }
          .right-panel { min-height: auto !important; }
          h1 { font-size: 20px !important; margin-bottom: 4px !important; }
          p { font-size: 12px !important; margin-bottom: 1rem !important; }
          .ideas-wrap { padding: 1rem !important; }
        }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div className="ideas-wrap" style={{ minHeight: '100vh', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', textShadow: '0 0 30px rgba(167,139,250,0.5)' }}>✦ Clarity</div>
            <span className="back-link" onClick={() => window.location.href = '/'}>← Dashboard</span>
          </div>

          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '6px' }}>💡 My Ideas</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem', fontWeight: '500' }}>Click any idea to get an AI deep dive on the right.</p>

          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search your ideas..." />

          {/* Two column layout */}
          <div className="layout" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            {/* Left — ideas list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{filtered.length} ideas</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>No ideas yet — start chatting on the dashboard!</div>
                </div>
              ) : filtered.map((idea, index) => (
                <div
                  key={index}
                  className={`idea-item ${selectedIdea?.content === idea.content ? 'selected' : ''}`}
                  onClick={() => selectIdea(idea)}
                >
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', marginBottom: '6px', fontWeight: '500' }}>{idea.content}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '2px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(167,139,250,0.25)' }}>{idea.tag}</span>
                    {idea.created_at && <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>{new Date(idea.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Right — AI panel */}
            <div className="right-panel" style={{ width: '420px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
              {!selectedIdea ? (
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>💡</div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Select an idea</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Tap any idea to get an AI deep dive</div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>
                  {/* Panel header */}
                  <div style={{ background: 'rgba(167,139,250,0.2)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>🤖 AI Deep Dive</div>
                    <div style={{ fontSize: '14px', color: 'white', lineHeight: '1.5', fontWeight: '500' }}>{selectedIdea.content}</div>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {loadingInsight ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', justifyContent: 'center', padding: '1.5rem 0' }}>
                        <div className="spinner" /> Analyzing your idea...
                      </div>
                    ) : aiInsight[selectedIdea.id || selectedIdea.content] ? (() => {
                      const ins = aiInsight[selectedIdea.id || selectedIdea.content]
                      return (
                        <>
                          {/* Meta badges */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {ins.difficulty && <span style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.25)', padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>⚡ {ins.difficulty}</span>}
                            {ins.timeframe  && <span style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>⏱ {ins.timeframe}</span>}
                            {ins.potential  && <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.25)', padding: '5px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>🎯 {ins.potential} potential</span>}
                          </div>

                          {ins.why && (
                            <div className="insight-bubble" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>💚 Why it's great</div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.65' }}>{ins.why}</div>
                            </div>
                          )}

                          {ins.steps?.length > 0 && (
                            <div className="insight-bubble" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>📋 How to execute</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {ins.steps.map((step: string, i: number) => (
                                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(167,139,250,0.3)', color: '#c4b5fd', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i+1}</div>
                                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>{step}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {ins.nextStep && (
                            <div className="insight-bubble" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>🚀 Do this today</div>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.65' }}>{ins.nextStep}</div>
                            </div>
                          )}

                          {ins.relatedIdeas?.length > 0 && (
                            <div className="insight-bubble" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
                              <div style={{ fontSize: '11px', fontWeight: '700', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>💡 Related ideas</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {ins.relatedIdeas.map((idea: string, i: number) => (
                                  <span key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px', padding: '4px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{idea}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })() : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
