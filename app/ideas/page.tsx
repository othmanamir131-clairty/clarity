'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Ideas() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIdea, setSelectedIdea] = useState<any>(null)
  const [aiInsight, setAiInsight] = useState<{[key: string]: any}>({})
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else fetchIdeas()
    })
  }, [])

  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false })
    if (data) setIdeas(data)
    setLoading(false)
  }

  const selectIdea = async (idea: any) => {
    setSelectedIdea(idea)
    const key = idea.id || idea.content
    if (aiInsight[key]) return
    setLoadingInsight(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `A user has this idea: "${idea.content}". Return ONLY a raw JSON object, no markdown, no backticks, no explanation. Just this exact JSON structure: {"why":"Why this is great in 1-2 sentences","steps":["Step 1","Step 2","Step 3"],"nextStep":"One specific action they can take today","relatedIdeas":["Related idea 1","Related idea 2","Related idea 3"],"difficulty":"Easy","timeframe":"1-2 weeks","potential":"High"}`
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

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .idea-item { transition: all 0.15s ease; cursor: pointer; }
        .idea-item:hover { transform: translateX(3px); }
        .spinner { width: 16px; height: 16px; border: 2px solid #d6cfc0; border-top: 2px solid #2d5a27; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
        @media (max-width: 768px) { .layout { flex-direction: column !important; } .right-panel { width: 100% !important; } }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27' }}>✦ Clarity</div>
            <div onClick={() => window.location.href = '/'} style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>← Dashboard</div>
          </div>

          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>💡 My Ideas</div>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '1.5rem' }}>Click any idea to get an AI deep dive on the right.</div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search your ideas..."
            style={{ width: '100%', padding: '11px 16px', borderRadius: '10px', border: '1px solid #d6cfc0', fontSize: '14px', outline: 'none', backgroundColor: 'white', color: '#333', marginBottom: '1.25rem' }}
          />

          <div className="layout" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
              <div style={{ fontSize: '12px', color: '#aaa', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{filtered.length} ideas</div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
                  <div style={{ fontSize: '14px', color: '#888' }}>No ideas yet — start chatting!</div>
                </div>
              ) : filtered.map((idea, index) => {
                const isSelected = selectedIdea?.content === idea.content
                return (
                  <div
                    key={index}
                    className="idea-item"
                    onClick={() => selectIdea(idea)}
                    style={{ backgroundColor: isSelected ? '#eaf3de' : 'white', border: `1.5px solid ${isSelected ? '#c2dba8' : '#e8e4da'}`, borderRadius: '12px', padding: '12px 14px' }}
                  >
                    <div style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: '1.5', marginBottom: '6px', fontWeight: isSelected ? '500' : '400' }}>{idea.content}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ backgroundColor: '#eaf3de', color: '#2d5a27', border: '1px solid #c2dba8', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: '500' }}>{idea.tag}</span>
                      {idea.created_at && <span style={{ fontSize: '10px', color: '#bbb' }}>{new Date(idea.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="right-panel" style={{ width: '420px', flexShrink: 0, position: 'sticky', top: '2rem' }}>
              {!selectedIdea ? (
                <div style={{ backgroundColor: 'white', border: '1.5px dashed #d6cfc0', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>👈</div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' }}>Select an idea</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>Click any idea on the left to get an AI deep dive</div>
                </div>
              ) : (
                <div style={{ backgroundColor: 'white', border: '1.5px solid #d6cfc0', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#2d5a27', padding: '1.25rem' }}>
                    <div style={{ fontSize: '11px', color: '#a8d48a', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>🤖 AI Deep Dive</div>
                    <div style={{ fontSize: '14px', color: 'white', lineHeight: '1.5' }}>{selectedIdea.content}</div>
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loadingInsight ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '13px', justifyContent: 'center', padding: '1.5rem 0' }}>
                        <div className="spinner"></div> Analyzing your idea...
                      </div>
                    ) : aiInsight[selectedIdea.id || selectedIdea.content] ? (() => {
                      const insight = aiInsight[selectedIdea.id || selectedIdea.content]
                      return (
                        <>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {insight.difficulty && <span style={{ backgroundColor: '#eaf3de', color: '#2d5a27', border: '1px solid #c2dba8', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>⚡ {insight.difficulty}</span>}
                            {insight.timeframe && <span style={{ backgroundColor: '#f5f0e8', color: '#5a4a2a', border: '1px solid #d6cfc0', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>⏱ {insight.timeframe}</span>}
                            {insight.potential && <span style={{ backgroundColor: '#fdf6e3', color: '#7a5c10', border: '1px solid #e8d5a0', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>🎯 {insight.potential} potential</span>}
                          </div>

                          {insight.why && (
                            <div style={{ backgroundColor: '#eaf3de', border: '1px solid #c2dba8', borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '600', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>💚 Why it's great</div>
                              <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}>{insight.why}</div>
                            </div>
                          )}

                          {insight.steps?.length > 0 && (
                            <div style={{ backgroundColor: '#f5f0e8', border: '1px solid #d6cfc0', borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '600', color: '#5a4a2a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>📋 How to execute</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {insight.steps.map((step: string, i: number) => (
                                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#2d5a27', color: '#d4e8c2', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i+1}</div>
                                    <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{step}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {insight.nextStep && (
                            <div style={{ backgroundColor: '#2d5a27', borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '600', color: '#a8d48a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>🚀 Do this today</div>
                              <div style={{ fontSize: '13px', color: 'white', lineHeight: '1.6' }}>{insight.nextStep}</div>
                            </div>
                          )}

                          {insight.relatedIdeas?.length > 0 && (
                            <div style={{ backgroundColor: '#fdf6e3', border: '1px solid #e8d5a0', borderRadius: '14px', padding: '12px 14px' }}>
                              <div style={{ fontSize: '11px', fontWeight: '600', color: '#7a5c10', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>💡 Related ideas</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {insight.relatedIdeas.map((idea: string, i: number) => (
                                  <span key={i} style={{ backgroundColor: 'white', border: '1px solid #e8d5a0', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', color: '#7a5c10' }}>{idea}</span>
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