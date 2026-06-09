'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useProfile } from '../../lib/useProfile'
import UpgradeGate from '../../lib/UpgradeGate'

const PLATFORMS = [
  { name: 'YouTube',   icon: '▶️', color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.3)' },
  { name: 'Instagram', icon: '📸', color: '#f0abfc', bg: 'rgba(240,171,252,0.15)', border: 'rgba(240,171,252,0.3)' },
  { name: 'TikTok',    icon: '🎵', color: '#5eead4', bg: 'rgba(94,234,212,0.15)',  border: 'rgba(94,234,212,0.3)'  },
  { name: 'Twitter/X', icon: '𝕏',  color: '#7dd3fc', bg: 'rgba(125,211,252,0.15)', border: 'rgba(125,211,252,0.3)' },
  { name: 'LinkedIn',  icon: '💼', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)',  border: 'rgba(96,165,250,0.3)'  },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const getWeekDates = () => {
  const now = new Date()
  const dow = now.getDay()
  const diffToMonday = dow === 0 ? -6 : 1 - dow
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function Schedule() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ day: 0, platform: PLATFORMS[0].name, title: '', time: '09:00', notes: '' })
  const { loading: profileLoading, isPro } = useProfile()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else setUser(data.user)
    })
  }, [])

  const weekDates = getWeekDates()
  const rangeLabel = `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  const platformInfo = (name: string) => PLATFORMS.find(p => p.name === name) || PLATFORMS[0]

  const openFormForDay = (day: number) => {
    setForm(f => ({ ...f, day }))
    setShowForm(true)
  }

  const addPost = () => {
    if (!form.title.trim()) return
    setPosts(prev => [...prev, { id: Date.now() + Math.random(), ...form }])
    setForm({ day: 0, platform: PLATFORMS[0].name, title: '', time: '09:00', notes: '' })
    setShowForm(false)
  }

  const removePost = (id: number) => setPosts(prev => prev.filter(p => p.id !== id))

  const glass = {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
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
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-attachment: fixed;
          min-height: 100vh; color: white;
        }

        @keyframes blob   { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px; border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          cursor: pointer; transition: all 0.18s ease;
        }
        .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: rgba(255,255,255,0.15); color: white; font-weight: 700; }

        .overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 99;
          backdrop-filter: blur(8px);
        }

        .add-btn {
          background: white; color: #4c1d95;
          border: none; border-radius: 100px;
          padding: 12px 26px; font-size: 14px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,255,255,0.2); }

        .cancel-btn {
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 100px;
          padding: 12px 22px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
        }
        .cancel-btn:hover { background: rgba(255,255,255,0.14); color: white; }

        .form-input {
          width: 100%; padding: 11px 14px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          font-size: 13px; outline: none; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-input:focus { border-color: rgba(167,139,250,0.5); background: rgba(255,255,255,0.1); }

        .field-label {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px;
        }

        .post-card { position: relative; border-radius: 10px; padding: 8px 10px; transition: all 0.15s ease; }
        .post-card:hover { transform: scale(1.03); filter: brightness(1.15); }
        .post-remove {
          position: absolute; top: 4px; right: 4px;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; color: rgba(255,255,255,0.6);
          background: rgba(0,0,0,0.35);
          opacity: 0; transition: all 0.15s ease; cursor: pointer;
        }
        .post-card:hover .post-remove { opacity: 1; }
        .post-remove:hover { color: white; background: rgba(248,113,113,0.7); }

        .add-day-btn {
          text-align: center; font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.3); padding: 8px; border-radius: 10px;
          border: 1px dashed rgba(255,255,255,0.15);
          cursor: pointer; transition: all 0.15s ease;
        }
        .add-day-btn:hover { color: #c4b5fd; border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.08); }

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
          .main {
            padding: 1.25rem !important;
          }
          .mobile-bar { display: flex !important; }
          .cal-grid { grid-template-columns: 1fr !important; }
          .day-card { padding: 0.75rem !important; min-height: auto !important; }
          .post-card { padding: 0.75rem !important; font-size: 12px !important; }
        }
        @media (max-width: 480px) {
          .main { padding: 0.75rem !important; }
          .day-card { padding: 0.5rem !important; }
          .post-card { padding: 0.5rem !important; font-size: 11px !important; }
          .add-day-btn { font-size: 10px !important; padding: 6px !important; }
        }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {!profileLoading && !isPro && (
          <UpgradeGate
            title="Pro feature only"
            message="Post scheduling is a Pro feature. Upgrade to Pro to plan your content calendar with AI-powered pacing."
            planLabel="Pro"
          />
        )}

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
            { icon: '📊', label: 'Dashboard',      path: '/' },
            { icon: '💡', label: 'My Ideas',       path: '/ideas' },
            { icon: '✨', label: 'Clarity Score',  path: '/report' },
            { icon: '⚡', label: 'Content Tools',  path: '/content' },
            { icon: '📝', label: 'Content Brief',  path: '/brief' },
            { icon: '📅', label: 'Post Schedule',  path: '/schedule', active: true },
            { icon: '🎬', label: 'Video Analysis', path: '/video' },
          ].map(item => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`} onClick={() => window.location.href = item.path}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '8px' }}>Account</div>
          <div className="nav-item"><span style={{ fontSize: '16px' }}>💳</span> Billing</div>
          <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing' }} style={{ color: '#fca5a5' }}>
            <span style={{ fontSize: '16px' }}>🚪</span> Sign out
          </div>

          {/* User card */}
          <div style={{ marginTop: 'auto', padding: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0, boxShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
                {user?.email?.slice(0, 2).toUpperCase() || 'ME'}
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

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>This week · {rangeLabel}</div>
              <h1 style={{ fontSize: '34px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>📅 Post Schedule</h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: '500' }}>Plan and organize your content drops across every platform.</p>
            </div>
            <button className="add-btn" onClick={() => setShowForm(s => !s)}>{showForm ? '✕ Close' : '+ New Post'}</button>
          </div>

          {/* New post form */}
          {showForm && (
            <div style={{ ...glass, padding: '1.5rem', animation: 'fadeUp 0.3s ease' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>📌 New Post</div>

              <div style={{ marginBottom: '14px' }}>
                <div className="field-label">Day</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {DAYS.map((d, i) => {
                    const sel = form.day === i
                    return (
                      <div key={d} onClick={() => setForm(f => ({ ...f, day: i }))} style={{
                        padding: '7px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '700',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                        background: sel ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${sel ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.12)'}`,
                        color: sel ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                      }}>{d}</div>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div className="field-label">Platform</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PLATFORMS.map(p => {
                    const sel = form.platform === p.name
                    return (
                      <div key={p.name} onClick={() => setForm(f => ({ ...f, platform: p.name }))} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                        background: sel ? p.bg : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${sel ? p.border : 'rgba(255,255,255,0.12)'}`,
                        color: sel ? p.color : 'rgba(255,255,255,0.5)',
                      }}>
                        <span>{p.icon}</span> {p.name}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '220px' }}>
                  <div className="field-label">Title</div>
                  <input className="form-input" placeholder="e.g. Behind-the-scenes reel" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div className="field-label">Time</div>
                  <input type="time" className="form-input" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div className="field-label">Notes (optional)</div>
                <textarea className="form-input" rows={2} placeholder="Hooks, captions, reminders..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="add-btn" onClick={addPost}>Add to schedule</button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Calendar grid */}
          <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
            {weekDates.map((date, i) => {
              const dayPosts = posts.filter(p => p.day === i).sort((a, b) => a.time.localeCompare(b.time))
              const isToday = date.toDateString() === new Date().toDateString()
              return (
                <div key={i} className="day-card" style={{
                  ...glass, padding: '14px', minHeight: '240px',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  ...(isToday ? { border: '1px solid rgba(167,139,250,0.4)', boxShadow: '0 0 24px rgba(167,139,250,0.15)' } : {}),
                }}>
                  <div style={{ textAlign: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: isToday ? '#c4b5fd' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{DAYS[i]}</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginTop: '2px' }}>{date.getDate()}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    {dayPosts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '1.25rem 0', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>No posts</div>
                    ) : dayPosts.map(post => {
                      const info = platformInfo(post.platform)
                      return (
                        <div key={post.id} className="post-card" style={{ background: info.bg, border: `1px solid ${info.border}` }} title={post.notes || undefined}>
                          <span className="post-remove" onClick={(e) => { e.stopPropagation(); removePost(post.id) }}>✕</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px' }}>{info.icon}</span>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: info.color }}>{post.time}</span>
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.85)', lineHeight: '1.3' }}>{post.title}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="add-day-btn" onClick={() => openFormForDay(i)}>+ Add</div>
                </div>
              )
            })}
          </div>

        </main>
      </div>
    </>
  )
}
