'use client'

import { useState } from 'react'

export default function VideoAnalysis() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

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

Return ONLY a raw JSON object with no markdown, no backticks, no explanation. Just the JSON:
{"title":"Guessed video topic","score":82,"hooks":["Hook 1","Hook 2","Hook 3","Hook 4","Hook 5"],"contentIdeas":["Idea 1","Idea 2","Idea 3","Idea 4","Idea 5","Idea 6"],"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"],"strategy":"2-3 sentence strategy here","postingTips":["Tip 1","Tip 2","Tip 3"],"niche":"Fitness/Tech/etc","format":"Short form/Long form/Tutorial"}`
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

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.97); } }
        .card { animation: fadeIn 0.5s ease forwards; }
        .bubble { display: inline-block; padding: 8px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: default; transition: transform 0.2s; }
        .bubble:hover { transform: scale(1.05); }
        .score-ring { animation: float 3s ease-in-out infinite; }
        .analyze-btn { transition: all 0.2s ease; }
        .analyze-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,90,39,0.35); }
        .spinner { width: 22px; height: 22px; border: 3px solid rgba(212,232,194,0.3); border-top: 3px solid #d4e8c2; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .tag-bubble { animation: fadeIn 0.3s ease forwards; }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2rem 1.5rem' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27' }}>✦ Clarity</div>
            <div onClick={() => window.location.href = '/'} style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>← Dashboard</div>
          </div>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#fdf6e3', border: '1px solid #e8d5a0', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#7a5c10', fontWeight: '500', marginBottom: '1rem' }}>⭐ Premium Feature</div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>🎬 Video Analysis</div>
            <div style={{ fontSize: '15px', color: '#888', maxWidth: '480px', margin: '0 auto' }}>Paste any YouTube URL and get a full content strategy — hooks, ideas, hashtags, and more.</div>
          </div>

          {/* Input */}
          <div style={{ backgroundColor: 'white', border: '2px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '12px' }}>🔗 Paste your YouTube URL</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #d6cfc0', fontSize: '14px', outline: 'none', color: '#333', backgroundColor: '#faf8f4' }}
              />
              <button
                className="analyze-btn"
                onClick={analyze}
                disabled={loading}
                style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
              >
                {loading ? <><div className="spinner"></div> Analyzing...</> : '✨ Analyze'}
              </button>
            </div>
            {error && <div style={{ marginTop: '10px', fontSize: '13px', color: '#e53e3e', backgroundColor: '#fff5f5', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '40px', marginBottom: '1rem', animation: 'pulse 1.5s ease infinite' }}>🎬</div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>Analyzing your video...</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Extracting hooks, ideas, and strategy</div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Score + Meta */}
              <div className="card" style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="score-ring" style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: result.score >= 70 ? '#eaf3de' : '#fdf6e3', border: `4px solid ${result.score >= 70 ? '#2d5a27' : '#c2a84a'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0 }}>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: result.score >= 70 ? '#2d5a27' : '#c2a84a' }}>{result.score}</div>
                  <div style={{ fontSize: '10px', color: '#888' }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>{result.title}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#eaf3de', color: '#2d5a27', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>📌 {result.niche}</span>
                    <span style={{ backgroundColor: '#f5f0e8', color: '#7a5c10', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>🎥 {result.format}</span>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div className="card" style={{ backgroundColor: '#2d5a27', borderRadius: '16px', padding: '1.5rem', animationDelay: '0.1s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#a8d48a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>🧠 Content Strategy</div>
                <div style={{ fontSize: '15px', color: 'white', lineHeight: '1.7' }}>{result.strategy}</div>
              </div>

              {/* Hooks */}
              <div className="card" style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem', animationDelay: '0.15s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>🎣 Scroll-Stopping Hooks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.hooks?.map((hook: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', backgroundColor: '#faf8f4', borderRadius: '10px', border: '1px solid #ede9de' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#d4e8c2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#2d5a27', flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{hook}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Ideas */}
              <div className="card" style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem', animationDelay: '0.2s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>💡 Content Ideas</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {result.contentIdeas?.map((idea: string, i: number) => (
                    <div key={i} className="bubble tag-bubble" style={{ backgroundColor: i % 3 === 0 ? '#eaf3de' : i % 3 === 1 ? '#f5f0e8' : '#fdf6e3', color: i % 3 === 0 ? '#2d5a27' : i % 3 === 1 ? '#5a4a2a' : '#7a5c10', border: `1px solid ${i % 3 === 0 ? '#c2dba8' : i % 3 === 1 ? '#d6cfc0' : '#e8d5a0'}`, animationDelay: `${i * 0.05}s` }}>
                      {idea}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div className="card" style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem', animationDelay: '0.25s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>#️⃣ Hashtags</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.hashtags?.map((tag: string, i: number) => (
                    <div key={i} className="bubble tag-bubble" style={{ backgroundColor: '#f0f8e8', color: '#2d5a27', border: '1px solid #c2dba8', animationDelay: `${i * 0.04}s` }}>
                      {tag}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(result.hashtags?.join(' '))}
                  style={{ marginTop: '12px', backgroundColor: 'transparent', border: '1px solid #d6cfc0', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', cursor: 'pointer', color: '#888' }}
                >
                  📋 Copy all hashtags
                </button>
              </div>

              {/* Posting Tips */}
              <div className="card" style={{ backgroundColor: '#fdf6e3', border: '1px solid #e8d5a0', borderRadius: '16px', padding: '1.5rem', animationDelay: '0.3s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#7a5c10', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>⚡ Posting Tips</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.postingTips?.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ fontSize: '16px' }}>{'💡⚡🎯'[i]}</div>
                      <div style={{ fontSize: '14px', color: '#5a4a2a', lineHeight: '1.5' }}>{tip}</div>
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