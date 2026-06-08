'use client'

import { useState } from 'react'
import { useProfile } from '../../lib/useProfile'
import UpgradeGate from '../../lib/UpgradeGate'

type Tool = 'caption' | 'hashtag' | 'hook'

export default function Content() {
  const [activeTool, setActiveTool] = useState<Tool>('caption')
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { loading: profileLoading, isPro } = useProfile()

  const tools = [
    { id: 'caption', label: 'Caption Writer', emoji: '✍️', desc: '3 captions in different tones' },
    { id: 'hashtag', label: 'Hashtag Generator', emoji: '#️⃣', desc: '30 hashtags for max reach' },
    { id: 'hook', label: 'Hook Generator', emoji: '🎣', desc: '5 scroll-stopping openers' },
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
          min-height: 100vh;
          color: white;
        }
        @keyframes blob { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .tool-card {
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
        }
        .tool-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .tool-card.active {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .generate-btn {
          background: white; color: #4c1d95;
          border: none; border-radius: 12px;
          padding: 13px 28px; font-size: 15px;
          font-weight: 800; cursor: pointer;
          font-family: inherit; transition: all 0.2s ease;
        }
        .generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,255,255,0.2); }
        .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .copy-btn {
          background: rgba(255,255,255,0.1);
          color: white; border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px; padding: 8px 16px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: inherit; transition: all 0.2s ease;
        }
        .copy-btn:hover { background: rgba(255,255,255,0.18); }
        .copy-btn.copied { background: rgba(52,211,153,0.2); border-color: rgba(52,211,153,0.4); color: #6ee7b7; }

        .text-input {
          width: 100%; border: none; background: transparent;
          outline: none; font-size: 14px; color: white;
          resize: none; font-family: inherit; line-height: 1.6;
        }
        .text-input::placeholder { color: rgba(255,255,255,0.3); }

        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top: 2px solid white; border-radius: 50%; animation: spin 0.8s linear infinite; }

        .back-link {
          font-size: 13px; color: rgba(255,255,255,0.4);
          cursor: pointer; font-weight: 500;
          transition: color 0.2s;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .back-link:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div style={{ minHeight: '100vh', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
        {!profileLoading && !isPro && (
          <UpgradeGate
            title="Pro feature only"
            message="Content tools are reserved for Pro members. Upgrade to craft captions, hashtags, and hooks faster."
            planLabel="Pro"
          />
        )}
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', textShadow: '0 0 30px rgba(167,139,250,0.5)' }}>✦ Clarity</div>
            <span className="back-link" onClick={() => window.location.href = '/'}>← Dashboard</span>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', letterSpacing: '-1px', marginBottom: '8px' }}>Content Tools ⚡</h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>AI powered tools built for creators. Pick a tool, describe your content, get results instantly.</p>
          </div>

          {/* Tool selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '1.5rem' }}>
            {tools.map(tool => (
              <div
                key={tool.id}
                className={`tool-card ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => { setActiveTool(tool.id as Tool); setResult(''); setInput('') }}
              >
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{tool.emoji}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{tool.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{tool.desc}</div>
                {activeTool === tool.id && (
                  <div style={{ marginTop: '10px', fontSize: '11px', color: '#a78bfa', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                    Active
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input box */}
          <div style={{ ...glass, padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <textarea
              className="text-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && generate()}
              placeholder={placeholders[activeTool]}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Press Enter to generate · Shift+Enter for new line</div>
              <button className="generate-btn" onClick={generate} disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner" /> Generating...
                  </span>
                ) : 'Generate ✨'}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div style={{ ...glass, padding: '1.5rem', animation: 'fadeUp 0.4s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✨ Your results</div>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyToClipboard}>
                  {copied ? '✓ Copied!' : '📋 Copy all'}
                </button>
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a78bfa">$1</strong>') }}
              />
              <button
                onClick={generate}
                style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                🔄 Regenerate
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
