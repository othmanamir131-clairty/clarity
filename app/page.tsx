'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<any[]>([])

const [ideasCount, setIdeasCount] = useState(0)

  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false }).limit(3)
    if (data) setIdeas(data)
    const { count } = await supabase.from('ideas').select('*', { count: 'exact', head: true })
    if (count !== null) setIdeasCount(count)
  }
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
if (!data.user) window.location.href = '/landing'     
 else {
        setUser(data.user)
        fetchIdeas()
      }
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
setTimeout(() => fetchIdeas(), 1500)  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app { display: flex; min-height: 100vh; background: #faf8f4; font-family: sans-serif; }
        .sidebar { width: 220px; background: #f5f0e8; border-right: 1px solid #d6cfc0; padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
        .main { flex: 1; padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem; min-width: 0; }
        .mobile-header { display: none; }
        .overlay { display: none; }
        @media (max-width: 768px) {
          .sidebar { position: fixed; left: -240px; top: 0; height: 100vh; z-index: 100; transition: left 0.3s ease; width: 240px; }
          .sidebar.open { left: 0; }
          .main { padding: 1rem; }
          .mobile-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
          .hamburger { background: none; border: none; font-size: 22px; cursor: pointer; color: #2d5a27; }
          .overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="app">
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27', marginBottom: '1.5rem', paddingLeft: '8px' }}>✦ Clarity</div>
          <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Main</p>
          <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#d4e8c2', color: '#2d5a27', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>📊 Dashboard</div>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>💡 My ideas</div>
          <div onClick={() => window.location.href = '/report'} style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>✨ Clarity Score</div>
          <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Outputs</p>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📋 Spreadsheets</div>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📅 Content calendar</div>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📄 Action plans</div>
          <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Premium</p>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#7a5c10', fontSize: '14px', cursor: 'pointer', backgroundColor: '#fdf6e3' }}>🎬 Video analysis</div>
          <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Account</p>
          <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>💳 Billing</div>
<div onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing'; }} style={{ padding: '8px 10px', borderRadius: '8px', color: '#e53e3e', fontSize: '14px', cursor: 'pointer' }}>🚪 Sign out</div>          <div style={{ marginTop: 'auto', borderTop: '1px solid #d6cfc0', paddingTop: '12px' }}>
            <span style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', fontSize: '10px', padding: '3px 8px', borderRadius: '20px' }}>Pro plan</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c2dba8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#2d5a27' }}>{user?.email?.slice(0,2).toUpperCase() || 'ME'}</div>
              <div>
                <div style={{ fontSize: '12px', color: '#333' }}>{user?.email?.split('@')[0] || 'User'}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{user?.email || ''}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="main">
          <div className="mobile-header">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#2d5a27' }}>✦ Clarity</div>
            <div style={{ width: '32px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a' }}>Good morning, <span style={{ color: '#2d5a27' }}>{user?.email?.split('@')[0] || 'there'}</span> 👋</div>
            <div style={{ fontSize: '12px', color: '#888', backgroundColor: '#ede9de', padding: '5px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>June 5 2026</div>
          </div>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
{ label: 'Ideas saved', value: ideasCount.toString(), sub: 'View in my ideas' },              { label: 'Outputs created', value: '0', sub: 'View all outputs' },
              { label: 'Tasks this month', value: '0', sub: 'completed' },
            ].map((stat) => (
              <div key={stat.label} style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#2d5a27', marginTop: '2px' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1.25rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d5a27' }}></div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>What's on your mind?</div>
            </div>
            <div style={{ minHeight: '200px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.length === 0 && (
                <div style={{ color: '#aaa', fontSize: '14px', padding: '1rem 0' }}>Start by dumping your ideas, tasks, or goals below...</div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', backgroundColor: msg.role === 'user' ? '#2d5a27' : '#f5f0e8', color: msg.role === 'user' ? '#d4e8c2' : '#333', lineHeight: '1.6' }}>
                    {msg.role === 'ai' ? (
                      <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '14px', backgroundColor: '#f5f0e8', color: '#888' }}>Thinking...</div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f5f0e8', border: '1px solid #d6cfc0', borderRadius: '8px', padding: '8px 12px' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Dump your ideas, tasks, or goals here... (Shift+Enter for new line)"
                rows={2}
                style={{ flex: 1, fontSize: '14px', border: 'none', background: 'transparent', outline: 'none', color: '#333', resize: 'none', fontFamily: 'sans-serif' }}
              />
              <button onClick={sendMessage} style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-end', whiteSpace: 'nowrap' }}>
                {loading ? '...' : "Let's go ↑"}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {['📋 Make a plan', '📅 Content calendar', '📊 Spreadsheet', '🎬 Analyze a video'].map((chip) => (
                <div key={chip} onClick={() => setInput(chip.split(' ').slice(1).join(' '))} style={{ backgroundColor: chip.includes('🎬') ? '#fdf6e3' : '#ede9de', border: `1px solid ${chip.includes('🎬') ? '#c2a84a' : '#d6cfc0'}`, borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: chip.includes('🎬') ? '#7a5c10' : '#555', cursor: 'pointer' }}>{chip}</div>
              ))}
            </div>
          </div>
          <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>💡 Recent ideas</div>
                <div style={{ fontSize: '12px', color: '#2d5a27', cursor: 'pointer' }}>See all →</div>
              </div>
{ideas.length > 0 ? ideas.map((idea, index) => (
<div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #ede9de' }}>                  <div style={{ fontSize: '12px', color: '#333', marginBottom: '4px' }}>{idea.content}</div>
                  <span style={{ fontSize: '10px', color: '#2d5a27', backgroundColor: '#eaf3de', padding: '2px 8px', borderRadius: '20px' }}>{idea.tag}</span>
                </div>
              )) : (
                <div style={{ fontSize: '12px', color: '#aaa', padding: '8px 0' }}>No ideas yet — start chatting!</div>
              )}
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>📄 Recent outputs</div>
                <div style={{ fontSize: '12px', color: '#2d5a27', cursor: 'pointer' }}>See all →</div>
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', padding: '8px 0' }}>No outputs yet — ask the AI to make a plan!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}