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
          .hero-h1 { font-size: 48px; letter-spacing: -2.5px; }
          .nav { padding: 1rem 1.5rem; }
          .nav-pill { display: none; }
          .features-section { padding: 5rem 1.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .section-h2 { font-size: 36px; letter-spacing: -1.5px; }
          .demo-section { padding: 5rem 1.5rem; }
          .demo-grid { grid-template-columns: 1fr; }
          .demo-h { font-size: 32px; }
          .quote-section { padding: 5rem 1.5rem; }
          .quote-text { font-size: 36px; }
          .pricing-section { padding: 5rem 1.5rem; }
          .pricing-h { font-size: 36px; }
          .pricing-cards { grid-template-columns: 1fr; }
          .cta-section { padding: 5rem 1.5rem; }
          .cta-h { font-size: 40px; }
          .footer { padding: 2rem 1.5rem; }
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
                  <div className="feat-emoji">{f.emoji}</div>
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
