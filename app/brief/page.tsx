'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useProfile } from '../../lib/useProfile'
import UpgradeGate from '../../lib/UpgradeGate'

const BLOB_STYLE: React.CSSProperties = {
  position: 'fixed',
  borderRadius: '50%',
  filter: 'blur(80px)',
  opacity: 0.25,
  pointerEvents: 'none',
  zIndex: 0,
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: '⬡' },
  { label: 'My Ideas', href: '/ideas', icon: '💡' },
  { label: 'Clarity Score', href: '/report', icon: '📊' },
  { label: 'Content Tools', href: '/content', icon: '✦' },
  { label: 'Content Brief', href: '/brief', icon: '📋' },
  { label: 'Post Schedule', href: '/schedule', icon: '📅' },
  { label: 'Video Analysis', href: '/video', icon: '🎬' },
]

const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'Blog']
const TONES = ['Educational', 'Entertaining', 'Inspirational', 'Conversational', 'Professional', 'Humorous']
const FORMATS = ['Long-form video', 'Short-form reel', 'Carousel post', 'Thread', 'Blog article', 'Podcast episode']

interface Brief {
  title: string
  hook: string
  outline: string[]
  cta: string
  keywords: string[]
  estimatedReach: string
  bestPostTime: string
  contentPillars: string[]
}

export default function ContentBrief() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('YouTube')
  const [tone, setTone] = useState('Educational')
  const [format, setFormat] = useState('Long-form video')
  const [audience, setAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [copied, setCopied] = useState(false)
  const [savedBriefs, setSavedBriefs] = useState<{ topic: string; platform: string; brief: Brief }[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')
  const { loading: profileLoading, isPro } = useProfile()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/landing')
      else setUser(data.user)
    })
  }, [router])

  const generateBrief = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setBrief(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Generate a detailed content brief for a content creator. Return ONLY valid JSON with no markdown, no code blocks, just raw JSON.

Topic: ${topic}
Platform: ${platform}
Tone: ${tone}
Format: ${format}
Target audience: ${audience || 'general audience'}

Return this exact JSON structure:
{
  "title": "compelling title for the content",
  "hook": "attention-grabbing opening line or hook",
  "outline": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "cta": "call to action for end of content",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "estimatedReach": "estimated reach potential e.g. High - trending topic",
  "bestPostTime": "best time to post e.g. Tuesday-Thursday 6-8pm",
  "contentPillars": ["pillar1", "pillar2", "pillar3"]
}`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || data.reply || ''
      const cleaned = text.replace(/```json|```/g, '').trim()
      const parsed: Brief = JSON.parse(cleaned)
      setBrief(parsed)
    } catch {
      setBrief({
        title: `${topic}: A Complete Guide for ${platform}`,
        hook: `What if everything you knew about ${topic} was wrong?`,
        outline: [
          'Introduction & why this matters now',
          'The core concept explained simply',
          'Common mistakes to avoid',
          'Step-by-step breakdown',
          'Key takeaways & next steps'
        ],
        cta: `Follow for more ${topic} content and drop your questions below!`,
        keywords: [topic, platform.toLowerCase(), tone.toLowerCase(), 'content', 'creator'],
        estimatedReach: 'Medium — solid niche topic',
        bestPostTime: 'Tuesday–Thursday, 6–8 PM',
        contentPillars: ['Education', 'Engagement', 'Entertainment']
      })
    }
    setLoading(false)
  }

  const saveBrief = () => {
    if (!brief) return
    setSavedBriefs(prev => [{ topic, platform, brief }, ...prev])
  }

  const copyBrief = () => {
    if (!brief) return
    const text = `CONTENT BRIEF: ${brief.title}\n\nHook: ${brief.hook}\n\nOutline:\n${brief.outline.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nCTA: ${brief.cta}\n\nKeywords: ${brief.keywords.join(', ')}\n\nBest Post Time: ${brief.bestPostTime}\n\nEstimated Reach: ${brief.estimatedReach}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const glassMd: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    boxSizing: 'border-box',
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: active ? '1px solid rgba(167,139,250,0.8)' : '1px solid rgba(255,255,255,0.15)',
    background: active ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
    color: active ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%)', zIndex: 0 }} />
      <div style={{ ...BLOB_STYLE, width: 500, height: 500, background: '#7c3aed', top: '-100px', left: '200px' }} />
      <div style={{ ...BLOB_STYLE, width: 400, height: 400, background: '#0d9488', bottom: '0', right: '100px' }} />
      <div style={{ ...BLOB_STYLE, width: 300, height: 300, background: '#4c1d95', top: '40%', left: '40%' }} />

      {/* Sidebar */}
      <aside style={{ ...glassMd, position: 'fixed', left: 0, top: 0, bottom: 0, width: '220px', zIndex: 10, borderRadius: 0, borderLeft: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '32px', paddingLeft: '8px', background: 'linear-gradient(90deg, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ✦ Clarity
        </div>
        {NAV_ITEMS.map(item => {
          const active = item.href === '/brief'
          return (
            <button key={item.href} onClick={() => router.push(item.href)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginBottom: '4px', background: active ? 'rgba(167,139,250,0.2)' : 'transparent', color: active ? '#c4b5fd' : 'rgba(255,255,255,0.6)', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', fontWeight: active ? 600 : 400, textAlign: 'left', width: '100%', transition: 'all 0.2s' }}>
              <span>{item.icon}</span>{item.label}
            </button>
          )
        })}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '0 12px', marginBottom: '8px' }}>{user?.email}</div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/landing') }} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '13px' }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '32px', position: 'relative', zIndex: 1 }}>
        {!profileLoading && !isPro && (
          <UpgradeGate
            title="Pro feature only"
            message="Content briefs are available on Pro. Upgrade to Pro for smarter briefs, better hooks, and quick content structure."
            planLabel="Pro"
          />
        )}
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '28px' }}>📋</span>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#fff' }}>Content Brief</h1>
          </div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Generate a full content brief — hook, outline, keywords, and more.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['generate', 'saved'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', fontWeight: 600, background: activeTab === tab ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)', color: activeTab === tab ? '#c4b5fd' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>
              {tab === 'generate' ? '✦ Generate' : `📁 Saved (${savedBriefs.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'generate' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px' }}>
            {/* Left — Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ ...glassMd, padding: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Topic or Idea</label>
                <input
                  style={inputStyle}
                  placeholder="e.g. How to grow on YouTube in 2025"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateBrief()}
                />
              </div>

              <div style={{ ...glassMd, padding: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>Platform</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PLATFORMS.map(p => <button key={p} onClick={() => setPlatform(p)} style={chipStyle(platform === p)}>{p}</button>)}
                </div>
              </div>

              <div style={{ ...glassMd, padding: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>Tone</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {TONES.map(t => <button key={t} onClick={() => setTone(t)} style={chipStyle(tone === t)}>{t}</button>)}
                </div>
              </div>

              <div style={{ ...glassMd, padding: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>Format</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {FORMATS.map(f => <button key={f} onClick={() => setFormat(f)} style={chipStyle(format === f)}>{f}</button>)}
                </div>
              </div>

              <div style={{ ...glassMd, padding: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>Target Audience <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <input style={inputStyle} placeholder="e.g. beginner content creators aged 18–25" value={audience} onChange={e => setAudience(e.target.value)} />
              </div>

              <button
                onClick={generateBrief}
                disabled={loading || !topic.trim()}
                style={{ padding: '14px', borderRadius: '12px', border: 'none', cursor: topic.trim() ? 'pointer' : 'not-allowed', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', color: '#fff', fontSize: '15px', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', opacity: topic.trim() ? 1 : 0.5, transition: 'all 0.2s' }}
              >
                {loading ? '⟳ Generating brief...' : '✦ Generate Content Brief'}
              </button>
            </div>

            {/* Right — Brief Output */}
            <div>
              {!brief && !loading && (
                <div style={{ ...glassMd, padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'rgba(255,255,255,0.5)' }}>Your brief will appear here</div>
                  <div style={{ fontSize: '13px' }}>Fill in the topic and options on the left, then hit Generate.</div>
                </div>
              )}

              {loading && (
                <div style={{ ...glassMd, padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
                  <div style={{ fontSize: '15px' }}>Building your brief...</div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {brief && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Title & actions */}
                  <div style={{ ...glassMd, padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                      <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{brief.title}</h2>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button onClick={saveBrief} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>💾 Save</button>
                        <button onClick={copyBrief} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', cursor: 'pointer', fontSize: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ ...chipStyle(true), cursor: 'default', fontSize: '12px' }}>{platform}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>{format}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>{tone}</span>
                    </div>
                  </div>

                  {/* Hook */}
                  <div style={{ ...glassMd, padding: '20px', background: 'rgba(124,58,237,0.15)', borderColor: 'rgba(167,139,250,0.3)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>🎣 Hook</div>
                    <p style={{ margin: 0, color: '#fff', fontSize: '15px', lineHeight: 1.6, fontStyle: 'italic' }}>"{brief.hook}"</p>
                  </div>

                  {/* Outline */}
                  <div style={{ ...glassMd, padding: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>📝 Content Outline</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {brief.outline.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#c4b5fd' }}>{i + 1}</span>
                          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.5, paddingTop: '3px' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ ...glassMd, padding: '20px', background: 'rgba(13,148,136,0.12)', borderColor: 'rgba(52,211,153,0.25)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>📣 Call to Action</div>
                    <p style={{ margin: 0, color: '#fff', fontSize: '14px', lineHeight: 1.6 }}>{brief.cta}</p>
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ ...glassMd, padding: '18px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>🔑 Keywords</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {brief.keywords.map(k => <span key={k} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{k}</span>)}
                      </div>
                    </div>
                    <div style={{ ...glassMd, padding: '18px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>📊 Insights</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>⏰ {brief.bestPostTime}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>📈 {brief.estimatedReach}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {brief.contentPillars.map(p => <span key={p} style={{ padding: '3px 8px', borderRadius: '8px', fontSize: '11px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>{p}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedBriefs.length === 0 ? (
              <div style={{ ...glassMd, padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📁</div>
                <div>No saved briefs yet. Generate one and hit Save!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {savedBriefs.map((s, i) => (
                  <div key={i} style={{ ...glassMd, padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '4px' }}>{s.brief.title}</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{s.platform} · {s.topic}</div>
                      </div>
                      <button onClick={() => { setBrief(s.brief); setTopic(s.topic); setPlatform(s.platform); setActiveTab('generate') }} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.1)', color: '#c4b5fd', cursor: 'pointer', fontSize: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>View</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
