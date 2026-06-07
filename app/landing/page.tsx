'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// ============================================================
// OPTION 2 — "BOLD & ELECTRIC"
// Vibe: Pure white background, GIANT black headings,
// electric purple/mint accent pops, very Vercel/Stripe energy.
// Feels powerful, authoritative, and modern.
// ============================================================

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    // Animated counter
    const interval = setInterval(() => {
      setCount(c => { if (c >= 2847) { clearInterval(interval); return 2847; } return c + 37; })
    }, 20)
    return () => { window.removeEventListener('scroll', handleScroll); clearInterval(interval); }
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --white: #ffffff;
          --off-white: #f9f9f9;
          --black: #0a0a0a;
          --purple: #7c3aed;
          --purple-light: #ede9fe;
          --mint: #10b981;
          --mint-light: #d1fae5;
          --pink: #ec4899;
          --gray: #6b7280;
          --border: #e5e7eb;
        }
        body { font-family: 'Inter', sans-serif; background: var(--white); color: var(--black); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes dotPulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 4rem;
          transition: all 0.3s ease;
        }
        .nav.scrolled {
          background: rgba(255,255,255,0.94);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--black); letter-spacing: -0.5px; }
        .nav-links { display: flex; gap: 2.5rem; font-size: 14px; color: var(--gray); font-weight: 500; }
        .nav-links span { cursor: pointer; transition: color 0.2s; }
        .nav-links span:hover { color: var(--black); }
        .btn-nav-primary {
          background: var(--black); color: white; border: none;
          border-radius: 6px; padding: 9px 22px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .btn-nav-primary:hover { background: var(--purple); }

        /* HERO */
        .hero-section {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          padding: 10rem 3rem 5rem;
          position: relative; overflow: hidden;
        }
        .hero-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--border); border-radius: 100px;
          padding: 6px 16px; font-size: 13px;
          color: var(--gray); font-weight: 500; margin-bottom: 2.5rem;
          background: white;
          animation: fadeUp 0.6s ease forwards;
        }
        .hero-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--mint); animation: dotPulse 2s ease infinite;
        }
        .hero-h1 {
          font-family: 'Syne', sans-serif;
          font-size: 96px; font-weight: 800;
          line-height: 0.95; letter-spacing: -5px;
          color: var(--black); margin-bottom: 2rem;
          animation: fadeUp 0.7s ease 0.1s both;
          max-width: 900px;
        }
        .hero-h1 .accent { color: var(--purple); }
        .hero-h1 .underline-mint {
          text-decoration: underline;
          text-decoration-color: var(--mint);
          text-underline-offset: 8px;
          text-decoration-thickness: 4px;
        }
        .hero-sub {
          font-size: 19px; color: var(--gray);
          line-height: 1.7; max-width: 540px;
          margin: 0 auto 3rem;
          animation: fadeUp 0.7s ease 0.2s both;
        }
        .hero-sub strong { color: var(--black); }
        .hero-btns {
          display: flex; gap: 14px; justify-content: center;
          flex-wrap: wrap; margin-bottom: 2rem;
          animation: fadeUp 0.7s ease 0.3s both;
        }
        .btn-xl-primary {
          background: var(--black); color: white; border: none;
          border-radius: 8px; padding: 18px 40px;
          font-size: 17px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .btn-xl-primary:hover { background: var(--purple); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.35); }
        .btn-xl-ghost {
          background: white; color: var(--black);
          border: 1.5px solid var(--border);
          border-radius: 8px; padding: 17px 32px;
          font-size: 17px; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .btn-xl-ghost:hover { border-color: var(--black); transform: translateY(-2px); }
        .hero-note { font-size: 13px; color: #bbb; animation: fadeUp 0.7s ease 0.4s both; }

        /* LIVE COUNTER STRIP */
        .counter-strip {
          background: var(--off-white);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 4rem;
          display: flex; align-items: center; justify-content: center;
          gap: 3rem; flex-wrap: wrap;
        }
        .counter-item { text-align: center; }
        .counter-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--black); letter-spacing: -1px; }
        .counter-label { font-size: 13px; color: var(--gray); font-weight: 500; margin-top: 2px; }
        .counter-divider { width: 1px; height: 40px; background: var(--border); }

        /* BENTO GRID */
        .bento { background: var(--off-white); padding: 6rem 4rem; }
        .bento-inner { max-width: 1100px; margin: 0 auto; }
        .bento-label { font-size: 12px; font-weight: 700; color: var(--purple); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        .bento-title { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; color: var(--black); letter-spacing: -2.5px; margin-bottom: 3.5rem; line-height: 1.05; }
        .bento-title span { color: var(--purple); }
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto auto; gap: 16px; }

        .bento-card {
          background: white; border-radius: 20px;
          padding: 2rem; border: 1px solid var(--border);
          transition: all 0.25s ease; overflow: hidden;
          position: relative;
        }
        .bento-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: transparent; }
        .bento-card.tall { grid-row: span 2; }
        .bento-card.accent-purple { background: var(--purple); border-color: var(--purple); }
        .bento-card.accent-mint { background: linear-gradient(135deg, #059669, #10b981); border-color: transparent; }
        .bento-card.accent-dark { background: var(--black); border-color: var(--black); }

        .bento-icon { font-size: 32px; margin-bottom: 14px; }
        .bento-card-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--black); letter-spacing: -0.5px; margin-bottom: 8px; }
        .bento-card.accent-purple .bento-card-title,
        .bento-card.accent-mint .bento-card-title,
        .bento-card.accent-dark .bento-card-title { color: white; }
        .bento-card-desc { font-size: 14px; color: var(--gray); line-height: 1.65; }
        .bento-card.accent-purple .bento-card-desc { color: rgba(255,255,255,0.65); }
        .bento-card.accent-mint .bento-card-desc { color: rgba(255,255,255,0.7); }
        .bento-card.accent-dark .bento-card-desc { color: rgba(255,255,255,0.5); }

        .bento-tag {
          display: inline-block; font-size: 10px; font-weight: 700;
          padding: 3px 10px; border-radius: 100px;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 10px;
        }

        /* QUOTE */
        .quote-belt { background: var(--black); padding: 6rem 4rem; }
        .quote-belt-inner { max-width: 900px; margin: 0 auto; text-align: center; }
        .qb-pre { font-size: 12px; font-weight: 700; color: var(--mint); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1.5rem; }
        .qb-h { font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; color: white; letter-spacing: -2px; line-height: 1.1; margin-bottom: 1.5rem; }
        .qb-h em { font-style: normal; color: var(--mint); }
        .qb-sub { font-size: 18px; color: rgba(255,255,255,0.4); line-height: 1.7; margin-bottom: 3.5rem; }
        .qb-stats { display: flex; justify-content: center; gap: 5rem; flex-wrap: wrap; }
        .qb-stat-num { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; color: white; letter-spacing: -1.5px; }
        .qb-stat-label { font-size: 13px; color: rgba(255,255,255,0.3); margin-top: 4px; }

        /* PRICING */
        .pricing-belt { background: white; padding: 7rem 4rem; }
        .pricing-belt-inner { max-width: 980px; margin: 0 auto; }
        .pricing-hd { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; color: var(--black); letter-spacing: -2.5px; margin-bottom: 1rem; line-height: 1.05; }
        .pricing-hd span { color: var(--purple); }
        .pricing-sub { font-size: 17px; color: var(--gray); margin-bottom: 4rem; }
        .pricing-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .pc {
          border-radius: 20px; padding: 2.25rem;
          border: 1.5px solid var(--border);
          transition: all 0.25s ease; position: relative;
        }
        .pc:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.08); }
        .pc.pc-featured { background: var(--black); border-color: var(--black); box-shadow: 0 20px 56px rgba(0,0,0,0.2); }
        .pc-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--purple); color: white; font-size: 11px; font-weight: 700; padding: 5px 16px; border-radius: 100px; white-space: nowrap; }
        .pc-tier { font-size: 12px; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .pc-featured .pc-tier { color: rgba(255,255,255,0.35); }
        .pc-price { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; color: var(--black); letter-spacing: -2px; line-height: 1; margin-bottom: 4px; }
        .pc-featured .pc-price { color: white; }
        .pc-period { font-size: 16px; font-family: 'Inter', sans-serif; font-weight: 500; color: var(--gray); }
        .pc-featured .pc-period { color: rgba(255,255,255,0.35); }
        .pc-desc { font-size: 14px; color: var(--gray); margin-bottom: 1.75rem; }
        .pc-featured .pc-desc { color: rgba(255,255,255,0.4); }
        .pc-features-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 2rem; }
        .pc-features-list li { font-size: 14px; color: #444; font-weight: 500; display: flex; align-items: center; gap: 10px; }
        .pc-featured .pc-features-list li { color: rgba(255,255,255,0.75); }
        .pc-btn {
          width: 100%; background: var(--black); color: white;
          border: none; border-radius: 8px; padding: 13px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        .pc-btn:hover { background: var(--purple); transform: translateY(-2px); }
        .pc-featured .pc-btn { background: var(--purple); }
        .pc-featured .pc-btn:hover { background: #6d28d9; }
        .pc-features-list li::before { content: '→'; color: var(--mint); font-weight: 800; }
        .pc-featured .pc-features-list li::before { color: var(--mint); }

        /* CTA */
        .cta-belt { background: var(--off-white); padding: 8rem 4rem; text-align: center; }
        .cta-belt-inner { max-width: 680px; margin: 0 auto; }
        .cta-h { font-family: 'Syne', sans-serif; font-size: 64px; font-weight: 800; color: var(--black); letter-spacing: -3px; line-height: 1.03; margin-bottom: 1.5rem; }
        .cta-h span { color: var(--purple); }
        .cta-sub { font-size: 18px; color: var(--gray); line-height: 1.7; margin-bottom: 2.5rem; }
        .cta-note { margin-top: 1.25rem; font-size: 13px; color: #bbb; }

        /* FOOTER */
        .footer { background: var(--black); padding: 2.5rem 4rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: white; }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-links { display: flex; gap: 1.5rem; font-size: 13px; color: rgba(255,255,255,0.3); }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: white; }

        @media (max-width: 900px) {
          .hero-h1 { font-size: 52px; letter-spacing: -2.5px; }
          .nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          .counter-strip { padding: 1.5rem; gap: 1.5rem; }
          .bento { padding: 4rem 1.5rem; }
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card.tall { grid-row: span 1; }
          .bento-title { font-size: 36px; letter-spacing: -1.5px; }
          .quote-belt { padding: 5rem 1.5rem; }
          .qb-h { font-size: 36px; letter-spacing: -1px; }
          .pricing-belt { padding: 5rem 1.5rem; }
          .pricing-row { grid-template-columns: 1fr; }
          .pricing-hd { font-size: 36px; }
          .cta-belt { padding: 5rem 1.5rem; }
          .cta-h { font-size: 40px; letter-spacing: -2px; }
          .footer { padding: 2rem 1.5rem; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">✦ Clarity</div>
        <div className="nav-links">
          <span>Product</span><span>Pricing</span><span>About</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: 'var(--gray)', fontWeight: '500', fontFamily: "'Inter', sans-serif" }}>Log in</button>
          <button className="btn-nav-primary" onClick={() => router.push('/login')}>Get started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-noise"></div>
        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          AI-powered organization for content creators
        </div>
        <h1 className="hero-h1">
          Stop <span className="accent">losing</span><br />
          your <span className="underline-mint">best ideas.</span>
        </h1>
        <p className="hero-sub">
          Dump your thoughts into Clarity. The AI organizes everything and turns it into <strong>action plans, content calendars, and spreadsheets</strong> — instantly.
        </p>
        <div className="hero-btns">
          <button className="btn-xl-primary" onClick={() => router.push('/login')}>Start for free — no card needed</button>
          <button className="btn-xl-ghost" onClick={() => router.push('/login')}>See features ↓</button>
        </div>
        <p className="hero-note">Free forever plan · Takes 30 seconds to set up</p>
      </section>

      {/* COUNTER STRIP */}
      <div className="counter-strip">
        {[
          { num: `${count.toLocaleString()}+`, label: 'Ideas organized' },
          { num: '6', label: 'AI-powered tools' },
          { num: '< 5s', label: 'To generate a plan' },
          { num: '100%', label: 'Built for creators' },
        ].map((item, i) => (
          <>
            <div key={item.label} className="counter-item">
              <div className="counter-num">{item.num}</div>
              <div className="counter-label">{item.label}</div>
            </div>
            {i < 3 && <div key={`div-${i}`} className="counter-divider"></div>}
          </>
        ))}
      </div>

      {/* BENTO GRID */}
      <section className="bento">
        <div className="bento-inner">
          <p className="bento-label">What's inside</p>
          <h2 className="bento-title">Six tools.<br />One <span>place.</span></h2>
          <div className="bento-grid">
            <div className="bento-card accent-purple tall">
              <div className="bento-icon">🧠</div>
              <div className="bento-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>CORE</div>
              <div className="bento-card-title">AI Brain Dump</div>
              <div className="bento-card-desc">Type anything — messy thoughts, random ideas, big goals. The AI organizes it all instantly. No folders, no structure needed.</div>
              <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Example</div>
                <div style={{ fontSize: '14px', color: 'white', fontWeight: '600', lineHeight: '1.5' }}>"I need a content calendar for my fitness TikTok, posting 4x/week, targeting 18-25 year olds"</div>
              </div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">✨</div>
              <div className="bento-tag" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>UNIQUE</div>
              <div className="bento-card-title">Clarity Score</div>
              <div className="bento-card-desc">Weekly AI report on your ideas, themes, and top priorities. Your personal coach that actually knows your goals.</div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">📊</div>
              <div className="bento-tag" style={{ background: 'var(--mint-light)', color: 'var(--mint)' }}>SAVE TIME</div>
              <div className="bento-card-title">Instant Spreadsheets</div>
              <div className="bento-card-desc">Ask for any spreadsheet and download a real Excel file in seconds. No templates, no setup.</div>
            </div>

            <div className="bento-card accent-dark">
              <div className="bento-icon">🎬</div>
              <div className="bento-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>PREMIUM</div>
              <div className="bento-card-title">Video Analysis</div>
              <div className="bento-card-desc">Paste any YouTube URL — get hooks, ideas, hashtags, and a full content strategy instantly.</div>
            </div>

            <div className="bento-card accent-mint">
              <div className="bento-icon">⚡</div>
              <div className="bento-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>CREATOR TOOLS</div>
              <div className="bento-card-title">Content Tools</div>
              <div className="bento-card-desc">Caption writer, hashtag generator, and hook creator. Three tools built for daily creators.</div>
            </div>

            <div className="bento-card">
              <div className="bento-icon">💡</div>
              <div className="bento-tag" style={{ background: '#fef3c7', color: '#d97706' }}>NEVER LOSE IDEAS</div>
              <div className="bento-card-title">Ideas Library</div>
              <div className="bento-card-desc">Every idea you save lives here. Click any idea and get an AI deep dive with next steps.</div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-belt">
        <div className="quote-belt-inner">
          <p className="qb-pre">The Clarity difference</p>
          <h2 className="qb-h">"ChatGPT forgets you.<br /><em>Clarity grows with you."</em></h2>
          <p className="qb-sub">Your AI that remembers every idea, tracks your growth,<br />and turns scattered thoughts into real action.</p>
          <div className="qb-stats">
            {[{ num: '∞', label: 'Ideas saved forever' }, { num: '7d', label: 'To see results' }, { num: '1', label: 'App for everything' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div className="qb-stat-num">{s.num}</div>
                <div className="qb-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-belt">
        <div className="pricing-belt-inner">
          <h2 className="pricing-hd">Simple pricing,<br /><span>serious value.</span></h2>
          <p className="pricing-sub">Start free. Upgrade when you're ready to go deeper.</p>
          <div className="pricing-row">
            {[
              { name: 'Free', price: '$0', period: '', desc: 'Perfect to get started', features: ['Basic AI organizing', '5 ideas per day', 'Dashboard access', 'Ideas library'], btn: 'Get started free', featured: false },
              { name: 'Pro', price: '$29.99', period: '/mo', desc: 'For serious creators', features: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Clarity Score', 'Content tools', 'Daily Focus'], btn: 'Start Pro', featured: true },
              { name: 'Premium', price: '$59.99', period: '/mo', desc: 'For power users', features: ['Everything in Pro', 'Video analysis', 'AI Content Brief', 'Posting Schedule', 'Priority support'], btn: 'Start Premium', featured: false },
            ].map(plan => (
              <div key={plan.name} className={`pc ${plan.featured ? 'pc-featured' : ''}`}>
                {plan.featured && <div className="pc-badge">MOST POPULAR</div>}
                <div className="pc-tier">{plan.name}</div>
                <div className="pc-price">{plan.price}<span className="pc-period">{plan.period}</span></div>
                <div className="pc-desc">{plan.desc}</div>
                <ul className="pc-features-list">
                  {plan.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <button className="pc-btn" onClick={() => router.push('/login')}>{plan.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-belt">
        <div className="cta-belt-inner">
          <h2 className="cta-h">Your ideas deserve<br />more than <span>a notes app.</span></h2>
          <p className="cta-sub">Join Clarity and turn your scattered thoughts into real action — starting today.</p>
          <button className="btn-xl-primary" style={{ fontSize: '18px', padding: '20px 52px' }} onClick={() => router.push('/login')}>
            Get started — it's free →
          </button>
          <p className="cta-note">No credit card required · Free forever plan</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">✦ Clarity</div>
        <div className="footer-copy">© 2026 Clarity. All rights reserved.</div>
        <div className="footer-links">
          <span>Privacy</span><span>Terms</span><span>Contact</span>
        </div>
      </footer>
    </>
  )
}
