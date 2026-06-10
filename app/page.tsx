'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { isUserOnboarded } from '../lib/onboarding'
import { countUserIdeas, fetchUserIdeas } from '../lib/ideas'
import { countOutputs, fetchOutputs } from '../lib/outputs'
import { FREE_DAILY_AI_LIMIT, type AiUsageStats } from '../lib/aiLimits'
import * as XLSX from 'xlsx'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<any[]>([])
  const [ideasCount, setIdeasCount] = useState(0)
  const [spreadsheetData, setSpreadsheetData] = useState<any>(null)
  const [outputsCount, setOutputsCount] = useState(0)
  const [recentSpreadsheets, setRecentSpreadsheets] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [aiUsage, setAiUsage] = useState<AiUsageStats | null>(null)

  const downloadSpreadsheet = (sheet: { title: string; payload: { headers: string[]; rows: string[][] } }) => {
    const ws = XLSX.utils.aoa_to_sheet([sheet.payload.headers, ...sheet.payload.rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${sheet.title || 'spreadsheet'}.xlsx`)
  }

  const fetchAiUsage = async () => {
    const res = await fetch('/api/ai-usage')
    if (res.ok) setAiUsage(await res.json())
  }

  const fetchIdeas = async () => {
    const data = await fetchUserIdeas(3)
    setIdeas(data)
    const count = await countUserIdeas()
    setIdeasCount(count)
    if (count > 0) setStreak(Math.min(count, 7))

    const outputTotal = await countOutputs()
    setOutputsCount(outputTotal)
    const sheets = await fetchOutputs('spreadsheet', 3)
    setRecentSpreadsheets(sheets)
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = '/landing'
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded, display_name')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!isUserOnboarded(data.user, profile)) {
        window.location.href = '/onboarding'
        return
      }

      setUser(data.user)
      setDisplayName(
        profile?.display_name ||
          (data.user.user_metadata?.display_name as string | undefined) ||
          data.user.email?.split('@')[0] ||
          'there'
      )
      await Promise.all([fetchIdeas(), fetchAiUsage()])
    })
  }, [])

  useEffect(() => {
    setIsNewUser(ideasCount === 0)
  }, [ideasCount])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (aiUsage && !aiUsage.unlimited && aiUsage.used >= FREE_DAILY_AI_LIMIT) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    })
    const data = await res.json()

    if (data.usage) setAiUsage(data.usage)
    else await fetchAiUsage()

    if (res.status === 429 || data.error === 'daily_limit') {
      setMessages(prev => prev.slice(0, -1))
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
      }
      setLoading(false)
      return
    }

    if (data.reply) {
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    }

    setLoading(false)
    if (data.spreadsheet) setSpreadsheetData(data.spreadsheet)
    else setSpreadsheetData(null)
    setTimeout(() => fetchIdeas(), 1500)
  }

  const aiAtLimit = Boolean(
    aiUsage && !aiUsage.unlimited && aiUsage.used >= FREE_DAILY_AI_LIMIT
  )

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Glass card style — reused everywhere
  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '20px',
  } as React.CSSProperties

  const glassDark = {
    background: 'rgba(0,0,0,0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
  } as React.CSSProperties

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Full page gradient — same DNA as landing hero */
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-attachment: fixed;
          min-height: 100vh;
          color: white;
        }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob    { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* Sidebar nav items */
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          cursor: pointer; transition: all 0.18s ease;
        }
        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }
        .nav-item.active {
          background: rgba(255,255,255,0.15);
          color: white;
          font-weight: 700;
        }

        /* Stat cards */
        .stat-card {
          transition: all 0.22s ease;
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.14) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }

        /* Quick action chips */
        .chip {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 100px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.8);
          cursor: pointer; transition: all 0.18s ease;
          white-space: nowrap;
        }
        .chip:hover {
          background: rgba(255,255,255,0.2);
          color: white;
          transform: translateY(-2px);
        }

        /* Send button */
        .send-btn {
          background: white;
          color: #4c1d95;
          border: none; border-radius: 100px;
          padding: 11px 24px;
          font-size: 13px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .send-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255,255,255,0.25);
        }

        /* Idea rows */
        .idea-row {
          padding: 10px 12px; border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .idea-row:hover { background: rgba(255,255,255,0.08); }

        /* Tool rows */
        .tool-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 14px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer; transition: all 0.18s ease;
        }
        .tool-row:hover {
          background: rgba(255,255,255,0.14);
          transform: translateX(4px);
          border-color: rgba(255,255,255,0.2);
        }

        /* Premium cards */
        .premium-card {
          transition: all 0.22s ease;
          cursor: pointer;
        }
        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Mobile overlay */
        .overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 99;
          backdrop-filter: blur(8px);
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed !important;
            left: -280px !important;
            top: 0; height: 100vh; z-index: 100;
            transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            width: 260px !important;
            box-shadow: 4px 0 40px rgba(0,0,0,0.5);
          }
          .sidebar.open { left: 0 !important; }
          .overlay { display: block; }
          .main {
            padding: 1rem !important;
            gap: 1rem !important;
          }
          .mobile-bar {
            display: flex !important;
            padding: 0 0.5rem 1rem;
            margin: 0 -1rem 0 -1rem;
            padding: 1rem 1rem 0.5rem 1rem;
          }
          .stats-grid {
            grid-template-columns: repeat(2,1fr) !important;
            gap: 10px !important;
          }
          .stats-grid > div {
            padding: 1rem !important;
          }
          .stats-grid h1 {
            font-size: 24px !important;
          }
          .stats-grid > div > div:nth-child(3) {
            font-size: 32px !important;
          }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .premium-grid { grid-template-columns: 1fr !important; }
          .chip {
            font-size: 12px !important;
            padding: 7px 14px !important;
          }
          .send-btn {
            padding: 10px 18px !important;
            font-size: 12px !important;
            width: 100%;
            margin-top: 0.75rem;
          }
          h1 { font-size: 24px !important; line-height: 1.2 !important; }
          h2 { font-size: 20px !important; }
          p { font-size: 13px !important; }
        }

        @media (max-width: 430px) {
          .main {
            padding: 0.75rem !important;
            gap: 0.75rem !important;
          }
          .focus-inner {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .focus-inner button {
            width: 100% !important;
            text-align: center !important;
          }
          .input-row {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: stretch !important;
          }
          .send-btn {
            width: 100% !important;
            margin-top: 0 !important;
            text-align: center !important;
          }
          .stats-grid {
            gap: 8px !important;
          }
          .stats-grid > div {
            padding: 0.875rem !important;
          }
        }
      `}</style>

      {/* Ambient blobs — depth behind everything */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* ── SIDEBAR ── */}
        <aside
          className={`sidebar ${sidebarOpen ? 'open' : ''}`}
          style={{ width: '240px', ...glassDark, borderRadius: 0, borderRight: '1px solid rgba(255,255,255,0.1)', padding: '1.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}
        >
          {/* Logo */}
          <div style={{ paddingLeft: '14px', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', textShadow: '0 0 30px rgba(167,139,250,0.6)' }}>✦ Clarity</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px', fontWeight: '500' }}>Get in. Get organized. Get out.</div>
          </div>

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 14px 8px' }}>Main</div>
          {[
            { icon: '📊', label: 'Dashboard', path: '/', active: true },
            { icon: '💡', label: 'My Ideas',    path: '/ideas' },
            { icon: '✨', label: 'Clarity Score', path: '/report' },
            { icon: '⚡', label: 'Content Tools', path: '/content' },
          ].map(item => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => window.location.href = item.path}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '8px' }}>Premium</div>
          {[
            { icon: '🎬', label: 'Video Analysis', path: '/video' },
            { icon: '📝', label: 'Content Brief',  path: '/brief' },
            { icon: '📅', label: 'Post Schedule',  path: '/schedule' },
          ].map(item => (
            <div key={item.label} className="nav-item" onClick={() => window.location.href = item.path}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(167,139,250,0.25)', color: '#c4b5fd', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(167,139,250,0.3)' }}>PRO</span>
            </div>
          ))}

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '8px' }}>Account</div>
          <div className="nav-item" onClick={() => window.location.href = '/pricing'}><span style={{ fontSize: '16px' }}>💳</span> Upgrade</div>
          <div className="nav-item" onClick={() => window.location.href = '/updates'}><span style={{ fontSize: '16px' }}>✨</span> What&apos;s new</div>
          <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing' }} style={{ color: '#fca5a5' }}>
            <span style={{ fontSize: '16px' }}>🚪</span> Sign out
          </div>

          {/* User card */}
          <div
            onClick={() => window.location.href = '/settings'}
            style={{ marginTop: 'auto', padding: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', transition: 'all 0.18s ease' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.13)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0, boxShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
                {user?.email?.slice(0,2).toUpperCase() || 'ME'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName || user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
              </div>
            </div>
            <div style={{ marginTop: '10px', display: 'inline-block', background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', border: '1px solid rgba(167,139,250,0.3)', letterSpacing: '0.04em' }}>FREE PLAN</div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main" style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

          {/* Mobile header */}
          <div className="mobile-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'white' }}>☰</button>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>✦ Clarity</div>
            <div style={{ width: '32px' }} />
          </div>

          {/* ── HEADER ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '34px', fontWeight: '800', color: 'white', letterSpacing: '-1px', lineHeight: '1.1', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                {greeting()}, <span style={{ background: 'linear-gradient(135deg, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{displayName || user?.email?.split('@')[0] || 'there'}</span> 👋
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: '500' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {streak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', ...glass, padding: '8px 16px', flexShrink: 0 }}>
                <span>🔥</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fcd34d' }}>{streak} day streak</span>
              </div>
            )}
          </div>

          {isNewUser && (
            <div style={{ ...glass, padding: '1.5rem 1.75rem', border: '1px solid rgba(167,139,250,0.25)', boxShadow: '0 8px 32px rgba(124,58,237,0.2)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Welcome to Clarity</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Your workspace is ready — start with your first brain dump</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '14px' }}>
                Type anything below — ideas, tasks, content plans — and Clarity will organize it for you.
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Make me a content calendar', 'Help me plan my next video', 'Organize my ideas'].map(prompt => (
                  <button key={prompt} className="chip" onClick={() => setInput(prompt)} style={{ cursor: 'pointer' }}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── TODAY'S FOCUS ── */}
          <div style={{ ...glass, padding: '2rem 2.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
            {/* inner glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div className="focus-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', position: 'relative' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s ease infinite', boxShadow: '0 0 10px rgba(52,211,153,0.8)' }} />
                  Today's focus
                </div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', lineHeight: '1.3', letterSpacing: '-0.5px', marginBottom: '12px', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
                  {ideas.length > 0
                    ? (ideas[0].content.length > 85 ? ideas[0].content.slice(0, 85) + '...' : ideas[0].content)
                    : 'Start adding ideas to unlock your daily focus.'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>Your most recent idea — make progress on this today 💪</div>
              </div>
              <button
                onClick={() => window.location.href = '/ideas'}
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '100px', padding: '10px 22px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
                View ideas →
              </button>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {[
              { label: 'Ideas saved',    value: ideasCount.toString(), sub: 'View all →',        icon: '💡', glow: 'rgba(167,139,250,0.3)', path: '/ideas' },
              { label: 'Outputs created', value: outputsCount.toString(), sub: outputsCount > 0 ? 'View below ↓' : 'Ask AI to create', icon: '📊', glow: 'rgba(52,211,153,0.3)', path: '/' },
              { label: 'Clarity Score',  value: '—',                   sub: 'Get your score →',  icon: '✨', glow: 'rgba(251,191,36,0.3)',  path: '/report' },
            ].map(stat => (
              <div key={stat.label} className="stat-card" onClick={() => window.location.href = stat.path}
                style={{ ...glass, padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: `0 4px 24px ${stat.glow}` }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '52px', opacity: 0.15 }}>{stat.icon}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{stat.label}</div>
                <div style={{ fontSize: '44px', fontWeight: '800', color: 'white', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px', textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: '700' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Quick actions</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { emoji: '📋', label: 'Make a plan',       prompt: 'Make me an action plan for ' },
                { emoji: '📅', label: 'Content calendar',  prompt: 'Create a content calendar for ' },
                { emoji: '📊', label: 'Spreadsheet',       prompt: 'Make me a spreadsheet for ' },
                { emoji: '🎯', label: 'Set goals',         prompt: 'Help me set goals for ' },
              ].map(chip => (
                <button key={chip.label} className="chip" onClick={() => setInput(chip.prompt)}>
                  {chip.emoji} {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── AI BOX ── */}
          <div style={{ ...glass, padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s ease infinite', boxShadow: '0 0 12px rgba(52,211,153,0.8)' }} />
              <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>What's on your mind?</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: aiAtLimit ? '#fca5a5' : 'rgba(255,255,255,0.45)', fontWeight: '600', background: aiAtLimit ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '100px', border: `1px solid ${aiAtLimit ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)'}` }}>
                {aiUsage?.unlimited
                  ? aiUsage.plan === 'premium' ? '✦ Unlimited AI · Priority' : '✦ Unlimited AI'
                  : aiUsage
                    ? `${aiUsage.used} / ${aiUsage.limit} used today`
                    : 'AI • Loading...'}
              </span>
            </div>

            {aiAtLimit && (
              <div style={{ marginBottom: '1rem', padding: '14px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55 }}>
                <div style={{ marginBottom: '10px' }}>
                  Daily limit reached. Free plan includes {FREE_DAILY_AI_LIMIT} AI messages per day. Resets tomorrow.
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)', border: 'none', borderRadius: '999px', color: 'white', fontSize: '13px', fontWeight: 700, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Upgrade to Pro
                  </button>
                  <button
                    onClick={() => { setMessages([]); setInput('') }}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* messages */}
            <div style={{ flex: 1, minHeight: '160px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic' }}>
                  Dump your ideas, tasks, or goals here — the AI organizes everything ✨
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{
                    maxWidth: '82%', padding: '12px 18px', lineHeight: '1.7', fontSize: '14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)',
                    color: msg.role === 'user' ? '#4c1d95' : 'rgba(255,255,255,0.9)',
                    fontWeight: msg.role === 'user' ? '700' : '400',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: msg.role === 'user' ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                    backdropFilter: 'blur(10px)',
                  }}>
                    {msg.role === 'ai'
                      ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#a78bfa">$1</strong>') }} />
                      : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', backdropFilter: 'blur(10px)' }}>
                    <div className="spinner" /> Thinking...
                  </div>
                </div>
              )}
              {spreadsheetData && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button onClick={() => {
                    const ws = XLSX.utils.aoa_to_sheet([spreadsheetData.headers, ...spreadsheetData.rows])
                    const wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
                    XLSX.writeFile(wb, `${spreadsheetData.title}.xlsx`)
                  }} style={{ background: 'rgba(255,255,255,0.9)', color: '#4c1d95', border: 'none', borderRadius: '100px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '800', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                    📊 Download {spreadsheetData.title}.xlsx
                  </button>
                </div>
              )}
            </div>

            {/* input row */}
            <div className="input-row" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 16px', backdropFilter: 'blur(10px)' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !aiAtLimit && sendMessage()}
                placeholder={aiAtLimit ? 'Daily limit reached — upgrade or try again tomorrow' : 'Dump your ideas, tasks, or goals here... (Shift+Enter for new line)'}
                rows={2}
                disabled={aiAtLimit}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'white', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5', opacity: aiAtLimit ? 0.5 : 1 }}
              />
              <button className="send-btn" onClick={sendMessage} disabled={loading || aiAtLimit}>
                {loading ? '...' : aiAtLimit ? 'Limit reached' : "Let's go ↑"}
              </button>
            </div>
          </div>

          {/* ── BOTTOM GRID ── */}
          <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>

            {/* Recent ideas */}
            <div style={{ ...glass, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>💡 Recent Ideas</span>
                <span onClick={() => window.location.href = '/ideas'} style={{ fontSize: '12px', color: '#a78bfa', cursor: 'pointer', fontWeight: '700' }}>See all →</span>
              </div>
              {ideas.length > 0 ? ideas.map((idea, i) => (
                <div key={i} className="idea-row" onClick={() => window.location.href = '/ideas'}
                  style={{ borderBottom: i < ideas.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: '5px', lineHeight: '1.45' }}>
                    {idea.content.length > 65 ? idea.content.slice(0, 65) + '...' : idea.content}
                  </div>
                  <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '2px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(167,139,250,0.25)' }}>
                    {idea.tag}
                  </span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌱</div>
                  No ideas yet — start chatting!
                </div>
              )}
            </div>

            {/* Quick tools */}
            <div style={{ ...glass, padding: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '1.25rem' }}>🛠 Your Tools</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { emoji: '✨', label: 'Clarity Score',  desc: 'Weekly AI report on your ideas', path: '/report' },
                  { emoji: '⚡', label: 'Content Tools',  desc: 'Captions, hashtags, hooks',       path: '/content' },
                  { emoji: '🎬', label: 'Video Analysis', desc: 'Analyze any YouTube video',       path: '/video' },
                  { emoji: '💡', label: 'My Ideas',       desc: `${ideasCount} ideas saved`,       path: '/ideas' },
                ].map(tool => (
                  <div key={tool.label} className="tool-row" onClick={() => window.location.href = tool.path}>
                    <span style={{ fontSize: '20px' }}>{tool.emoji}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{tool.label}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{tool.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {recentSpreadsheets.length > 0 && (
            <div style={{ ...glass, padding: '1.5rem', boxShadow: '0 4px 24px rgba(52,211,153,0.15)' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '1rem' }}>📊 Your Spreadsheets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentSpreadsheets.map(sheet => (
                  <div key={sheet.id} className="tool-row" onClick={() => downloadSpreadsheet(sheet)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '20px' }}>📊</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{sheet.title || 'Spreadsheet'}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                        {new Date(sheet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '700' }}>Download →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PREMIUM CARDS ── */}
          <div className="premium-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>

            <div className="premium-card" onClick={() => window.location.href = '/brief'}
              style={{ ...glass, padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(167,139,250,0.2)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '30px' }}>📝</span>
                  <span style={{ fontSize: '10px', background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', padding: '3px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(167,139,250,0.3)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>AI Content Brief</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.65', marginBottom: '16px' }}>Describe a video idea — get a full production brief with hook, script, thumbnail, and hashtags.</div>
                <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: '700' }}>Generate brief →</div>
              </div>
            </div>

            <div className="premium-card" onClick={() => window.location.href = '/schedule'}
              style={{ ...glass, padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(52,211,153,0.15)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '30px' }}>📅</span>
                  <span style={{ fontSize: '10px', background: 'rgba(52,211,153,0.15)', color: '#6ee7b7', padding: '3px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(52,211,153,0.25)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Posting Schedule</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.65', marginBottom: '16px' }}>AI builds your optimal weekly posting schedule with content ideas for each slot.</div>
                <div style={{ fontSize: '13px', color: '#34d399', fontWeight: '700' }}>Build my schedule →</div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
