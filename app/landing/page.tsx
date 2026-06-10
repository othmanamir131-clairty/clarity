'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// ============================================================
// OPTION 3 — "GRADIENT DREAM"
// Vibe: Rich purple → teal gradient hero, glassmorphism cards,
// animated mesh background, alive and vibrant creator energy.
// Feels like a premium creator tool — Notion x Figma x Loom.
// ============================================================

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    const interval = setInterval(() => setActiveFeature(f => (f + 1) % 6), 3000)
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(interval); }
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const featureMockups = [
    // AI Brain Dump — mini chat interface
    <div key="m0" style={{ background: 'rgba(124,58,237,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', borderRadius: '10px 10px 2px 10px', padding: '5px 9px', fontSize: '9px', color: 'white', fontWeight: '600', maxWidth: '80%' }}>
          I want to grow my TikTok...
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: '800' }}>✦</div>
        <div style={{ background: 'white', borderRadius: '2px 10px 10px 10px', padding: '5px 8px', fontSize: '8px', color: '#4c1d95', fontWeight: '600', border: '1px solid rgba(124,58,237,0.12)', flex: 1, lineHeight: 1.5 }}>
          Here's your growth plan:<br />
          <span style={{ color: '#7c3aed' }}>• Post 4x/week</span> · Best time 6–8pm
        </div>
      </div>
    </div>,

    // Clarity Score — score widget
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

    // Spreadsheets — mini table
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

    // Video Analysis — player + stats
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

    // Content Tools — caption writer
    <div key="m4" style={{ background: 'rgba(59,130,246,0.07)', borderRadius: '12px', padding: '10px', height: '88px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {['Caption', 'Hook', '#Tags'].map((t, i) => (
          <div key={i} style={{ background: i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.12)', borderRadius: '100px', padding: '2px 8px', fontSize: '8px', fontWeight: '700', color: i === 0 ? 'white' : '#1d4ed8' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '6px', padding: '6px 8px', border: '1px solid rgba(59,130,246,0.15)', fontSize: '8px', color: '#374151', lineHeight: 1.5, flex: 1 }}>
        Ready to level up your fitness game? 💪 Here's why consistency beats intensity...
      </div>
    </div>,

    // Ideas Library — card grid
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); }

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
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes floatReverse {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(14px); }
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
        @keyframes borderSpin {
          to { transform: rotate(360deg); }
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 4rem;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(248,246,255,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--purple), var(--mint));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
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

        /* HERO */
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

        /* Mesh blobs */
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
          font-size: 13px; color: rgba(255,255,255,0.85);
          font-weight: 600; margin-bottom: 2.5rem;
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
          font-size: 80px; font-weight: 800;
          line-height: 1.0; letter-spacing: -4px;
          color: white; margin-bottom: 1.75rem;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.1s both;
          text-shadow: 0 2px 40px rgba(0,0,0,0.3);
        }
        .hero-h1 em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: 19px; color: rgba(255,255,255,0.7);
          line-height: 1.75; max-width: 560px;
          margin: 0 auto 2.75rem;
          position: relative; z-index: 2;
          animation: fadeUp 0.7s ease 0.2s both;
        }
        .hero-sub strong { color: white; }
        .hero-btns {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 2rem;
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
        .btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(0,0,0,0.25); }
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
        .hero-note { font-size: 13px; color: rgba(255,255,255,0.4); position: relative; z-index: 2; animation: fadeUp 0.7s ease 0.4s both; }

        /* FLOATING GLASS CARDS in hero */
        .hero-cards {
          display: flex; gap: 20px; margin-top: 4rem;
          flex-wrap: wrap; justify-content: center;
          position: relative; z-index: 2;
        }
        .glass-card {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px; padding: 14px 20px;
          backdrop-filter: blur(12px);
          font-size: 14px; color: white; font-weight: 600;
          display: flex; align-items: center; gap: 8px;
          transition: all 0.2s ease;
        }
        .glass-card:hover { background: rgba(255,255,255,0.18); transform: translateY(-3px); }
        .glass-card.active-card {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.4);
          animation: featurePop 0.4s ease forwards;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        /* WAVE DIVIDER */
        .wave-divider { background: var(--bg); }

        /* FEATURES SECTION */
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
        .feat-emoji { font-size: 36px; margin-bottom: 14px; }
        .feat-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
        .feat-title { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; margin-bottom: 10px; }
        .feat-desc { font-size: 14px; color: var(--gray); line-height: 1.7; }

        /* DEMO SECTION */
        .demo-section { background: white; padding: 7rem 4rem; }
        .demo-inner { max-width: 900px; margin: 0 auto; }
        .demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .demo-text { }
        .demo-h { font-size: 44px; font-weight: 800; color: var(--text); letter-spacing: -2px; line-height: 1.1; margin-bottom: 1.25rem; }
        .demo-h em { font-style: italic; color: var(--purple); }
        .demo-p { font-size: 16px; color: var(--gray); line-height: 1.75; margin-bottom: 2rem; }
        .demo-chat {
          background: var(--bg); border-radius: 20px;
          padding: 1.5rem; border: 1.5px solid var(--border);
          box-shadow: 0 8px 40px rgba(124,58,237,0.08);
          animation: glow 4s ease-in-out infinite;
        }
        .chat-bubble-user {
          display: flex; justify-content: flex-end; margin-bottom: 14px;
        }
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
        .chat-output-icon { font-size: 20px; }
        .chat-output-text { font-size: 13px; font-weight: 700; color: var(--purple); }
        .chat-output-sub { font-size: 11px; color: rgba(124,58,237,0.6); }

        /* QUOTE */
        .quote-section {
          padding: 8rem 4rem; text-align: center;
          background: linear-gradient(135deg, var(--purple-deep), #1e1b4b, #0f172a);
          position: relative; overflow: hidden;
        }
        .quote-blob { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }
        .qb1 { width: 400px; height: 400px; top: -100px; left: -100px; background: var(--purple-mid); opacity: 0.15; }
        .qb2 { width: 350px; height: 350px; bottom: -100px; right: -100px; background: var(--mint); opacity: 0.12; }
        .quote-inner-wrap { max-width: 800px; margin: 0 auto; position: relative; z-index: 2; }
        .quote-emoji { font-size: 60px; margin-bottom: 1.5rem; }
        .quote-text { font-size: 48px; font-weight: 800; color: white; line-height: 1.15; letter-spacing: -2px; margin-bottom: 1.5rem; }
        .quote-text em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .quote-sub { font-size: 18px; color: rgba(255,255,255,0.45); line-height: 1.7; margin-bottom: 3.5rem; }
        .quote-stats { display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap; }
        .qs-num { font-size: 48px; font-weight: 800; color: white; letter-spacing: -2px; }
        .qs-label { font-size: 14px; color: rgba(255,255,255,0.35); margin-top: 4px; }

        /* PRICING */
        .pricing-section { background: var(--bg); padding: 7rem 4rem; }
        .pricing-inner { max-width: 980px; margin: 0 auto; }
        .pricing-h { font-size: 52px; font-weight: 800; color: var(--text); letter-spacing: -2.5px; margin-bottom: 1rem; }
        .pricing-h em { font-style: italic; color: var(--purple); }
        .pricing-sub { font-size: 17px; color: var(--gray); margin-bottom: 4rem; }
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

        /* CTA */
        .cta-section { background: white; padding: 8rem 4rem; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 800px; height: 300px; background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%); pointer-events: none; }
        .cta-h { font-size: 60px; font-weight: 800; color: var(--text); letter-spacing: -3px; line-height: 1.05; margin-bottom: 1.5rem; }
        .cta-h em { font-style: italic; color: var(--purple); }
        .cta-p { font-size: 18px; color: var(--gray); line-height: 1.7; margin-bottom: 2.5rem; max-width: 520px; margin-left: auto; margin-right: auto; }
        .cta-note { margin-top: 1.25rem; font-size: 13px; color: #ccc; }

        .btn-cta {
          background: linear-gradient(135deg, var(--purple), var(--purple-mid));
          color: white; border: none; border-radius: 100px;
          padding: 20px 52px; font-size: 18px; font-weight: 800;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          box-shadow: 0 8px 32px rgba(124,58,237,0.35);
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 40px rgba(124,58,237,0.45); }

        /* FOOTER */
        .footer { background: var(--text); padding: 2.5rem 4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #a78bfa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-links { display: flex; gap: 1.5rem; font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: white; }

        @media (max-width: 900px) {
          .nav {
            padding: 1rem 1.5rem;
            flex-direction: column;
            gap: 1rem;
          }
          .nav-pill {
            display: none;
          }
          .nav-login {
            display: none;
          }
          .hero-wrap {
            padding: 5rem 1.5rem 3rem;
            min-height: auto;
          }
          .hero-h1 {
            font-size: 36px;
            letter-spacing: -1.5px;
            line-height: 1.1;
          }
          .hero-sub {
            font-size: 16px;
            max-width: 100%;
          }
          .hero-btns {
            gap: 10px;
          }
          .btn-hero-primary {
            padding: 14px 28px;
            font-size: 15px;
            width: 100%;
          }
          .btn-hero-ghost {
            padding: 14px 28px;
            font-size: 15px;
            width: 100%;
          }
          .hero-cards {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
          }
          .glass-card {
            justify-content: center;
            width: 100%;
          }
          .features-section {
            padding: 4rem 1.5rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .section-h2 {
            font-size: 32px;
            letter-spacing: -1px;
            margin-bottom: 2rem;
          }
          .feat-card {
            padding: 1.5rem;
          }
          .feat-title {
            font-size: 18px;
          }
          .demo-section {
            padding: 4rem 1.5rem;
          }
          .demo-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .demo-h {
            font-size: 28px;
          }
          .demo-chat {
            padding: 1rem;
          }
          .quote-section {
            padding: 4rem 1.5rem;
          }
          .quote-text {
            font-size: 32px;
          }
          .quote-stats {
            gap: 2rem;
          }
          .qs-num {
            font-size: 36px;
          }
          .pricing-section {
            padding: 4rem 1.5rem;
          }
          .pricing-h {
            font-size: 32px;
            letter-spacing: -1px;
            margin-bottom: 0.5rem;
          }
          .pricing-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .price-card {
            padding: 1.75rem;
          }
          .price-amount {
            font-size: 42px;
          }
          .price-btn {
            padding: 12px;
            font-size: 14px;
          }
          .cta-section {
            padding: 4rem 1.5rem;
          }
          .cta-h {
            font-size: 32px;
            letter-spacing: -1px;
            margin-bottom: 1rem;
          }
          .cta-p {
            font-size: 16px;
          }
          .btn-cta {
            padding: 16px 32px;
            font-size: 16px;
            width: 100%;
          }
          .footer {
            padding: 2rem 1.5rem;
            flex-direction: column;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .nav {
            padding: 0.75rem 1rem;
          }
          .nav-logo {
            font-size: 18px;
          }
          .nav-cta {
            padding: 8px 16px;
            font-size: 13px;
          }
          .hero-wrap {
            padding: 3rem 1rem 2rem;
          }
          .hero-badge {
            font-size: 11px;
            padding: 5px 14px;
            margin-bottom: 1.5rem;
          }
          .hero-h1 {
            font-size: 28px;
            letter-spacing: -1px;
            margin-bottom: 1.25rem;
          }
          .hero-sub {
            font-size: 14px;
            margin-bottom: 1.5rem;
          }
          .hero-btns {
            flex-direction: column;
            width: 100%;
          }
          .btn-hero-primary,
          .btn-hero-ghost {
            width: 100%;
            padding: 12px 20px;
            font-size: 14px;
          }
          .hero-cards {
            gap: 8px;
          }
          .glass-card {
            font-size: 12px;
            padding: 10px 14px;
          }
          .features-section {
            padding: 2.5rem 1rem;
          }
          .section-eyebrow {
            font-size: 11px;
          }
          .section-h2 {
            font-size: 24px;
            margin-bottom: 1.5rem;
          }
          .feat-emoji {
            font-size: 28px;
          }
          .feat-title {
            font-size: 16px;
          }
          .feat-desc {
            font-size: 13px;
          }
          .demo-section {
            padding: 2.5rem 1rem;
          }
          .demo-h {
            font-size: 24px;
            margin-bottom: 1rem;
          }
          .demo-p {
            font-size: 14px;
          }
          .quote-section {
            padding: 2.5rem 1rem;
          }
          .quote-emoji {
            font-size: 48px;
            margin-bottom: 1rem;
          }
          .quote-text {
            font-size: 24px;
            margin-bottom: 1rem;
          }
          .quote-sub {
            font-size: 14px;
            margin-bottom: 2rem;
          }
          .quote-stats {
            gap: 1.5rem;
            flex-direction: column;
          }
          .qs-num {
            font-size: 28px;
          }
          .pricing-section {
            padding: 2.5rem 1rem;
          }
          .pricing-h {
            font-size: 24px;
            margin-bottom: 0.5rem;
          }
          .pricing-sub {
            font-size: 14px;
            margin-bottom: 2rem;
          }
          .price-amount {
            font-size: 36px;
          }
          .price-period {
            font-size: 14px;
          }
          .price-desc {
            font-size: 13px;
          }
          .price-features li {
            font-size: 13px;
          }
          .cta-section {
            padding: 2.5rem 1rem;
          }
          .cta-h {
            font-size: 24px;
            margin-bottom: 0.75rem;
          }
          .cta-p {
            font-size: 14px;
            margin-bottom: 1.5rem;
          }
          .btn-cta {
            padding: 14px 24px;
            font-size: 14px;
            width: 100%;
          }
          .footer {
            padding: 1.5rem 1rem;
            font-size: 12px;
          }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">✦ Clarity</div>
        <div className="nav-pill">
          <button className="nav-pill-btn" onClick={() => scrollToSection('product')}>Product</button>
          <button className="nav-pill-btn" onClick={() => scrollToSection('pricing')}>Pricing</button>
          <button className="nav-pill-btn" onClick={() => scrollToSection('about')}>About</button>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="nav-login" onClick={() => router.push('/login')}>Log in</button>
          <button className="nav-cta" onClick={() => router.push('/login')}>Get started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-wrap">
        <div className="mesh-blob mb1"></div>
        <div className="mesh-blob mb2"></div>
        <div className="mesh-blob mb3"></div>

        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          AI-powered organization for creators
        </div>

        <h1 className="hero-h1">
          Stop losing your<br />
          <em>best ideas.</em>
        </h1>

        <p className="hero-sub">
          Dump your thoughts into Clarity. The AI organizes everything and turns it into <strong>action plans, content calendars, and spreadsheets</strong> — instantly.
        </p>

        <div className="hero-btns">
          <button className="btn-hero-primary" onClick={() => router.push('/login')}>
            Start for free →
          </button>
          <button className="btn-hero-ghost" onClick={() => router.push('/login')}>
            See how it works
          </button>
        </div>
        <p className="hero-note">Free forever · No credit card · Takes 30 seconds</p>

        <div className="hero-cards">
          {features.map((f, i) => (
            <div key={i} className={`glass-card ${i === activeFeature ? 'active-card' : ''}`}>
              <span>{f.emoji}</span>
              <span>{f.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="product" className="features-section">
        <div className="features-inner">
          <p className="section-eyebrow">What's inside</p>
          <h2 className="section-h2">Six tools built for<br />creators who think <em>fast.</em></h2>
          <div className="features-grid">
            {[
              { emoji: '🧠', title: 'AI Brain Dump', tag: 'Core', tagBg: '#ede9fe', tagColor: '#7c3aed', desc: 'Type anything — messy thoughts, big goals, random ideas. The AI organizes it all instantly. No folders, no friction.', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: 'rgba(124,58,237,0.15)' },
              { emoji: '✨', title: 'Clarity Score', tag: 'Unique', tagBg: '#d1fae5', tagColor: '#059669', desc: 'Weekly AI report on your ideas, themes, and top priorities. Like a personal coach that actually knows your goals.', bg: 'linear-gradient(135deg, #f0fdf4, #d1fae5)', border: 'rgba(16,185,129,0.15)' },
              { emoji: '📊', title: 'Instant Spreadsheets', tag: 'Save Time', tagBg: '#fef3c7', tagColor: '#d97706', desc: 'Ask for a content calendar and download a real Excel file in seconds. No templates, no setup — just ask.', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: 'rgba(245,158,11,0.15)' },
              { emoji: '🎬', title: 'Video Analysis', tag: 'Premium', tagBg: '#fce7f3', tagColor: '#db2777', desc: 'Paste any YouTube URL — get hooks, content ideas, hashtags, and a full strategy pulled from that video instantly.', bg: 'linear-gradient(135deg, #fdf4ff, #fce7f3)', border: 'rgba(236,72,153,0.15)' },
              { emoji: '⚡', title: 'Content Tools', tag: 'Creator Tools', tagBg: '#dbeafe', tagColor: '#1d4ed8', desc: 'Caption writer, hashtag generator, and hook creator — three powerful AI tools for creators who post daily.', bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: 'rgba(59,130,246,0.15)' },
              { emoji: '💡', title: 'Ideas Library', tag: 'Never Lose Ideas', tagBg: '#ede9fe', tagColor: '#7c3aed', desc: 'Every idea you save lives here forever. Click any idea and get an AI deep dive with actionable next steps.', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', border: 'rgba(124,58,237,0.15)' },
            ].map((f, i) => (
              <div key={i} className="feat-card" style={{ background: f.bg, border: `1.5px solid ${f.border}` }}>
                <div className="feat-card-inner">
                  <div style={{ marginBottom: '14px' }}>{featureMockups[i]}</div>
                  <span className="feat-tag" style={{ background: f.tagBg, color: f.tagColor }}>{f.tag}</span>
                  <div className="feat-title">{f.title}</div>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="demo-section">
        <div className="demo-inner">
          <div className="demo-grid">
            <div className="demo-text">
              <p className="section-eyebrow" style={{ marginBottom: '1rem' }}>See it in action</p>
              <h3 className="demo-h">From dump to<br /><em>done in seconds.</em></h3>
              <p className="demo-p">You type what's on your mind. Clarity handles the rest — asking smart follow-up questions, then turning your thoughts into real, downloadable outputs.</p>
              <button style={{ background: 'var(--purple)', color: 'white', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }} onClick={() => router.push('/login')}>
                Try it free →
              </button>
            </div>
            <div className="demo-chat">
              <div className="chat-bubble-user">
                <div>I want to grow my TikTok fitness page. Ideas?</div>
              </div>
              <div className="chat-bubble-ai">
                <div className="chat-avatar">✦</div>
                <div>
                  <strong>Here's your growth plan:</strong><br />
                  • Post 4x/week — Mon, Wed, Fri, Sun<br />
                  • 60% educational, 40% personal<br />
                  • Best time: 6-8pm your timezone
                </div>
              </div>
              <div className="chat-output">
                <div className="chat-output-icon">📊</div>
                <div>
                  <div className="chat-output-text">Content Calendar — Ready to Download</div>
                  <div className="chat-output-sub">Fitness Creator Growth Plan · June 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <div className="quote-blob qb1"></div>
        <div className="quote-blob qb2"></div>
        <div className="quote-inner-wrap">
          <div className="quote-emoji">💬</div>
          <h2 className="quote-text">"ChatGPT forgets you.<br /><em>Clarity grows with you."</em></h2>
          <p className="quote-sub">Your AI that remembers every idea, tracks your growth over time,<br />and helps you turn scattered thoughts into real action.</p>
          <div className="quote-stats">
            {[{ num: '∞', label: 'Ideas saved forever' }, { num: '7d', label: 'To see results' }, { num: '1', label: 'App for everything' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="qs-num">{s.num}</div>
                <div className="qs-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <div className="pricing-inner">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="pricing-h">Start free.<br /><em>Upgrade when ready.</em></h2>
          <p className="pricing-sub">No hidden fees. Cancel anytime. Switch plans whenever.</p>
          <div className="pricing-cards">
            {[
              { name: 'Free', price: '$0', period: '', desc: 'Perfect to get started', features: ['Basic AI organizing', '5 ideas per day', 'Dashboard access', 'Ideas library'], btn: 'Get started free', featured: false },
              { name: 'Pro', price: '$29.99', period: '/mo', desc: 'For serious creators', features: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Clarity Score', 'Content tools', 'Daily Focus'], btn: 'Start Pro', featured: true },
              { name: 'Premium', price: '$59.99', period: '/mo', desc: 'For power users', features: ['Everything in Pro', 'Video analysis', 'AI Content Brief', 'Posting Schedule', 'Priority support'], btn: 'Start Premium', featured: false },
            ].map(plan => (
              <div key={plan.name} className={`price-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="price-badge">⭐ MOST POPULAR</div>}
                <div className="price-tier" style={{ color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--gray)' }}>{plan.name}</div>
                <div className="price-amount" style={{ color: plan.featured ? 'white' : 'var(--text)' }}>
                  {plan.price}<span className="price-period" style={{ color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--gray)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{plan.period}</span>
                </div>
                <div className="price-desc" style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--gray)' }}>{plan.desc}</div>
                <ul className="price-features">
                  {plan.features.map(f => (
                    <li key={f} style={{ color: plan.featured ? 'rgba(255,255,255,0.8)' : '#444' }}>
                      <span style={{ color: plan.featured ? '#34d399' : 'var(--mint)', fontWeight: '800' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="price-btn" style={{ background: plan.featured ? 'white' : 'var(--purple)', color: plan.featured ? 'var(--purple)' : 'white' }} onClick={() => router.push('/login')}>
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow"></div>
        <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="cta-h">Your ideas deserve<br />more than <em>a notes app.</em></h2>
          <p className="cta-p">Join Clarity and turn your scattered thoughts into real action — starting today.</p>
          <button className="btn-cta" onClick={() => router.push('/login')}>Get started for free →</button>
          <p className="cta-note">No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="footer">
        <div className="footer-logo">✦ Clarity</div>
        <div className="footer-copy">© 2026 Clarity. All rights reserved.</div>
        <div className="footer-links">
          <span onClick={() => router.push('/privacy')}>Privacy</span>
          <span onClick={() => router.push('/terms')}>Terms</span>
          <span onClick={() => router.push('/contact')}>Contact</span>
        </div>
      </footer>
    </>
  )
}
