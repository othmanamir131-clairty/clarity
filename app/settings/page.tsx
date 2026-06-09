'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [displayName, setDisplayName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameMessage, setNameMessage] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  const [planMessage, setPlanMessage] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else {
        setUser(data.user)
        setDisplayName(data.user.user_metadata?.display_name || '')
      }
    })
  }, [])

  const saveDisplayName = async () => {
    if (!displayName.trim()) return
    setSavingName(true)
    setNameMessage('')
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } })
    setNameMessage(error ? error.message : 'Display name updated!')
    setSavingName(false)
  }

  const updatePassword = async () => {
    setPasswordMessage('')
    if (newPassword.length < 6) { setPasswordMessage('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordMessage("Passwords don't match."); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordMessage(error ? error.message : 'Password updated successfully!')
    if (!error) { setNewPassword(''); setConfirmPassword('') }
    setSavingPassword(false)
  }

  const requestDeletion = () => {
    setConfirmDelete(false)
    setDeleteMessage("Request received — we'll email you within 48 hours to confirm account deletion.")
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'ME'

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

  const plans = [
    { name: 'Pro', price: '$29.99', period: '/mo', perks: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Clarity Score'], color: '#a78bfa' },
    { name: 'Premium', price: '$59.99', period: '/mo', perks: ['Everything in Pro', 'Video analysis', 'AI Content Brief', 'Posting Schedule'], color: '#34d399' },
  ]

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

        .settings-card { padding: 1.75rem; animation: fadeUp 0.3s ease; }
        .section-title { font-size: 18px; font-weight: 800; color: white; letter-spacing: -0.3px; }
        .section-sub { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; margin-top: 4px; }

        .field-label {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px;
        }

        .form-input {
          width: 100%; padding: 12px 14px;
          border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          font-size: 14px; outline: none; color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-input:focus { border-color: rgba(167,139,250,0.5); background: rgba(255,255,255,0.1); box-shadow: 0 0 0 3px rgba(167,139,250,0.15); }
        .form-input:disabled { opacity: 0.6; cursor: not-allowed; }

        .save-btn {
          background: linear-gradient(135deg, #7c3aed, #0d9488);
          color: white; border: none; border-radius: 12px;
          padding: 12px 24px; font-size: 14px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease; white-space: nowrap;
        }
        .save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.4); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

        .plan-card {
          border-radius: 16px; padding: 1.4rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .plan-card:hover { background: rgba(255,255,255,0.09); transform: translateY(-3px); }

        .upgrade-btn {
          width: 100%; margin-top: 14px;
          background: rgba(255,255,255,0.1); color: white;
          border: 1px solid rgba(255,255,255,0.18); border-radius: 100px;
          padding: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
        }
        .upgrade-btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }

        .danger-btn {
          background: rgba(239,68,68,0.12); color: #fca5a5;
          border: 1px solid rgba(239,68,68,0.35); border-radius: 12px;
          padding: 12px 22px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
        }
        .danger-btn:hover { background: rgba(239,68,68,0.22); color: white; }

        .danger-btn-confirm {
          background: #ef4444; color: white; border: none;
          border-radius: 12px; padding: 12px 22px;
          font-size: 14px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
        }
        .danger-btn-confirm:hover { background: #dc2626; transform: translateY(-2px); }

        .cancel-btn {
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;
          padding: 12px 20px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s ease;
        }
        .cancel-btn:hover { background: rgba(255,255,255,0.14); color: white; }

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
          .plans-grid { grid-template-columns: 1fr !important; }
          .section-title { font-size: 20px !important; margin-bottom: 1rem !important; }
          .section-desc { font-size: 13px !important; margin-bottom: 1.5rem !important; }
          .plan-card { padding: 1.25rem !important; }
          h1 { font-size: 26px !important; letter-spacing: -0.5px !important; }
        }
        @media (max-width: 480px) {
          .main { padding: 1rem !important; max-width: 100% !important; }
          .section-title { font-size: 18px !important; }
          .section-desc { font-size: 12px !important; }
          .plan-card { padding: 1rem !important; }
          .danger-btn-confirm { padding: 10px 16px !important; font-size: 13px !important; }
          .cancel-btn { padding: 10px 16px !important; font-size: 13px !important; }
          .settings-card { padding: 1.25rem !important; }
          .danger-confirm-box { max-width: 100% !important; }
        }
      `}</style>

      {/* Blobs */}
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
            { icon: '📊', label: 'Dashboard',      path: '/' },
            { icon: '💡', label: 'My Ideas',       path: '/ideas' },
            { icon: '✨', label: 'Clarity Score',  path: '/report' },
            { icon: '⚡', label: 'Content Tools',  path: '/content' },
            { icon: '📝', label: 'Content Brief',  path: '/brief' },
            { icon: '📅', label: 'Post Schedule',  path: '/schedule' },
            { icon: '🎬', label: 'Video Analysis', path: '/video' },
          ].map(item => (
            <div key={item.label} className="nav-item" onClick={() => window.location.href = item.path}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '16px 14px 8px', marginTop: '8px' }}>Account</div>
          <div className="nav-item active"><span style={{ fontSize: '16px' }}>⚙️</span> Settings</div>
          <div className="nav-item"><span style={{ fontSize: '16px' }}>💳</span> Billing</div>
          <div className="nav-item" onClick={async () => { await supabase.auth.signOut(); window.location.href = '/landing' }} style={{ color: '#fca5a5' }}>
            <span style={{ fontSize: '16px' }}>🚪</span> Sign out
          </div>

          {/* User card */}
          <div style={{ marginTop: 'auto', padding: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white', flexShrink: 0, boxShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
                {initials}
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
        <main className="main" style={{ flex: 1, padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, maxWidth: '880px' }}>

          {/* Mobile header */}
          <div className="mobile-bar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'white' }}>☰</button>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>✦ Clarity</div>
            <div style={{ width: '32px' }} />
          </div>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: '34px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>⚙️ Profile &amp; Settings</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', fontWeight: '500' }}>Manage your profile, account security, and plan.</p>
          </div>

          {/* Profile section */}
          <section className="settings-card" style={glass}>
            <div className="section-title">Profile</div>
            <div className="section-sub">How you appear across Clarity</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #a78bfa, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: 'white', flexShrink: 0, boxShadow: '0 0 24px rgba(167,139,250,0.5)' }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || '—'}</div>
              </div>
            </div>

            <div style={{ maxWidth: '380px' }}>
              <div className="field-label">Display name</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Add a display name"
                  value={displayName}
                  onChange={e => { setDisplayName(e.target.value); setNameMessage('') }}
                  onKeyDown={e => e.key === 'Enter' && saveDisplayName()}
                />
                <button className="save-btn" onClick={saveDisplayName} disabled={savingName || !displayName.trim()}>
                  {savingName ? 'Saving...' : 'Save'}
                </button>
              </div>
              {nameMessage && (
                <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: '500', color: nameMessage.includes('updated') ? '#6ee7b7' : '#fca5a5' }}>{nameMessage}</div>
              )}
            </div>
          </section>

          {/* Account section */}
          <section className="settings-card" style={glass}>
            <div className="section-title">Account</div>
            <div className="section-sub">Update your password</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px', marginTop: '18px' }}>
              <div>
                <div className="field-label">New password</div>
                <input
                  className="form-input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setPasswordMessage('') }}
                />
              </div>
              <div>
                <div className="field-label">Confirm new password</div>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setPasswordMessage('') }}
                  onKeyDown={e => e.key === 'Enter' && updatePassword()}
                />
              </div>

              {passwordMessage && (
                <div style={{ fontSize: '13px', fontWeight: '500', color: passwordMessage.includes('success') ? '#6ee7b7' : '#fca5a5' }}>{passwordMessage}</div>
              )}

              <button className="save-btn" style={{ alignSelf: 'flex-start' }} onClick={updatePassword} disabled={savingPassword || !newPassword || !confirmPassword}>
                {savingPassword ? 'Updating...' : 'Update password'}
              </button>
            </div>
          </section>

          {/* Plan section */}
          <section className="settings-card" style={glass}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div className="section-title">Plan</div>
                <div className="section-sub">You're currently on the free plan</div>
              </div>
              <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.2)', color: '#c4b5fd', fontSize: '11px', fontWeight: '800', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(167,139,250,0.3)', letterSpacing: '0.06em' }}>FREE PLAN</div>
            </div>

            <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              {plans.map(plan => (
                <div key={plan.name} className="plan-card">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: plan.color }}>{plan.name}</span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: 'white' }}>{plan.price}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{plan.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {plan.perks.map(perk => (
                      <li key={perk} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: plan.color, fontWeight: '800' }}>✓</span>{perk}
                      </li>
                    ))}
                  </ul>
                  <button className="upgrade-btn" onClick={() => setPlanMessage(`🚀 Upgrades to ${plan.name} are launching soon — we'll notify you the moment it's ready!`)}>
                    Upgrade to {plan.name}
                  </button>
                </div>
              ))}
            </div>
            {planMessage && (
              <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: '500', color: '#c4b5fd', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '10px', padding: '12px 14px' }}>{planMessage}</div>
            )}
          </section>

          {/* Danger zone */}
          <section className="settings-card" style={{ ...glass, border: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="section-title" style={{ color: '#fca5a5' }}>Danger zone</div>
            <div className="section-sub">Permanently delete your account and all of your data. This can't be undone.</div>

            <div style={{ marginTop: '18px' }}>
              {!confirmDelete ? (
                <button className="danger-btn" onClick={() => { setConfirmDelete(true); setDeleteMessage('') }}>
                  Delete account
                </button>
              ) : (
                <div className="danger-confirm-box" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '16px', maxWidth: '460px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>Are you sure you want to delete your account?</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>All your ideas, schedules, and reports will be permanently erased. This action cannot be reversed.</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button className="danger-btn-confirm" onClick={requestDeletion}>Yes, delete my account</button>
                    <button className="cancel-btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {deleteMessage && (
                <div style={{ marginTop: '14px', fontSize: '13px', fontWeight: '500', color: '#fca5a5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 14px', maxWidth: '460px' }}>{deleteMessage}</div>
              )}
            </div>
          </section>

        </main>
      </div>
    </>
  )
}
