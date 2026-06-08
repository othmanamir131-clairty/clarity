'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
  const [streak, setStreak] = useState(0)

  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false }).limit(3)
    if (data) setIdeas(data)
    const { count } = await supabase.from('ideas').select('*', { count: 'exact', head: true })
    if (count !== null) setIdeasCount(count)
    if (count && count > 0) setStreak(Math.min(count, 7))
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else { setUser(data.user); fetchIdeas() }
    })
  }, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    const { data: authData } = await supabase.auth.getUser()
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage, userId: authData?.user?.id }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    setLoading(false)
    if (data.spreadsheet) setSpreadsheetData(data.spreadsheet)
    else setSpreadsheetData(null)
    setTimeout(() => fetchIdeas(), 1500)
  }

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
            transition: left 0.3s ease;
            width: 260px !important;
            box-shadow: 4px 0 40px rgba(0,0,0,0.5);
          }
          .sidebar.open { left: 0 !important; }
          .overlay { display: block; }
          .main  { padding: 1.25rem !important; }
          .mobile-bar { display: flex !important; }
          .stats-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .premium-grid { grid-template-columns: 1fr !important; }
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
          <div className="nav-item"><span style={{ fontSize: '16px' }}>💳</span> Billing</div>
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
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email?.split('@')[0] || 'User'}</div>
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
                {greeting()}, <span style={{ background: 'linear-gradient(135deg, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.email?.split('@')[0] || 'there'}</span> 👋
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

          {/* ── TODAY'S FOCUS ── */}
          <div style={{ ...glass, padding: '2rem 2.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
            {/* inner glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', position: 'relative' }}>
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
              { label: 'Outputs created', value: '0',                  sub: 'Ask AI to create',  icon: '📊', glow: 'rgba(52,211,153,0.3)',  path: '/' },
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
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>AI • Always on</span>
            </div>

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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '12px 16px', backdropFilter: 'blur(10px)' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Dump your ideas, tasks, or goals here... (Shift+Enter for new line)"
                rows={2}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'white', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
              />
              <button className="send-btn" onClick={sendMessage}>
                {loading ? '...' : "Let's go ↑"}
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
