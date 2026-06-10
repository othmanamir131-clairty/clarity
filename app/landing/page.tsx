'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// ============================================================
// REVAMPED LANDING PAGE — Built with:
// copywriting · cro · marketing-psychology · ui-ux-pro-max
// product-marketing · security (no eval, no dangerouslySetInnerHTML)
// ============================================================

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [annual, setAnnual] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % 6), 3000)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  // ─── Feature mockups ───────────────────────────────────────
  const featureMockups = [
    // AI Brain Dump
    <div key="m0" style={{ background: 'rgba(124,58,237,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', borderRadius: '10px 10px 2px 10px', padding: '5px 9px', fontSize: '9px', color: 'white', fontWeight: '600', maxWidth: '80%' }}>
          I want to grow my TikTok…
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: '800' }}>✦</div>
        <div style={{ background: 'white', borderRadius: '2px 10px 10px 10px', padding: '5px 8px', fontSize: '8px', color: '#4c1d95', fontWeight: '600', border: '1px solid rgba(124,58,237,0.12)', flex: 1, lineHeight: 1.5 }}>
          Here&apos;s your growth plan:<br />
          <span style={{ color: '#7c3aed' }}>• Post 4x/week</span> · Best time 6–8pm
        </div>
      </div>
    </div>,
    // Clarity Score
    <div key="m1" style={{ background: 'rgba(16,185,129,0.07)', borderRadius: '12px', padding: '12px 14px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '9px' }}>
        <div style={{ fontSize: '30px', fontWeight: '800', background: 'linear-gradient(135deg, #059669, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>87</div>
        <div>
          <div style={{ fontSize: '9px', fontWeight: '800', color: '#059669', letterSpacing: '0.05em' }}>CLARITY SCORE</div>
          <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>This week · +12 from last</div>
        </div>
      </div>
      <div style={{ background: 'rgba(16,185,129,0.12)', borderRadius: '100px', height: '6px', width: '100%', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #059669, #34d399)', borderRadius: '100px', height: '100%', width: '87%' }} />
      </div>
    </div>,
    // Spreadsheets
    <div key="m2" style={{ background: 'rgba(245,158,11,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}>
        {['Day', 'Platform', 'Type'].map(h => (
          <div key={h} style={{ background: 'rgba(245,158,11,0.2)', borderRadius: '4px', padding: '3px 5px', fontSize: '8px', fontWeight: '700', color: '#d97706', textAlign: 'center' }}>{h}</div>
        ))}
        {['Mon', 'TikTok', 'Tutorial', 'Wed', 'Instagram', 'Reel', 'Fri', 'YouTube', 'Vlog'].map((c, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '4px', padding: '3px 5px', fontSize: '8px', color: '#92400e', textAlign: 'center', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</div>
        ))}
      </div>
    </div>,
    // Video Analysis
    <div key="m3" style={{ background: 'rgba(236,72,153,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)', borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #db2777', marginLeft: '2px' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['12 Hooks', '8 Ideas', '20 Tags'].map(label => (
          <div key={label} style={{ background: 'rgba(236,72,153,0.15)', borderRadius: '6px', padding: '3px 7px', fontSize: '8px', fontWeight: '700', color: '#db2777', flex: 1, textAlign: 'center' }}>{label}</div>
        ))}
      </div>
    </div>,
    // Content Tools
    <div key="m4" style={{ background: 'rgba(59,130,246,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {['Caption', 'Hook', '#Tags'].map((t, i) => (
          <div key={i} style={{ background: i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.12)', borderRadius: '100px', padding: '2px 8px', fontSize: '8px', fontWeight: '700', color: i === 0 ? 'white' : '#1d4ed8' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '6px', padding: '6px 8px', border: '1px solid rgba(59,130,246,0.15)', fontSize: '8px', color: '#374151', lineHeight: 1.5, flex: 1 }}>
        Ready to level up your fitness game? 💪 Here&apos;s why consistency beats intensity…
      </div>
    </div>,
    // Ideas Library
    <div key="m5" style={{ background: 'rgba(124,58,237,0.07)', borderRadius: '12px', padding: '8px', height: '88px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
      {[
        { color: '#a78bfa', text: 'TikTok series idea' },
        { color: '#34d399', text: 'Brand deal pitch' },
        { color: '#fbbf24', text: '30-day challenge' },
        { color: '#f472b6', text: 'Collab strategy' },
      ].map((card, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '6px', padding: '5px 6px', border: '1px solid rgba(124,58,237,0.1)', overflow: 'hidden' }}>
          <div style={{ height: '3px', background: card.color, borderRadius: '100px', marginBottom: '4px', width: '55%' }} />
          <div style={{ fontSize: '7px', fontWeight: '600', color: '#374151', lineHeight: 1.3 }}>{card.text}</div>
        </div>
      ))}
    </div>,
  ]

  const features = [
    { emoji: '🧠', title: 'AI Brain Dump', color: '#a78bfa' },
    { emoji: '✨', title: 'Clarity Score', color: '#34d399' },
    { emoji: '📊', title: 'Spreadsheets', color: '#fbbf24' },
    { emoji: '🎬', title: 'Video Analysis', color: '#f472b6' },
    { emoji: '⚡', title: 'Content Tools', color: '#60a5fa' },
    { emoji: '💡', title: 'Ideas Library', color: '#a78bfa' },
  ]

  const faqs = [
    {
      q: 'Is there really a free plan — no credit card needed?',
      a: 'Yes. The free plan is free forever. You get 5 AI messages per day, the full dashboard, and your ideas library. No credit card, no trial timer, no gotchas.',
    },
    {
      q: 'How is Clarity different from ChatGPT or Notion?',
      a: 'ChatGPT forgets you the moment you close the tab. Notion is a blank page that you have to organize yourself. Clarity remembers every idea you save, asks smart follow-up questions, and generates real downloadable files — not just text you have to copy-paste.',
    },
    {
      q: 'What kinds of files does it actually generate?',
      a: 'Excel spreadsheets, content calendars, action plans, and content briefs — all downloadable in one click. You ask in plain English, Clarity builds the file.',
    },
    {
      q: 'Do I need to be a content creator to use this?',
      a: 'Not at all. If you have goals, projects, or ideas you keep losing track of, Clarity works for you. Creators, freelancers, students, and everyday people all use it.',
    },
    {
      q: 'Can I cancel or change plans anytime?',
      a: 'Yes. No contracts, no lock-in. Cancel or switch plans from your settings in under 30 seconds.',
    },
  ]

  const proMonthly = 29.99
  const premiumMonthly = 59.99
  const proAnnual = (proMonthly * 12 * 0.75 / 12).toFixed(2)
  const premiumAnnual = (premiumMonthly * 12 * 0.75 / 12).toFixed(2)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f8f6ff;
          --purple-deep: #4c1d95;
          --purple: #7c3aed;
          --purple-mid: #8b5cf6;
          --purple-light: #ede9fe;
          --mint: #10b981;
          --teal: #0d9488;
          --sky: #0ea5e9;
          --pink: #ec4899;
          --white: #ffffff;
          --black: #0a0a0f;
          --text: #1e1b4b;
          --gray: #6b7280;
          --border: rgba(124,58,237,0.12);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes meshMove {
          0%   { transform: translate(0,0) rotate(0deg); }
          33%  { transform: translate(30px,-20px) rotate(2deg); }
          66%  { transform: translate(-20px,30px) rotate(-1deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 30px rgba(124,58,237,0.15); }
          50%      { box-shadow: 0 0 60px rgba(124,58,237,0.35); }
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: 0.5; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes featurePop {
          from { transform: scale(0.9); opacity: 0.5; }
          to   { transform: scale(1.05); opacity: 1; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* ─── NAV ─── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 4rem;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(248,246,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 2px 20px rgba(124,58,237,0.06);
        }
        .nav-logo {
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--purple), var(--mint));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-pill {
          display: flex; align-items: center; gap: 0.25rem;
          background: white; border: 1px solid var(--border);
          border-radius: 100px; padding: 5px;
        }
        .nav-pill-btn {
          background: none; border: none; padding: 6px 18px;
          font-size: 14px; color: var(--gray); font-weight: 500;
          cursor: pointer; border-radius: 100px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .nav-pill-btn:hover { background: var(--purple-light); color: var(--purple); }
        .nav-login {
          background: none; border: none; font-size: 14px;
          color: var(--gray); font-weight: 500; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: color 0.2s;
        }
        .nav-login:hover { color: var(--text); }
        .nav-cta {
          background: var(--purple); color: white; border: none;
          border-radius: 100px; padding: 10px 24px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .nav-cta:hover { background: var(--purple-deep); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35); }

        /* ─── HERO ─── */
        .hero-wrap {
          min-height: 100vh;
          background: linear-gradient(160deg, #3b0764 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-size: 300% 300%;
          animation: gradientShift 12s ease infinite;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 9rem 3rem 6rem; text-align: center;
        }
        .mesh-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; opacity: 0.35;
        }
        .mb1 { width: 600px; height: 600px; top: -150px; left: -150px; background: #7c3aed; animation: meshMove 18s ease-in-out infinite; }
        .mb2 { width: 500px; height: 500px; bottom: -100px; right: -100px; background: #10b981; animation: meshMove 14s ease-in-out infinite reverse; }
        .mb3 { width: 400px; height: 400px; top: 40%; left: 50%; transform: translateX(-50%); background: #0ea5e9; animation: meshMove 20s ease-in-out infinite 2s; }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px; padding: 7px 18px;
          font-size: 13px; color: rgba(255,255,255,0.9);
          font-weight: 600; margin-bottom: 2rem;
          backdrop-filter: blur(10px);
          animation: fadeUp 0.6s ease forwards;
          position: relative; z-index: 2;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--mint); animation: dotPulse 2s ease infinite;
          box-shadow: 0 0 8px rgba(16,185,129,0.6);
        }
        .hero-h1 {
          font-size: 78px; font-weight: 800;
          line-height: 1.02; letter-spacing: -4px;
          color: white; margin-bottom: 1.5rem;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.1s both;
          text-shadow: 0 2px 40px rgba(0,0,0,0.3);
          max-width: 820px;
        }
        .hero-h1 em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-sub {
          font-size: 19px; color: rgba(255,255,255,0.72);
          line-height: 1.75; max-width: 540px;
          margin: 0 auto 2.5rem;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.2s both;
        }
        .hero-sub strong { color: white; }
        .hero-btns {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 1.25rem;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.3s both;
        }
        .btn-hero-primary {
          background: white; color: var(--purple);
          border: none; border-radius: 100px;
          padding: 18px 40px; font-size: 17px; font-weight: 800;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(0,0,0,0.28); }
        .btn-hero-ghost {
          background: rgba(255,255,255,0.1);
          color: white; border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 100px; padding: 17px 32px;
          font-size: 17px; font-weight: 600; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        .btn-hero-ghost:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .hero-note { font-size: 13px; color: rgba(255,255,255,0.38); position: relative; z-index: 2; animation: fadeUp 0.7s ease 0.4s both; margin-bottom: 3.5rem; }

        /* Social proof avatars */
        .hero-social {
          display: flex; align-items: center; gap: 12px;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.45s both;
          margin-bottom: 3rem;
        }
        .avatar-stack { display: flex; }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          margin-left: -8px; background: linear-gradient(135deg, #7c3aed, #34d399);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white;
          overflow: hidden;
        }
        .avatar:first-child { margin-left: 0; }
        .hero-social-text { font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500; }
        .hero-social-text strong { color: white; }

        /* Feature pills */
        .hero-cards {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          position: relative; z-index: 2;
        }
        .glass-card {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px; padding: 10px 20px;
          backdrop-filter: blur(12px);
          font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 600;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.2s ease; cursor: default;
        }
        .glass-card:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
        .glass-card.active-card {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.4);
          animation: featurePop 0.4s ease forwards;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        /* ─── TRUST BAR ─── */
        .trust-bar {
          background: white;
          border-bottom: 1px solid rgba(124,58,237,0.08);
          padding: 1.25rem 4rem;
          display: flex; align-items: center; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--gray); font-weight: 600;
        }
        .trust-icon { font-size: 16px; }

        /* ─── HOW IT WORKS ─── */
        .hiw-section { background: white; padding: 7rem 4rem; }
        .hiw-inner { max-width: 960px; margin: 0 auto; text-align: center; }
        .hiw-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; position: relative; }
        .hiw-steps::before {
          content: '';
          position: absolute; top: 32px; left: calc(16.66% + 16px); right: calc(16.66% + 16px);
          height: 2px;
          background: linear-gradient(90deg, var(--purple-light), var(--purple-light));
          border-top: 2px dashed rgba(124,58,237,0.2);
          z-index: 0;
        }
        .hiw-step { position: relative; z-index: 1; }
        .hiw-num {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), var(--purple-mid));
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; color: white;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
        }
        .hiw-step-title { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; margin-bottom: 0.75rem; }
        .hiw-step-desc { font-size: 15px; color: var(--gray); line-height: 1.7; }

        /* ─── FEATURES ─── */
        .features-section { background: var(--bg); padding: 7rem 4rem; }
        .features-inner { max-width: 1100px; margin: 0 auto; }
        .section-eyebrow { font-size: 12px; font-weight: 700; color: var(--purple); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1rem; }
        .section-h2 { font-size: 52px; font-weight: 800; color: var(--text); letter-spacing: -2.5px; line-height: 1.07; margin-bottom: 4rem; }
        .section-h2 em { font-style: italic; color: var(--purple); }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .feat-card {
          border-radius: 22px; padding: 2rem;
          border: 1.5px solid transparent;
          transition: all 0.3s ease; position: relative;
          overflow: hidden;
        }
        .feat-card:hover { transform: translateY(-6px); }
        .feat-card::before {
          content: ''; position: absolute; inset: 0;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
          backdrop-filter: blur(4px); z-index: 0;
        }
        .feat-card-inner { position: relative; z-index: 1; }
        .feat-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
        .feat-title { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; margin-bottom: 10px; }
        .feat-desc { font-size: 14px; color: var(--gray); line-height: 1.7; }

        /* ─── DEMO ─── */
        .demo-section { background: white; padding: 7rem 4rem; }
        .demo-inner { max-width: 920px; margin: 0 auto; }
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3.5rem; align-items: center; }
        .demo-h { font-size: 44px; font-weight: 800; color: var(--text); letter-spacing: -2px; line-height: 1.1; margin-bottom: 1.25rem; }
        .demo-h em { font-style: italic; color: var(--purple); }
        .demo-p { font-size: 16px; color: var(--gray); line-height: 1.75; margin-bottom: 2rem; }
        .demo-chat {
          background: var(--bg); border-radius: 20px;
          padding: 1.5rem; border: 1.5px solid var(--border);
          box-shadow: 0 8px 40px rgba(124,58,237,0.08);
          animation: glow 4s ease-in-out infinite;
        }
        .chat-bubble-user { display: flex; justify-content: flex-end; margin-bottom: 14px; }
        .chat-bubble-user div {
          background: linear-gradient(135deg, var(--purple), var(--purple-mid));
          color: white; border-radius: 18px 18px 4px 18px;
          padding: 12px 16px; font-size: 14px; font-weight: 600;
          max-width: 80%; line-height: 1.5;
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
        }
        .chat-bubble-ai { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px; }
        .chat-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, var(--purple), var(--mint));
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; color: white; flex-shrink: 0;
        }
        .chat-bubble-ai div {
          background: white; border: 1px solid var(--border);
          border-radius: 4px 18px 18px 18px;
          padding: 12px 16px; font-size: 14px; color: var(--text);
          line-height: 1.65; flex: 1;
        }
        .chat-output {
          background: var(--purple-light); border: 1.5px solid rgba(124,58,237,0.2);
          border-radius: 12px; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .chat-output-text { font-size: 13px; font-weight: 700; color: var(--purple); }
        .chat-output-sub { font-size: 11px; color: rgba(124,58,237,0.6); margin-top: 2px; }

        /* ─── TESTIMONIALS ─── */
        .testimonials-section { background: var(--bg); padding: 7rem 4rem; }
        .testimonials-inner { max-width: 1100px; margin: 0 auto; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 4rem; }
        .testi-card {
          background: white; border-radius: 20px; padding: 2rem;
          border: 1.5px solid rgba(124,58,237,0.08);
          box-shadow: 0 4px 20px rgba(124,58,237,0.05);
          transition: all 0.25s ease;
        }
        .testi-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(124,58,237,0.12); }
        .testi-stars { font-size: 14px; color: #f59e0b; margin-bottom: 1rem; letter-spacing: 2px; }
        .testi-quote { font-size: 15px; color: #374151; line-height: 1.75; margin-bottom: 1.5rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 800; color: white; flex-shrink: 0;
        }
        .testi-name { font-size: 14px; font-weight: 700; color: var(--text); }
        .testi-handle { font-size: 12px; color: var(--gray); margin-top: 2px; }

        /* ─── COMPARISON ─── */
        .compare-section { background: white; padding: 7rem 4rem; }
        .compare-inner { max-width: 780px; margin: 0 auto; text-align: center; }
        .compare-table {
          margin-top: 3.5rem; border-radius: 20px; overflow: hidden;
          border: 1.5px solid rgba(124,58,237,0.12);
          box-shadow: 0 8px 40px rgba(124,58,237,0.07);
          width: 100%;
        }
        .compare-thead { background: linear-gradient(135deg, #4c1d95, #7c3aed); }
        .compare-thead th {
          padding: 1.25rem 1.5rem; font-size: 14px; font-weight: 700; color: white;
          text-align: center;
        }
        .compare-thead th:first-child { text-align: left; color: rgba(255,255,255,0.5); }
        .compare-col-highlight { background: rgba(255,255,255,0.15) !important; }
        .compare-tbody tr { border-bottom: 1px solid rgba(124,58,237,0.07); }
        .compare-tbody tr:last-child { border-bottom: none; }
        .compare-tbody tr:nth-child(even) { background: rgba(124,58,237,0.02); }
        .compare-tbody td {
          padding: 1rem 1.5rem; font-size: 14px; font-weight: 500;
          color: var(--gray); text-align: center;
        }
        .compare-tbody td:first-child { text-align: left; color: var(--text); font-weight: 600; }
        .compare-yes { color: #059669; font-size: 18px; font-weight: 800; }
        .compare-no  { color: #d1d5db; font-size: 18px; }
        .compare-partial { color: #f59e0b; font-size: 13px; font-weight: 600; }
        .compare-clarity-col { background: rgba(124,58,237,0.04) !important; }

        /* ─── QUOTE/STATS ─── */
        .quote-section {
          padding: 8rem 4rem; text-align: center;
          background: linear-gradient(135deg, var(--purple-deep), #1e1b4b, #0f172a);
          position: relative; overflow: hidden;
        }
        .quote-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }
        .qb1 { width: 400px; height: 400px; top: -100px; left: -100px; background: var(--purple-mid); opacity: 0.15; }
        .qb2 { width: 350px; height: 350px; bottom: -100px; right: -100px; background: var(--mint); opacity: 0.12; }
        .quote-inner-wrap { max-width: 800px; margin: 0 auto; position: relative; z-index: 2; }
        .quote-emoji { font-size: 56px; margin-bottom: 1.5rem; }
        .quote-text { font-size: 46px; font-weight: 800; color: white; line-height: 1.15; letter-spacing: -2px; margin-bottom: 1.25rem; }
        .quote-text em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .quote-sub { font-size: 17px; color: rgba(255,255,255,0.42); line-height: 1.7; margin-bottom: 3.5rem; }
        .quote-stats { display: flex; justify-content: center; gap: 5rem; flex-wrap: wrap; }
        .qs-num { font-size: 48px; font-weight: 800; color: white; letter-spacing: -2px; animation: countUp 0.6s ease both; }
        .qs-label { font-size: 13px; color: rgba(255,255,255,0.32); margin-top: 6px; }

        /* ─── PRICING ─── */
        .pricing-section { background: var(--bg); padding: 7rem 4rem; }
        .pricing-inner { max-width: 1000px; margin: 0 auto; }
        .pricing-h { font-size: 52px; font-weight: 800; color: var(--text); letter-spacing: -2.5px; margin-bottom: 1rem; }
        .pricing-h em { font-style: italic; color: var(--purple); }
        .pricing-sub { font-size: 17px; color: var(--gray); margin-bottom: 2rem; }
        .toggle-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 3.5rem; }
        .toggle-label { font-size: 14px; font-weight: 600; color: var(--gray); }
        .toggle-label.active { color: var(--purple); }
        .toggle-track {
          width: 48px; height: 26px; background: var(--border);
          border-radius: 100px; position: relative; cursor: pointer;
          transition: background 0.25s;
          border: none; padding: 0;
        }
        .toggle-track.on { background: var(--purple); }
        .toggle-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 20px; height: 20px; border-radius: 50%; background: white;
          transition: transform 0.25s;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(22px); }
        .save-badge { background: #d1fae5; color: #059669; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
        .pricing-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .price-card {
          background: white; border-radius: 24px; padding: 2.25rem;
          border: 1.5px solid rgba(124,58,237,0.1);
          transition: all 0.25s ease; position: relative;
        }
        .price-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px rgba(124,58,237,0.15); }
        .price-card.featured {
          background: linear-gradient(160deg, var(--purple), var(--purple-deep));
          border-color: transparent;
          box-shadow: 0 24px 56px rgba(124,58,237,0.3);
        }
        .price-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--mint); color: white; font-size: 11px; font-weight: 800; padding: 5px 16px; border-radius: 100px; white-space: nowrap; box-shadow: 0 4px 12px rgba(16,185,129,0.4); }
        .price-tier { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .price-amount { font-size: 52px; font-weight: 800; letter-spacing: -2px; line-height: 1; margin-bottom: 4px; }
        .price-period { font-size: 16px; font-weight: 500; }
        .price-desc { font-size: 14px; margin-bottom: 1.75rem; }
        .price-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; }
        .price-features li { font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .price-btn {
          width: 100%; border-radius: 100px; padding: 14px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none; transition: all 0.2s ease;
        }
        .price-btn:hover { transform: translateY(-2px); }

        /* ─── FAQ ─── */
        .faq-section { background: white; padding: 7rem 4rem; }
        .faq-inner { max-width: 680px; margin: 0 auto; }
        .faq-list { margin-top: 3.5rem; display: flex; flex-direction: column; gap: 12px; }
        .faq-item {
          border: 1.5px solid rgba(124,58,237,0.1); border-radius: 16px;
          overflow: hidden; transition: all 0.2s ease;
          background: white;
        }
        .faq-item:hover { border-color: rgba(124,58,237,0.25); }
        .faq-item.open { border-color: rgba(124,58,237,0.3); box-shadow: 0 4px 20px rgba(124,58,237,0.08); }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem; cursor: pointer;
          background: none; border: none; width: 100%;
          text-align: left; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .faq-q-text { font-size: 15px; font-weight: 700; color: var(--text); flex: 1; padding-right: 1rem; }
        .faq-chevron {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--purple-light); display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: var(--purple); flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .faq-item.open .faq-chevron { transform: rotate(180deg); background: var(--purple); color: white; }
        .faq-a { padding: 0 1.5rem 1.25rem; font-size: 14px; color: var(--gray); line-height: 1.75; }

        /* ─── FINAL CTA ─── */
        .cta-section {
          background: linear-gradient(160deg, #3b0764 0%, #4c1d95 40%, #064e3b 100%);
          padding: 9rem 4rem; text-align: center; position: relative; overflow: hidden;
        }
        .cta-blob1 { position: absolute; width: 500px; height: 500px; top: -100px; left: -100px; background: #7c3aed; opacity: 0.15; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .cta-blob2 { position: absolute; width: 400px; height: 400px; bottom: -100px; right: -100px; background: #10b981; opacity: 0.12; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .cta-inner { max-width: 680px; margin: 0 auto; position: relative; z-index: 2; }
        .cta-eyebrow { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1.25rem; }
        .cta-h { font-size: 60px; font-weight: 800; color: white; letter-spacing: -3px; line-height: 1.05; margin-bottom: 1.5rem; }
        .cta-h em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-p { font-size: 18px; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 2.5rem; }
        .btn-cta {
          background: white; color: var(--purple);
          border: none; border-radius: 100px;
          padding: 20px 52px; font-size: 18px; font-weight: 800;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 44px rgba(0,0,0,0.28); }
        .cta-guarantee {
          margin-top: 1.75rem; display: flex; align-items: center; justify-content: center;
          gap: 8px; font-size: 13px; color: rgba(255,255,255,0.35);
        }

        /* ─── FOOTER ─── */
        .footer { background: #0a0a0f; padding: 2.75rem 4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.22); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links button { background: none; border: none; font-size: 13px; color: rgba(255,255,255,0.25); cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: color 0.2s; padding: 0; }
        .footer-links button:hover { color: rgba(255,255,255,0.7); }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .nav { padding: 1rem 1.5rem; }
          .nav-pill, .nav-login { display: none; }
          .hero-wrap { padding: 5rem 1.5rem 3rem; min-height: auto; }
          .hero-h1 { font-size: 40px; letter-spacing: -2px; }
          .hero-sub { font-size: 16px; max-width: 100%; }
          .btn-hero-primary, .btn-hero-ghost { width: 100%; padding: 14px 28px; font-size: 15px; }
          .hero-btns { flex-direction: column; width: 100%; }
          .hero-social { justify-content: center; }
          .hero-cards { gap: 8px; }
          .glass-card { font-size: 12px; padding: 8px 14px; }
          .trust-bar { padding: 1rem 1.5rem; gap: 1.5rem; }
          .hiw-section { padding: 4rem 1.5rem; }
          .hiw-steps { grid-template-columns: 1fr; gap: 2rem; }
          .hiw-steps::before { display: none; }
          .features-section { padding: 4rem 1.5rem; }
          .features-grid { grid-template-columns: 1fr; gap: 16px; }
          .section-h2 { font-size: 32px; letter-spacing: -1px; margin-bottom: 2rem; }
          .demo-section { padding: 4rem 1.5rem; }
          .demo-grid { grid-template-columns: 1fr; gap: 2rem; }
          .demo-h { font-size: 28px; }
          .testimonials-section { padding: 4rem 1.5rem; }
          .testimonials-grid { grid-template-columns: 1fr; gap: 16px; }
          .compare-section { padding: 4rem 1.5rem; }
          .compare-table { font-size: 13px; }
          .compare-thead th, .compare-tbody td { padding: 0.75rem 0.75rem; }
          .quote-section { padding: 4rem 1.5rem; }
          .quote-text { font-size: 32px; }
          .quote-stats { gap: 2.5rem; }
          .qs-num { font-size: 36px; }
          .pricing-section { padding: 4rem 1.5rem; }
          .pricing-h { font-size: 32px; letter-spacing: -1px; }
          .pricing-cards { grid-template-columns: 1fr; gap: 16px; }
          .price-amount { font-size: 42px; }
          .faq-section { padding: 4rem 1.5rem; }
          .cta-section { padding: 5rem 1.5rem; }
          .cta-h { font-size: 36px; letter-spacing: -1.5px; }
          .cta-p { font-size: 16px; }
          .btn-cta { padding: 16px 32px; font-size: 16px; width: 100%; }
          .footer { padding: 2rem 1.5rem; flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .nav { padding: 0.75rem 1rem; }
          .nav-logo { font-size: 18px; }
          .nav-cta { padding: 8px 16px; font-size: 13px; }
          .hero-h1 { font-size: 30px; letter-spacing: -1px; }
          .hero-badge { font-size: 11px; padding: 5px 14px; }
          .trust-bar { gap: 1rem; }
          .trust-item { font-size: 12px; }
          .hiw-num { width: 52px; height: 52px; font-size: 20px; }
          .hiw-step-title { font-size: 17px; }
          .compare-table { display: block; overflow-x: auto; }
          .quote-text { font-size: 24px; }
          .quote-stats { flex-direction: column; gap: 1.5rem; }
          .qs-num { font-size: 28px; }
          .pricing-h { font-size: 26px; }
          .cta-h { font-size: 28px; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-logo">✦ Clarity</div>
        <div className="nav-pill">
          <button className="nav-pill-btn" onClick={() => scrollToSection('how-it-works')}>How it works</button>
          <button className="nav-pill-btn" onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button className="nav-pill-btn" onClick={() => scrollToSection('faq')}>FAQ</button>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="nav-login" onClick={() => router.push('/login')}>Log in</button>
          <button className="nav-cta" onClick={() => router.push('/login')}>Start free →</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero-wrap" aria-label="Hero">
        <div className="mesh-blob mb1" aria-hidden="true" />
        <div className="mesh-blob mb2" aria-hidden="true" />
        <div className="mesh-blob mb3" aria-hidden="true" />

        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          AI-powered organization for creators &amp; thinkers
        </div>

        <h1 className="hero-h1">
          Your brain thinks in chaos.<br />
          <em>Clarity thinks in action plans.</em>
        </h1>

        <p className="hero-sub">
          Dump your thoughts, goals, and ideas into Clarity.
          The AI organizes everything and turns it into <strong>spreadsheets, content calendars, and action plans</strong> — in seconds.
        </p>

        <div className="hero-btns">
          <button className="btn-hero-primary" onClick={() => router.push('/login')}>
            Organize my ideas free →
          </button>
          <button className="btn-hero-ghost" onClick={() => scrollToSection('how-it-works')}>
            See how it works
          </button>
        </div>

        <p className="hero-note">Free forever · No credit card · Ready in 30 seconds</p>

        <div className="hero-social">
          <div className="avatar-stack" aria-hidden="true">
            {['M', 'J', 'N', 'A', 'R'].map((l, i) => (
              <div key={i} className="avatar" style={{ background: ['linear-gradient(135deg,#7c3aed,#a78bfa)', 'linear-gradient(135deg,#059669,#34d399)', 'linear-gradient(135deg,#db2777,#f472b6)', 'linear-gradient(135deg,#d97706,#fbbf24)', 'linear-gradient(135deg,#1d4ed8,#60a5fa)'][i] }}>{l}</div>
            ))}
          </div>
          <p className="hero-social-text"><strong>2,400+ creators</strong> stopped losing their ideas this week</p>
        </div>

        <div className="hero-cards" role="list">
          {features.map((f, i) => (
            <div key={i} className={`glass-card ${i === activeFeature ? 'active-card' : ''}`} role="listitem">
              <span aria-hidden="true">{f.emoji}</span>
              <span>{f.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div className="trust-bar" role="complementary" aria-label="Trust signals">
        {[
          { icon: '🔒', text: 'Your data is private' },
          { icon: '✦', text: 'Powered by Claude AI' },
          { icon: '⚡', text: 'Results in seconds' },
          { icon: '💳', text: 'No credit card required' },
          { icon: '🌍', text: 'Used in 40+ countries' },
        ].map(({ icon, text }) => (
          <div key={text} className="trust-item">
            <span className="trust-icon" aria-hidden="true">{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="hiw-section">
        <div className="hiw-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>How it works</p>
          <h2 className="section-h2" style={{ textAlign: 'center', marginBottom: '0' }}>
            Three steps from <em>scattered to sorted.</em>
          </h2>
          <div className="hiw-steps">
            {[
              { n: '1', title: 'Dump everything', desc: 'Type your ideas, goals, or tasks — messy, half-formed, whatever. No formatting needed. Clarity accepts it all.', emoji: '🧠' },
              { n: '2', title: 'AI organizes it', desc: 'Clarity asks smart follow-up questions, then organizes your thoughts into a clear, structured plan automatically.', emoji: '✦' },
              { n: '3', title: 'Download and act', desc: 'Get a real Excel spreadsheet, content calendar, or action plan downloaded to your device in one click.', emoji: '📥' },
            ].map((step, i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-num" aria-hidden="true">{step.n}</div>
                <div className="hiw-step-title">{step.title}</div>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="product" className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow">What&apos;s inside</p>
          <h2 className="section-h2">Six tools built for<br />creators who think <em>fast.</em></h2>
          <div className="features-grid">
            {[
              { emoji: '🧠', title: 'AI Brain Dump', tag: 'Core', tagBg: '#ede9fe', tagColor: '#7c3aed', desc: 'Type anything — messy thoughts, big goals, random ideas. Clarity organizes it instantly. No folders, no friction, no forgetting.', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: 'rgba(124,58,237,0.15)' },
              { emoji: '✨', title: 'Clarity Score', tag: 'Unique', tagBg: '#d1fae5', tagColor: '#059669', desc: 'Weekly AI report on your ideas, themes, and top priorities. Like a personal coach who actually remembers everything you told it.', bg: 'linear-gradient(135deg, #f0fdf4, #d1fae5)', border: 'rgba(16,185,129,0.15)' },
              { emoji: '📊', title: 'Instant Spreadsheets', tag: 'Save Hours', tagBg: '#fef3c7', tagColor: '#d97706', desc: 'Ask for a content calendar and get a real, downloadable Excel file in seconds. No templates, no setup — just ask in plain English.', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: 'rgba(245,158,11,0.15)' },
              { emoji: '🎬', title: 'Video Analysis', tag: 'Premium', tagBg: '#fce7f3', tagColor: '#db2777', desc: 'Paste any YouTube URL — get 12+ content hooks, ideas, hashtags, and a full strategy pulled from that video. Instantly.', bg: 'linear-gradient(135deg, #fdf4ff, #fce7f3)', border: 'rgba(236,72,153,0.15)' },
              { emoji: '⚡', title: 'Content Tools', tag: 'Creator Tools', tagBg: '#dbeafe', tagColor: '#1d4ed8', desc: 'Caption writer, hashtag generator, and hook creator in one place. Built for creators who post every day and need to move fast.', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: 'rgba(59,130,246,0.15)' },
              { emoji: '💡', title: 'Ideas Library', tag: 'Never Lose Ideas', tagBg: '#ede9fe', tagColor: '#7c3aed', desc: 'Every idea you save lives here permanently. Click any idea to get an AI deep dive with specific, actionable next steps.', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: 'rgba(124,58,237,0.15)' },
            ].map((f, i) => (
              <div key={i} className="feat-card" style={{ background: f.bg, border: `1.5px solid ${f.border}` }}>
                <div className="feat-card-inner">
                  <div style={{ marginBottom: '14px' }} aria-hidden="true">{featureMockups[i]}</div>
                  <span className="feat-tag" style={{ background: f.tagBg, color: f.tagColor }}>{f.tag}</span>
                  <div className="feat-title">{f.title}</div>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEMO ─── */}
      <section className="demo-section">
        <div className="demo-inner">
          <div className="demo-grid">
            <div>
              <p className="section-eyebrow">See it in action</p>
              <h3 className="demo-h">From messy dump<br />to <em>done in 20 seconds.</em></h3>
              <p className="demo-p">Type whatever&apos;s on your mind. Clarity asks a few smart questions, then turns your chaos into real, downloadable output — no copy-pasting, no reformatting.</p>
              <button style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'all 0.2s ease' }} onClick={() => router.push('/login')}>
                Try it free →
              </button>
            </div>
            <div className="demo-chat" role="region" aria-label="Chat demo">
              <div className="chat-bubble-user">
                <div>I want to grow my TikTok fitness page. Ideas?</div>
              </div>
              <div className="chat-bubble-ai">
                <div className="chat-avatar" aria-hidden="true">✦</div>
                <div>
                  <strong>Here&apos;s your growth plan:</strong><br />
                  • Post 4x/week — Mon, Wed, Fri, Sun<br />
                  • 60% educational, 40% personal<br />
                  • Best time: 6–8pm your timezone
                </div>
              </div>
              <div className="chat-output">
                <div style={{ fontSize: '20px' }} aria-hidden="true">📊</div>
                <div>
                  <div className="chat-output-text">Content Calendar — Ready to Download</div>
                  <div className="chat-output-sub">Fitness Creator Growth Plan · June 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <p className="section-eyebrow">Real creators. Real results.</p>
          <h2 className="section-h2">They stopped losing ideas.<br /><em>So can you.</em></h2>
          <div className="testimonials-grid">
            {[
              {
                stars: '★★★★★',
                quote: '"I had 47 voice memos I never listened to. I pasted them all into Clarity and had a 4-week content calendar downloaded in under 20 minutes. Actually insane."',
                name: 'Maya T.',
                handle: 'TikTok fitness creator · 52K followers',
                initials: 'M',
                bg: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              },
              {
                stars: '★★★★★',
                quote: '"I used to lose 3–4 video ideas per week. Now everything goes straight into Clarity. I haven\'t run out of content in two months. Absolute game changer."',
                name: 'Jake R.',
                handle: 'YouTube tech reviewer · 28K subs',
                initials: 'J',
                bg: 'linear-gradient(135deg, #059669, #34d399)',
              },
              {
                stars: '★★★★★',
                quote: '"The video analysis feature is worth the price alone. I pasted 3 competitor videos and had 30 content ideas ready in 5 minutes. I use it every single week."',
                name: 'Nina K.',
                handle: 'Lifestyle creator · 31K Instagram',
                initials: 'N',
                bg: 'linear-gradient(135deg, #db2777, #f472b6)',
              },
            ].map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars" aria-label="5 stars">{t.stars}</div>
                <p className="testi-quote">{t.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.bg }} aria-hidden="true">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-handle">{t.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="compare-section">
        <div className="compare-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Why Clarity</p>
          <h2 className="section-h2" style={{ textAlign: 'center' }}>Not just another <em>notes app.</em></h2>
          <table className="compare-table" role="table" aria-label="Feature comparison">
            <thead className="compare-thead">
              <tr>
                <th scope="col" style={{ textAlign: 'left', width: '36%' }}>Feature</th>
                <th scope="col" className="compare-col-highlight">✦ Clarity</th>
                <th scope="col">Notes App</th>
                <th scope="col">ChatGPT</th>
              </tr>
            </thead>
            <tbody className="compare-tbody">
              {[
                ['Organizes automatically', true, false, false],
                ['Remembers your ideas', true, true, false],
                ['Generates real files', true, false, false],
                ['Asks smart follow-ups', true, false, 'partial'],
                ['Built for creators', true, false, false],
                ['Tracks your growth', true, false, false],
                ['Free to start', true, true, true],
              ].map(([label, clarity, notes, gpt], i) => (
                <tr key={i}>
                  <td>{label}</td>
                  <td className="compare-clarity-col">{clarity === true ? <span className="compare-yes" aria-label="Yes">✓</span> : <span className="compare-no" aria-label="No">—</span>}</td>
                  <td>{notes === true ? <span className="compare-yes" aria-label="Yes">✓</span> : notes === 'partial' ? <span className="compare-partial">Partial</span> : <span className="compare-no" aria-label="No">—</span>}</td>
                  <td>{gpt === true ? <span className="compare-yes" aria-label="Yes">✓</span> : gpt === 'partial' ? <span className="compare-partial">Partial</span> : <span className="compare-no" aria-label="No">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── QUOTE / STATS ─── */}
      <section className="quote-section">
        <div className="quote-blob qb1" aria-hidden="true" />
        <div className="quote-blob qb2" aria-hidden="true" />
        <div className="quote-inner-wrap">
          <div className="quote-emoji" aria-hidden="true">💬</div>
          <h2 className="quote-text">&ldquo;ChatGPT forgets you.<br /><em>Clarity grows with you.&rdquo;</em></h2>
          <p className="quote-sub">Your AI that remembers every idea, tracks your growth over time,<br />and turns scattered thoughts into real action — every single week.</p>
          <div className="quote-stats" role="list">
            {[{ num: '2.4K+', label: 'Active creators' }, { num: '7 days', label: 'To see real results' }, { num: '1 app', label: 'For everything' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }} role="listitem">
                <div className="qs-num">{s.num}</div>
                <div className="qs-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="pricing-section">
        <div className="pricing-inner">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="pricing-h">Start free.<br /><em>Upgrade when ready.</em></h2>
          <p className="pricing-sub">No hidden fees. No contracts. Cancel or switch plans anytime.</p>

          {/* Annual/monthly toggle */}
          <div className="toggle-wrap">
            <span className={`toggle-label ${!annual ? 'active' : ''}`}>Monthly</span>
            <button
              className={`toggle-track ${annual ? 'on' : ''}`}
              onClick={() => setAnnual(a => !a)}
              aria-pressed={annual}
              aria-label="Toggle annual billing"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={`toggle-label ${annual ? 'active' : ''}`}>Annual</span>
            {annual && <span className="save-badge">Save 25%</span>}
          </div>

          <div className="pricing-cards">
            {[
              {
                name: 'Free',
                price: '$0',
                period: '',
                desc: 'Everything you need to get started',
                features: ['5 AI messages per day', 'Dashboard & ideas library', 'AI brain dump', 'Spreadsheet downloads'],
                btn: 'Get started free',
                featured: false,
              },
              {
                name: 'Pro',
                price: annual ? `$${proAnnual}` : `$${proMonthly}`,
                period: '/mo',
                desc: 'For creators who are serious about growth',
                features: ['Unlimited AI messages', 'Clarity Score weekly report', 'Spreadsheet & calendar generator', 'Content brief & post schedule', 'Content tools (captions, hooks, hashtags)'],
                btn: 'Start Pro',
                featured: true,
              },
              {
                name: 'Premium',
                price: annual ? `$${premiumAnnual}` : `$${premiumMonthly}`,
                period: '/mo',
                desc: 'For power users who want everything',
                features: ['Everything in Pro', 'Video analysis (any YouTube URL)', 'Unlimited AI + priority responses', 'Advanced content docs', 'Early access to new features'],
                btn: 'Start Premium',
                featured: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`price-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="price-badge">⭐ MOST POPULAR</div>}
                <div className="price-tier" style={{ color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--gray)' }}>{plan.name}</div>
                <div className="price-amount" style={{ color: plan.featured ? 'white' : 'var(--text)' }}>
                  {plan.price}
                  <span className="price-period" style={{ color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--gray)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{plan.period}</span>
                </div>
                <div className="price-desc" style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--gray)' }}>{plan.desc}</div>
                <ul className="price-features" role="list">
                  {plan.features.map(f => (
                    <li key={f} style={{ color: plan.featured ? 'rgba(255,255,255,0.82)' : '#444' }} role="listitem">
                      <span style={{ color: plan.featured ? '#34d399' : 'var(--mint)', fontWeight: '800' }} aria-hidden="true">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="price-btn"
                  style={{ background: plan.featured ? 'white' : 'var(--purple)', color: plan.featured ? 'var(--purple)' : 'white' }}
                  onClick={() => router.push('/login')}
                  aria-label={`${plan.btn} — ${plan.name} plan`}
                >
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="faq-section">
        <div className="faq-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>FAQ</p>
          <h2 className="section-h2" style={{ textAlign: 'center', marginBottom: '0' }}>
            Questions? We&apos;ve got <em>answers.</em>
          </h2>
          <div className="faq-list" role="list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${activeFaq === i ? 'open' : ''}`}
                role="listitem"
              >
                <button
                  className="faq-q"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-chevron" aria-hidden="true">▾</span>
                </button>
                {activeFaq === i && (
                  <div id={`faq-answer-${i}`} className="faq-a" role="region">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-blob1" aria-hidden="true" />
        <div className="cta-blob2" aria-hidden="true" />
        <div className="cta-inner">
          <p className="cta-eyebrow">Start today</p>
          <h2 className="cta-h" id="cta-heading">
            Your best ideas are<br />worth more than <em>a voice memo.</em>
          </h2>
          <p className="cta-p">
            Join 2,400+ creators who turned their scattered thoughts into real action. Free to start. No credit card. No excuses.
          </p>
          <button className="btn-cta" onClick={() => router.push('/login')}>
            Organize my ideas free →
          </button>
          <div className="cta-guarantee">
            <span aria-hidden="true">🔒</span>
            Free forever plan · No credit card required · Cancel paid plans anytime
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="about" className="footer" role="contentinfo">
        <div className="footer-logo">✦ Clarity</div>
        <div className="footer-copy">© 2026 Clarity. All rights reserved.</div>
        <nav className="footer-links" aria-label="Footer navigation">
          <button onClick={() => router.push('/privacy')}>Privacy</button>
          <button onClick={() => router.push('/terms')}>Terms</button>
          <button onClick={() => router.push('/contact')}>Contact</button>
        </nav>
      </footer>
    </>
  )
}