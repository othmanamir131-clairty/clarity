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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f8f6ff; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.9); } }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #6b7280;
          cursor: pointer; transition: all 0.15s ease;
        }
        .nav-item:hover { background: #f3f0ff; color: #7c3aed; }
        .nav-item.active { background: #ede9fe; color: #7c3aed; font-weight: 700; }

        .stat-card { transition: all 0.2s ease; cursor: pointer; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(124,58,237,0.12); }

        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 100px;
          border: 1.5px solid #e9d5ff; background: white;
          font-size: 13px; font-weight: 600; color: #6b7280;
          cursor: pointer; transition: all 0.15s ease;
        }
        .chip:hover { border-color: #7c3aed; color: #7c3aed; background: #faf5ff; transform: translateY(-1px); }

        .send-btn {
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white; border: none; border-radius: 100px;
          padding: 11px 24px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .send-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }

        .idea-row { transition: all 0.15s ease; cursor: pointer; border-radius: 10px; padding: 10px 12px; }
        .idea-row:hover { background: #f5f3ff; }

        .tool-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 14px;
          border: 1.5px solid #f3f0ff; background: white;
          cursor: pointer; transition: all 0.2s ease;
        }
        .tool-row:hover { border-color: #c4b5fd; background: #faf5ff; transform: translateX(4px); }

        .premium-card { transition: all 0.25s ease; cursor: pointer; }
        .premium-card:hover { transform: translateY(-4px); }

        .spinner { width: 15px; height: 15px; border: 2px solid rgba(124,58,237,0.2); border-top: 2px solid #7c3aed; border-radius: 50%; animation: spin 0.8s linear infinite; }

        .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; backdrop-filter: blur(6px); }

        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: -280px !important; top: 0; height: 100vh; z-index: 100; transition: left 0.3s ease; width: 260px !important; box-shadow: 4px 0 30px rgba(0,0,0,0.15); }
          .sidebar.open { left: 0 !important; }
          .overlay { display: block; }
          .main { padding: 1.25rem !important; }
          .mobile-bar { display: flex !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
          .premium-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f6ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '240px', background: 'white', borderRight: '1.5px solid #f3f0ff', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>

          <div style={{ paddingLeft: '14px', marginBottom: '2.25rem' }}>
            <div style={{ fontSize: '21px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>✦ Clarity</div>
            <div style={{ fontSize: '11px', color: '#c4b5fd', marginTop: '3px', fontWeight: '500' }}>Get in. Get organized. Get out.</div>
          </div>

          <div style={{ fontSize: '10px', color: '#d8b4fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 14px 8px' }}>Main</div>
          {[
            { icon: '📊', label: 'Dashboard', path: '/', active: true },
            { icon: '💡', label: 'My Ideas', path: '/ideas' },
            { icon: '✨', label: 'Clarity Score', path: '/report' },
            { icon: '⚡', label: 'Content Tools', path: '/content' },
          ].map(item => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => window.location.href = item.path}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ fontSize: '10px', color: '#d8b4fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '6px' }}>Premium</div>
          {[
            { icon: '🎬', label: 'Video Analysis', path: '/video' },
            { icon: '📝', label: 'Content Brief', path: '/brief' },
            { icon: '📅', label: 'Post Schedule', path: '/schedule' },
          ].map(item => (
            <div key={item.label} className="nav-item" onClick={() => window.location.href = item.path} style={{ color: '#7c3aed' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', fontSize: '9px', background: '#ede9fe', color: '#7c3aed', padding: '2px 8px', borderRadius: '100px', fontWeight: '700', border: '1px solid #c4b5fd' }}>PRO</span>
            </div>
          ))}

          <div style={{ fontSize: '10px', color: '#d8b4fe', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '6px' }}>Account</div>
          <div className="nav-item"><span style={{ fontSize: '16px' }}>💳</span> Billing</div>
          <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing' }} style={{ color: '#ef4444' }}>
            <span style={{ fontSize: '16px' }}>🚪</span> Sign out
          </div>

          <div style={{ marginTop: 'auto', padding: '14px', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(13,148,136,0.06))', borderRadius: '14px', border: '1.5px solid #ede9fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
                {user?.email?.slice(0,2).toUpperCase() || 'ME'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '11px', color: '#a78bfa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
              </div>
            </div>
            <div style={{ marginTop: '10px', display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', letterSpacing: '0.04em' }}>FREE PLAN</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main" style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, position: 'relative', overflow: 'hidden' }}>

          {/* Background mesh — same feel as landing page feature section */}
          <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Mobile header */}
          <div className="mobile-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#7c3aed' }}>☰</button>
            <div style={{ fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ Clarity</div>
            <div style={{ width: '32px' }} />
          </div>

          {/* HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1e1b4b', letterSpacing: '-1px', lineHeight: '1.1' }}>
                {greeting()}, <span style={{ background: 'linear-gradient(135deg, #7c3aed, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.email?.split('@')[0] || 'there'}</span> 👋
              </h1>
              <p style={{ fontSize: '14px', color: '#a78bfa', marginTop: '5px', fontWeight: '500' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {streak > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1.5px solid #fde68a', borderRadius: '100px', padding: '7px 16px', flexShrink: 0, boxShadow: '0 2px 8px rgba(251,191,36,0.15)' }}>
                <span>🔥</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>{streak} day streak</span>
              </div>
            )}
          </div>

          {/* TODAY'S FOCUS — dark gradient like the landing page hero */}
          <div style={{
            background: 'linear-gradient(160deg, #3b0764 0%, #4c1d95 40%, #0f766e 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 10s ease infinite',
            borderRadius: '20px', padding: '2rem 2.25rem',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(76,29,149,0.3)'
          }}>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-50px', left: '25%', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', position: 'relative' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 2s ease infinite', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
                  Today's focus
                </div>
                <div style={{ fontSize: '23px', fontWeight: '800', color: 'white', lineHeight: '1.3', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                  {ideas.length > 0
                    ? (ideas[0].content.length > 85 ? ideas[0].content.slice(0, 85) + '...' : ideas[0].content)
                    : 'Start adding ideas to unlock your daily focus.'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>Your most recent idea — make progress on this today 💪</div>
              </div>
              <button
                onClick={() => window.location.href = '/ideas'}
                style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '10px 22px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit', backdropFilter: 'blur(10px)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
                View ideas →
              </button>
            </div>
          </div>

          {/* STATS — same card style as landing page feature cards */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {[
              { label: 'Ideas saved', value: ideasCount.toString(), sub: 'View all →', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: 'rgba(124,58,237,0.2)', accent: '#7c3aed', icon: '💡', path: '/ideas' },
              { label: 'Outputs created', value: '0', sub: 'Ask AI to create', bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: 'rgba(16,185,129,0.2)', accent: '#059669', icon: '📊', path: '/' },
              { label: 'Clarity Score', value: '—', sub: 'Get your score →', bg: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', border: 'rgba(168,85,247,0.2)', accent: '#9333ea', icon: '✨', path: '/report' },
            ].map(stat => (
              <div key={stat.label} className="stat-card" onClick={() => window.location.href = stat.path}
                style={{ background: stat.bg, border: `1.5px solid ${stat.border}`, borderRadius: '18px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '48px', opacity: 0.12 }}>{stat.icon}</div>
                <div style={{ fontSize: '11px', color: stat.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{stat.label}</div>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#1e1b4b', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: stat.accent, fontWeight: '700' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <div style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Quick actions</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { emoji: '📋', label: 'Make a plan', prompt: 'Make me an action plan for ' },
                { emoji: '📅', label: 'Content calendar', prompt: 'Create a content calendar for ' },
                { emoji: '📊', label: 'Spreadsheet', prompt: 'Make me a spreadsheet for ' },
                { emoji: '🎯', label: 'Set goals', prompt: 'Help me set goals for ' },
              ].map(chip => (
                <button key={chip.label} className="chip" onClick={() => setInput(chip.prompt)}>
                  {chip.emoji} {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI BOX */}
          <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '20px', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 24px rgba(124,58,237,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #0d9488)', display: 'inline-block', animation: 'pulse 2s ease infinite', boxShadow: '0 0 10px rgba(124,58,237,0.4)' }} />
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e1b4b' }}>What's on your mind?</span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#c4b5fd', fontWeight: '600', background: '#faf5ff', padding: '3px 10px', borderRadius: '100px', border: '1px solid #e9d5ff' }}>AI • Always on</span>
            </div>

            <div style={{ flex: 1, minHeight: '160px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', marginBottom: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ color: '#d8b4fe', fontSize: '14px', textAlign: 'center', padding: '2rem 0', fontStyle: 'italic' }}>
                  Dump your ideas, tasks, or goals here — the AI organizes everything ✨
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{
                    maxWidth: '82%', padding: '12px 18px', lineHeight: '1.7', fontSize: '14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#f8f6ff',
                    color: msg.role === 'user' ? 'white' : '#374151',
                    border: msg.role === 'user' ? 'none' : '1.5px solid #ede9fe',
                    fontWeight: msg.role === 'user' ? '600' : '400',
                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(124,58,237,0.25)' : 'none',
                  }}>
                    {msg.role === 'ai'
                      ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#7c3aed">$1</strong>') }} />
                      : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: '#f8f6ff', border: '1.5px solid #ede9fe', display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', fontSize: '14px' }}>
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
                  }} style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', border: 'none', borderRadius: '100px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                    📊 Download {spreadsheetData.title}.xlsx
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#f8f6ff', border: '1.5px solid #ede9fe', borderRadius: '14px', padding: '12px 16px' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Dump your ideas, tasks, or goals here... (Shift+Enter for new line)"
                rows={2}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#374151', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
              />
              <button className="send-btn" onClick={sendMessage}>
                {loading ? '...' : "Let's go ↑"}
              </button>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>

            {/* Recent ideas */}
            <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e1b4b' }}>💡 Recent Ideas</span>
                <span onClick={() => window.location.href = '/ideas'} style={{ fontSize: '12px', color: '#7c3aed', cursor: 'pointer', fontWeight: '700' }}>See all →</span>
              </div>
              {ideas.length > 0 ? ideas.map((idea, i) => (
                <div key={i} className="idea-row" onClick={() => window.location.href = '/ideas'}
                  style={{ borderBottom: i < ideas.length - 1 ? '1px solid #f5f3ff' : 'none' }}>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '5px', lineHeight: '1.45' }}>
                    {idea.content.length > 65 ? idea.content.slice(0, 65) + '...' : idea.content}
                  </div>
                  <span style={{ fontSize: '11px', color: '#7c3aed', background: '#ede9fe', padding: '2px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid #c4b5fd' }}>
                    {idea.tag}
                  </span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#d8b4fe', fontSize: '13px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌱</div>
                  No ideas yet — start chatting!
                </div>
              )}
            </div>

            {/* Quick tools */}
            <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1e1b4b', marginBottom: '1.25rem' }}>🛠 Your Tools</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { emoji: '✨', label: 'Clarity Score', desc: 'Weekly AI report on your ideas', path: '/report' },
                  { emoji: '⚡', label: 'Content Tools', desc: 'Captions, hashtags, hooks', path: '/content' },
                  { emoji: '🎬', label: 'Video Analysis', desc: 'Analyze any YouTube video', path: '/video' },
                  { emoji: '💡', label: 'My Ideas', desc: `${ideasCount} saved`, path: '/ideas' },
                ].map(tool => (
                  <div key={tool.label} className="tool-row" onClick={() => window.location.href = tool.path}>
                    <span style={{ fontSize: '20px' }}>{tool.emoji}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e1b4b' }}>{tool.label}</div>
                      <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '1px' }}>{tool.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#c4b5fd', fontSize: '16px' }}>→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PREMIUM CARDS — same gradient card style as landing page */}
          <div className="premium-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
            <div className="premium-card" onClick={() => window.location.href = '/brief'}
              style={{ background: 'linear-gradient(160deg, #3b0764 0%, #4c1d95 60%, #1e3a5f 100%)', borderRadius: '18px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(76,29,149,0.25)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '30px' }}>📝</span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.3px' }}>AI Content Brief</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', marginBottom: '16px' }}>Describe a video idea — get a full production brief with hook, script, thumbnail, and hashtags.</div>
                <div style={{ fontSize: '13px', color: '#a5f3fc', fontWeight: '700' }}>Generate brief →</div>
              </div>
            </div>

            <div className="premium-card" onClick={() => window.location.href = '/schedule'}
              style={{ background: 'linear-gradient(160deg, #064e3b 0%, #065f46 50%, #0f766e 100%)', borderRadius: '18px', padding: '1.75rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(6,78,59,0.25)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '30px' }}>📅</span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '100px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.3px' }}>Posting Schedule</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.6', marginBottom: '16px' }}>AI builds your optimal weekly posting schedule with content ideas for each slot.</div>
                <div style={{ fontSize: '13px', color: '#6ee7b7', fontWeight: '700' }}>Build my schedule →</div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  )
}
