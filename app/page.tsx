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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } }
        @keyframes blob { 0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; } 50% { border-radius: 40% 60% 30% 70% / 60% 40% 70% 50%; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f7ff; }
.mesh-bg { background: #f8f7ff; background-image: radial-gradient(at 20% 20%, rgba(124,58,237,0.12) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(52,211,153,0.1) 0px, transparent 50%), radial-gradient(at 10% 80%, rgba(219,39,119,0.08) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(124,58,237,0.08) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(52,211,153,0.05) 0px, transparent 50%); }.mesh-bg { background: #f8f7ff; background-image: radial-gradient(at 20% 20%, rgba(124,58,237,0.12) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(52,211,153,0.1) 0px, transparent 50%), radial-gradient(at 10% 80%, rgba(219,39,119,0.08) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(124,58,237,0.08) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(52,211,153,0.05) 0px, transparent 50%); }        .nav-item { transition: all 0.15s ease; cursor: pointer; border-radius: 10px; padding: 9px 12px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 500; color: #6b7280; }
        .nav-item:hover { background: rgba(124,58,237,0.06); color: #7c3aed; }
        .nav-item.active { background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(52,211,153,0.08)); color: #7c3aed; font-weight: 700; border-left: 2px solid #7c3aed; }
        .stat-card { transition: all 0.25s ease; cursor: pointer; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(124,58,237,0.15); }
        .chip { transition: all 0.15s ease; cursor: pointer; }
        .chip:hover { transform: translateY(-2px); border-color: #7c3aed !important; color: #7c3aed !important; background: rgba(124,58,237,0.06) !important; }
        .send-btn { transition: all 0.2s ease; }
        .send-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(52,211,153,0.5); }
        .idea-row { transition: all 0.15s ease; cursor: pointer; border-radius: 8px; }
        .idea-row:hover { background: rgba(124,58,237,0.04); }
        .tool-row { transition: all 0.2s ease; cursor: pointer; }
        .tool-row:hover { transform: translateX(5px); }
        .premium-card { transition: all 0.25s ease; cursor: pointer; }
        .premium-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(124,58,237,0.2); border-top: 2px solid #7c3aed; border-radius: 50%; animation: spin 0.8s linear infinite; }
        .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; backdrop-filter: blur(4px); }
        @media (max-width: 768px) {
          .sidebar { position: fixed !important; left: -280px !important; top: 0; height: 100vh; z-index: 100; transition: left 0.3s ease; width: 260px !important; box-shadow: 4px 0 30px rgba(0,0,0,0.15); }
          .sidebar.open { left: 0 !important; }
          .overlay { display: block; }
          .main { padding: 1rem !important; }
          .mobile-bar { display: flex !important; }
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-row { grid-template-columns: 1fr !important; }
          .premium-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="mesh-bg" style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: '245px', backgroundColor: 'white', borderRight: '1px solid #ede9fe', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>

          <div style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(135deg, #7c3aed, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '2rem', paddingLeft: '12px', letterSpacing: '-0.5px' }}>✦ Clarity</div>

          <div style={{ fontSize: '10px', color: '#c4b5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 12px', marginBottom: '6px' }}>Main</div>
          {[
            { icon: '📊', label: 'Dashboard', path: '/', active: true },
            { icon: '💡', label: 'My Ideas', path: '/ideas' },
            { icon: '✨', label: 'Clarity Score', path: '/report' },
            { icon: '⚡', label: 'Content Tools', path: '/content' },
          ].map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => window.location.href = item.path}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}

          <div style={{ fontSize: '10px', color: '#c4b5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 12px 6px', marginTop: '8px' }}>Premium</div>
          {[
            { icon: '🎬', label: 'Video Analysis', path: '/video' },
            { icon: '📝', label: 'Content Brief', path: '/brief' },
            { icon: '📅', label: 'Post Schedule', path: '/schedule' },
          ].map((item) => (
            <div key={item.label} className="nav-item" onClick={() => window.location.href = item.path} style={{ color: '#7c3aed' }}>
              <span>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', fontSize: '9px', background: 'rgba(124,58,237,0.1)', color: '#7c3aed', padding: '2px 7px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(124,58,237,0.2)' }}>PRO</span>
            </div>
          ))}

          <div style={{ fontSize: '10px', color: '#c4b5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 12px 6px', marginTop: '8px' }}>Account</div>
          <div className="nav-item"><span>💳</span> Billing</div>
          <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing' }} style={{ color: '#ef4444' }}><span>🚪</span> Sign out</div>

          <div style={{ marginTop: 'auto', padding: '14px', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(52,211,153,0.06))', borderRadius: '14px', border: '1px solid #ede9fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0 }}>{user?.email?.slice(0,2).toUpperCase() || 'ME'}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</div>
              </div>
            </div>
            <div style={{ marginTop: '10px', display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #34d399)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>FREE PLAN</div>
          </div>
        </div>

        {/* Main */}
        <div className="main" style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0, position: 'relative', overflow: 'hidden' }}>

          {/* Background blobs */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none', animation: 'blob 15s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Mobile header */}
          <div className="mobile-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#7c3aed' }}>☰</button>
            <div style={{ fontSize: '18px', fontWeight: '900', background: 'linear-gradient(135deg, #7c3aed, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦ Clarity</div>
            <div style={{ width: '32px' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '30px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                {greeting()}, <span style={{ background: 'linear-gradient(135deg, #7c3aed, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.email?.split('@')[0] || 'there'}</span> 👋
              </div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>What are we building today?</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '20px', padding: '6px 14px' }}>
                  <span>🔥</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>{streak} day streak</span>
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#9ca3af', background: 'white', border: '1px solid #ede9fe', padding: '6px 14px', borderRadius: '20px', fontWeight: '600' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Daily Focus */}
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6, #34d399)', borderRadius: '22px', padding: '1.75rem 2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(124,58,237,0.3)' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '180px', height: '180px', background: 'rgba(52,211,153,0.15)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', position: 'relative' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block', animation: 'pulse 2s ease infinite', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}></span>
                  🎯 Today's Focus
                </div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', lineHeight: '1.3', marginBottom: '10px' }}>
                  {ideas.length > 0 ? (ideas[0].content.length > 80 ? ideas[0].content.slice(0, 80) + '...' : ideas[0].content) : 'Start adding ideas to get your daily focus!'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' }}>Your most recent idea — make progress on this today 💪</div>
              </div>
              <div onClick={() => window.location.href = '/ideas'} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0, backdropFilter: 'blur(10px)' }}>
                View ideas →
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Ideas saved', value: ideasCount.toString(), sub: 'View all →', icon: '💡', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', border: '#c4b5fd', accent: '#7c3aed', path: '/ideas' },
              { label: 'Outputs created', value: '0', sub: 'Ask AI to create', icon: '📊', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '#6ee7b7', accent: '#059669', path: '/' },
              { label: 'Clarity Score', value: '—', sub: 'Get your score →', icon: '✨', bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)', border: '#f9a8d4', accent: '#db2777', path: '/report' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" onClick={() => window.location.href = stat.path} style={{ background: stat.bg, border: `1.5px solid ${stat.border}`, borderRadius: '18px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '52px', opacity: 0.12 }}>{stat.icon}</div>
                <div style={{ fontSize: '11px', color: stat.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', opacity: 0.8 }}>{stat.label}</div>
                <div style={{ fontSize: '40px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '-1.5px', marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: stat.accent, fontWeight: '700' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ fontSize: '11px', color: '#c4b5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', width: '100%' }}>Quick actions</div>
            {[
              { emoji: '📋', label: 'Make a plan', prompt: 'Make me an action plan for ' },
              { emoji: '📅', label: 'Content calendar', prompt: 'Create a content calendar for ' },
              { emoji: '📊', label: 'Spreadsheet', prompt: 'Make me a spreadsheet for ' },
              { emoji: '🎯', label: 'Set goals', prompt: 'Help me set goals for ' },
            ].map((chip) => (
              <div key={chip.label} className="chip" onClick={() => setInput(chip.prompt)} style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', color: '#6b7280', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(124,58,237,0.06)' }}>
                {chip.emoji} {chip.label}
              </div>
            ))}
          </div>

          {/* AI Box */}
          <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '22px', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 24px rgba(124,58,237,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', animation: 'pulse 2s ease infinite', boxShadow: '0 0 10px rgba(124,58,237,0.4)' }}></div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>What's on your mind?</div>
              <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#c4b5fd', fontWeight: '600', background: 'rgba(124,58,237,0.06)', padding: '3px 10px', borderRadius: '20px', border: '1px solid #ede9fe' }}>AI • Always on</div>
            </div>

            <div style={{ flex: 1, minHeight: '180px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              {messages.length === 0 && (
                <div style={{ color: '#d1d5db', fontSize: '14px', padding: '2rem 0', textAlign: 'center', fontStyle: 'italic' }}>
                  Dump your ideas, tasks, or goals here — the AI organizes everything ✨
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{ maxWidth: '82%', padding: '12px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', background: msg.role === 'user' ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : '#f8f7ff', color: msg.role === 'user' ? 'white' : '#374151', lineHeight: '1.7', fontWeight: msg.role === 'user' ? '600' : '400', border: msg.role === 'user' ? 'none' : '1px solid #ede9fe', boxShadow: msg.role === 'user' ? '0 4px 16px rgba(124,58,237,0.3)' : 'none' }}>
                    {msg.role === 'ai' ? (
                      <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:#7c3aed">$1</strong>') }} />
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 18px', borderRadius: '18px 18px 18px 4px', background: '#f8f7ff', border: '1px solid #ede9fe', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                    <div className="spinner"></div> Thinking...
                  </div>
                </div>
              )}
              {spreadsheetData && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button onClick={() => { const ws = XLSX.utils.aoa_to_sheet([spreadsheetData.headers, ...spreadsheetData.rows]); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); XLSX.writeFile(wb, `${spreadsheetData.title}.xlsx`) }} style={{ background: 'linear-gradient(135deg, #34d399, #059669)', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 22px', fontSize: '14px', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(52,211,153,0.4)' }}>
                    📊 Download {spreadsheetData.title}.xlsx
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', background: '#f8f7ff', border: '1.5px solid #ede9fe', borderRadius: '16px', padding: '12px 16px' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Dump your ideas, tasks, or goals here... (Shift+Enter for new line)"
                rows={2}
                style={{ flex: 1, fontSize: '14px', border: 'none', background: 'transparent', outline: 'none', color: '#374151', resize: 'none', fontFamily: 'inherit', lineHeight: '1.5' }}
              />
              <button className="send-btn" onClick={sendMessage} style={{ background: 'linear-gradient(135deg, #34d399, #059669)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '800', alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
                {loading ? '...' : "Let's go ↑"}
              </button>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="bottom-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>

            <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e' }}>💡 Recent Ideas</div>
                <div onClick={() => window.location.href = '/ideas'} style={{ fontSize: '12px', color: '#7c3aed', cursor: 'pointer', fontWeight: '700' }}>See all →</div>
              </div>
              {ideas.length > 0 ? ideas.map((idea, index) => (
                <div key={index} className="idea-row" onClick={() => window.location.href = '/ideas'} style={{ padding: '10px 8px', borderBottom: index < ideas.length - 1 ? '1px solid #f5f3ff' : 'none' }}>
                  <div style={{ fontSize: '13px', color: '#374151', marginBottom: '5px', lineHeight: '1.5', fontWeight: '500' }}>{idea.content.length > 60 ? idea.content.slice(0, 60) + '...' : idea.content}</div>
                  <span style={{ fontSize: '10px', color: '#7c3aed', background: 'rgba(124,58,237,0.08)', padding: '2px 10px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(124,58,237,0.15)' }}>{idea.tag}</span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#d1d5db', fontSize: '13px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌱</div>
                  No ideas yet — start chatting!
                </div>
              )}
            </div>

            <div style={{ background: 'white', border: '1.5px solid #ede9fe', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(124,58,237,0.06)' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', marginBottom: '1rem' }}>🛠 Quick Tools</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { emoji: '✨', label: 'Clarity Score', desc: 'Weekly AI report on your ideas', path: '/report', border: '#c4b5fd', accent: '#7c3aed', bg: 'rgba(124,58,237,0.04)' },
                  { emoji: '⚡', label: 'Content Tools', desc: 'Captions, hashtags, hooks', path: '/content', border: '#6ee7b7', accent: '#059669', bg: 'rgba(52,211,153,0.04)' },
                  { emoji: '🎬', label: 'Video Analysis', desc: 'Analyze any YouTube video', path: '/video', border: '#f9a8d4', accent: '#db2777', bg: 'rgba(219,39,119,0.04)' },
                ].map((tool) => (
                  <div key={tool.label} className="tool-row" onClick={() => window.location.href = tool.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: tool.bg, border: `1.5px solid ${tool.border}`, borderRadius: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{tool.emoji}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e' }}>{tool.label}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{tool.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: tool.accent, fontSize: '18px', fontWeight: '700' }}>→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium cards */}
          <div className="premium-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>

            <div className="premium-card" onClick={() => window.location.href = '/brief'} style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', borderRadius: '18px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(124,58,237,0.25)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '32px' }}>📝</span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>AI Content Brief</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', marginBottom: '14px' }}>Describe a video idea — get a full production brief with hook, script, thumbnail, CTA, and hashtags.</div>
                <div style={{ fontSize: '13px', color: '#a5f3fc', fontWeight: '700' }}>Generate brief →</div>
              </div>
            </div>

            <div className="premium-card" onClick={() => window.location.href = '/schedule'} style={{ background: 'linear-gradient(135deg, #059669, #34d399)', borderRadius: '18px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(52,211,153,0.25)' }}>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '160px', height: '160px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '32px' }}>📅</span>
                  <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.2)' }}>PRO</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>Posting Schedule</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', marginBottom: '14px' }}>AI builds your optimal weekly posting schedule with content ideas for each slot based on your niche.</div>
                <div style={{ fontSize: '13px', color: '#fef9c3', fontWeight: '700' }}>Build my schedule →</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}