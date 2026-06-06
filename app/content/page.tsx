'use client'

import { useState } from 'react'

type Tool = 'caption' | 'hashtag' | 'hook'

export default function Content() {
  const [activeTool, setActiveTool] = useState<Tool>('caption')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const tools = [
    { id: 'caption', label: 'Caption Writer', emoji: '✍️', desc: 'Get 3 captions in different tones', color: '#eaf3de', border: '#c2dba8' },
    { id: 'hashtag', label: 'Hashtag Generator', emoji: '#️⃣', desc: '30 hashtags mixed for max reach', color: '#f5f0e8', border: '#d6cfc0' },
    { id: 'hook', label: 'Hook Generator', emoji: '🎣', desc: '5 scroll-stopping openers', color: '#fdf6e3', border: '#e8d5a0' },
  ]

  const prompts: Record<Tool, string> = {
    caption: `You are a social media expert. Write 3 engaging captions for this post. Each caption should be different in tone — one professional, one casual, one inspiring. Use emojis naturally. Keep each under 150 words. Format with clear labels like "Option 1:", "Option 2:", "Option 3:".`,
    hashtag: `You are a social media hashtag expert. Generate 30 highly relevant hashtags for this topic. Mix popular hashtags (1M+ posts) with medium (100K-1M) and niche ones (under 100K) for best reach. Group them into 3 sets of 10. Format clearly.`,
    hook: `You are a viral content expert. Write 5 scroll-stopping hooks for this topic. Each hook should make someone stop scrolling and want to watch/read more. Use different styles: question, bold statement, controversy, story opener, and shocking fact. Label each clearly.`,
  }

  const placeholders: Record<Tool, string> = {
    caption: 'Describe your post... (e.g. gym selfie after hitting a new PR on bench press)',
    hashtag: 'Enter your niche or post topic... (e.g. fitness motivation, weight loss journey)',
    hook: 'What is your video about... (e.g. how I lost 20 pounds in 3 months with no gym)',
  }

  const generate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult('')
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `${prompts[activeTool]}\n\nTopic/Post: ${input}` }),
    })
    const data = await res.json()
    setResult(data.reply)
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeTool_ = tools.find(t => t.id === activeTool)!

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .tool-card { transition: all 0.2s ease; cursor: pointer; }
        .tool-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .generate-btn { transition: all 0.2s ease; }
        .generate-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(45,90,39,0.3); }
        .result-fade { animation: fadeIn 0.4s ease; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(212,232,194,0.3); border-top: 2px solid #d4e8c2; border-radius: 50%; animation: spin 0.8s linear infinite; display: inline-block; }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27' }}>✦ Clarity</div>
            <div onClick={() => window.location.href = '/'} style={{ fontSize: '13px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>← Dashboard</div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Content Tools ⚡</div>
            <div style={{ fontSize: '15px', color: '#888' }}>AI powered tools built for creators. Pick a tool, describe your content, get results instantly.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}>
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="tool-card"
                onClick={() => { setActiveTool(tool.id as Tool); setResult(''); setInput('') }}
                style={{ backgroundColor: activeTool === tool.id ? tool.color : 'white', border: `2px solid ${activeTool === tool.id ? tool.border : '#e8e4da'}`, borderRadius: '14px', padding: '1.25rem', }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{tool.emoji}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{tool.label}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{tool.desc}</div>
                {activeTool === tool.id && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#2d5a27', fontWeight: '500' }}>● Active</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'white', border: `2px solid ${activeTool_.border}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', transition: 'border-color 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '20px' }}>{activeTool_.emoji}</span>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>{activeTool_.label}</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && generate()}
              placeholder={placeholders[activeTool]}
              rows={3}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#333', resize: 'none', fontFamily: 'sans-serif', backgroundColor: 'transparent', lineHeight: '1.6' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f0ece4' }}>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Press Enter to generate</div>
              <button
                className="generate-btn"
                onClick={generate}
                disabled={loading}
                style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? <><span className="spinner"></span> Generating...</> : 'Generate ✨'}
              </button>
            </div>
          </div>

          {result && (
            <div className="result-fade" style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✨ Your results</div>
                <button
                  onClick={copyToClipboard}
                  style={{ backgroundColor: copied ? '#eaf3de' : 'transparent', border: `1px solid ${copied ? '#c2dba8' : '#d6cfc0'}`, borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', color: copied ? '#2d5a27' : '#888', transition: 'all 0.2s ease' }}
                >
                  {copied ? '✓ Copied!' : '📋 Copy all'}
                </button>
              </div>
              <div
                style={{ fontSize: '14px', color: '#333', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
              <button
                onClick={generate}
                style={{ marginTop: '1.25rem', backgroundColor: 'transparent', border: '1px solid #d6cfc0', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#888' }}
              >
                🔄 Regenerate
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}