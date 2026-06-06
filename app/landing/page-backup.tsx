'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #faf8f4; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        @keyframes slideRight { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .hero-title { animation: fadeUp 0.8s ease forwards; }
        .hero-sub { animation: fadeUp 0.8s ease 0.2s forwards; opacity: 0; }
        .hero-btns { animation: fadeUp 0.8s ease 0.4s forwards; opacity: 0; }
        .hero-badge { animation: fadeIn 0.8s ease forwards; }
        .float { animation: float 4s ease-in-out infinite; }
        .feature-card { transition: all 0.25s ease; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .pricing-card { transition: all 0.25s ease; }
        .pricing-card:hover { transform: translateY(-4px); }
        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(45,90,39,0.4); }
        .btn-ghost { transition: all 0.2s ease; }
        .btn-ghost:hover { backgroundColor: #f0ece4; }
        .stat-num { font-size: 48px; font-weight: 800; color: #2d5a27; line-height: 1; }
        .nav-sticky { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.3s ease; }
        .marquee-wrapper { overflow: hidden; white-space: nowrap; }
        .marquee-track { display: inline-flex; gap: 24px; animation: marquee 20s linear infinite; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 768px) {
          .hero-title-text { font-size: 42px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-links { display: none !important; }
          .hero-btns-inner { flex-direction: column !important; }
        }
      `}</style>

      {/* Sticky Nav */}
      <nav className="nav-sticky" style={{ backgroundColor: scrolled ? 'rgba(250,248,244,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: scrolled ? '1px solid #ede9de' : 'none', padding: '1rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#2d5a27' }}>✦ Clarity</div>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '14px', color: '#666' }}>
            <span style={{ cursor: 'pointer' }}>Features</span>
            <span style={{ cursor: 'pointer' }}>Pricing</span>
            <span style={{ cursor: 'pointer' }}>About</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => router.push('/login')} style={{ background: 'none', border: '1.5px solid #d6cfc0', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', cursor: 'pointer', color: '#444', fontWeight: '500' }}>Sign in</button>
            <button className="btn-primary" onClick={() => router.push('/login')} style={{ background: '#2d5a27', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', cursor: 'pointer', color: '#d4e8c2', fontWeight: '600' }}>Get started →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: '#d4e8c2', opacity: 0.3, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', backgroundColor: '#eaf3de', opacity: 0.4, filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#eaf3de', border: '1.5px solid #c2dba8', borderRadius: '20px', padding: '8px 18px', fontSize: '13px', color: '#2d5a27', fontWeight: '600', marginBottom: '2rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d5a27', display: 'inline-block', animation: 'pulse 2s ease infinite' }}></span>
          AI Powered Organization
        </div>

        <h1 className="hero-title" style={{ fontSize: '72px', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.05', maxWidth: '800px', marginBottom: '1.5rem', letterSpacing: '-2px' }}>
          <span className="hero-title-text" style={{ fontSize: '72px' }}>Stop losing your</span><br />
          <span style={{ color: '#2d5a27', fontStyle: 'italic' }}>best ideas.</span>
        </h1>

        <p className="hero-sub" style={{ fontSize: '20px', color: '#666', maxWidth: '520px', lineHeight: '1.7', marginBottom: '2.5rem' }}>
          Dump your thoughts into Clarity. The AI organizes everything and turns it into <strong style={{ color: '#1a1a1a' }}>action plans, content calendars, and spreadsheets</strong> — instantly.
        </p>

        <div className="hero-btns">
          <div className="hero-btns-inner" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => router.push('/login')} style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '12px', padding: '16px 36px', fontSize: '16px', cursor: 'pointer', fontWeight: '700', letterSpacing: '-0.3px' }}>
              Start for free — it's fast →
            </button>
            <button style={{ background: 'white', border: '1.5px solid #d6cfc0', borderRadius: '12px', padding: '16px 28px', fontSize: '16px', cursor: 'pointer', color: '#444', fontWeight: '500' }}>
              See how it works ↓
            </button>
          </div>
          <div style={{ marginTop: '1.25rem', fontSize: '13px', color: '#aaa' }}>No credit card required • Free forever plan</div>
        </div>

        {/* Floating cards */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { emoji: '🧠', text: 'AI brain dump', delay: '0s' },
            { emoji: '📊', text: 'Auto spreadsheets', delay: '0.5s' },
            { emoji: '✨', text: 'Clarity Score', delay: '1s' },
            { emoji: '🎬', text: 'Video analysis', delay: '1.5s' },
            { emoji: '⚡', text: 'Content tools', delay: '2s' },
          ].map((item) => (
            <div key={item.text} className="float" style={{ backgroundColor: 'white', border: '1.5px solid #e8e4da', borderRadius: '12px', padding: '10px 18px', fontSize: '14px', color: '#333', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', animationDelay: item.delay, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              {item.emoji} {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div style={{ backgroundColor: '#2d5a27', padding: '14px 0', overflow: 'hidden' }}>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {['Brain dump your ideas', 'Get instant action plans', 'Generate spreadsheets', 'Analyze any video', 'Track your Clarity Score', 'Write viral captions', 'Generate hashtags', 'Build content calendars', 'Brain dump your ideas', 'Get instant action plans', 'Generate spreadsheets', 'Analyze any video', 'Track your Clarity Score', 'Write viral captions', 'Generate hashtags', 'Build content calendars'].map((text, i) => (
              <span key={i} style={{ fontSize: '14px', color: '#d4e8c2', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                {text} <span style={{ color: '#a8d48a' }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#f5f0e8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
            {[
              { num: '10x', label: 'Faster organizing' },
              { num: '5+', label: 'AI powered tools' },
              { num: '100%', label: 'Your ideas, saved' },
              { num: '∞', label: 'Possibilities' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="stat-num">{stat.num}</div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '6px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Everything you need</div>
            <div style={{ fontSize: '44px', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1.5px', lineHeight: '1.1' }}>Built for creators<br />who think fast.</div>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { emoji: '🧠', title: 'AI Brain Dump', desc: 'Type anything — messy thoughts, random ideas, big goals. The AI organizes it all instantly.', bg: '#eaf3de', border: '#c2dba8' },
              { emoji: '📊', title: 'Instant Spreadsheets', desc: 'Ask for a content calendar or action plan and get a real downloadable Excel file in seconds.', bg: '#fdf6e3', border: '#e8d5a0' },
              { emoji: '✨', title: 'Clarity Score', desc: 'Get a weekly AI report on your ideas, themes, and what to focus on next. Like a personal coach.', bg: '#f5f0e8', border: '#d6cfc0' },
              { emoji: '🎬', title: 'Video Analysis', desc: 'Paste any YouTube URL and get hooks, content ideas, hashtags, and a full strategy.', bg: '#eaf3de', border: '#c2dba8' },
              { emoji: '⚡', title: 'Content Tools', desc: 'Caption writer, hashtag generator, and hook creator — all AI powered and built for creators.', bg: '#fdf6e3', border: '#e8d5a0' },
              { emoji: '💡', title: 'Ideas Library', desc: 'Every idea you save lives here. Click any idea and get an AI deep dive with next steps.', bg: '#f5f0e8', border: '#d6cfc0' },
            ].map((f) => (
              <div key={f.title} className="feature-card" style={{ backgroundColor: f.bg, border: `1.5px solid ${f.border}`, borderRadius: '18px', padding: '1.75rem' }}>
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{f.emoji}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#f5f0e8' }}>
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d5a27', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Simple pricing</div>
            <div style={{ fontSize: '44px', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1.5px' }}>Start free.<br />Upgrade anytime.</div>
          </div>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              {
                name: 'Free', price: '$0', period: '', desc: 'Perfect to get started',
                features: ['Basic AI organizing', '5 ideas per day', 'Dashboard access', 'Ideas library'],
                btn: 'Get started free', featured: false, btnStyle: 'ghost'
              },
              {
                name: 'Pro', price: '$29.99', period: '/mo', desc: 'For serious creators',
                features: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Clarity Score', 'Content tools', 'Save everything'],
                btn: 'Start Pro', featured: true, btnStyle: 'primary'
              },
              {
                name: 'Premium', price: '$59.99', period: '/mo', desc: 'For power users',
                features: ['Everything in Pro', 'Video analysis', 'Advanced docs', 'Priority support', 'Early access'],
                btn: 'Start Premium', featured: false, btnStyle: 'primary'
              },
            ].map((plan) => (
              <div key={plan.name} className="pricing-card" style={{ backgroundColor: plan.featured ? '#2d5a27' : 'white', border: plan.featured ? 'none' : '1.5px solid #d6cfc0', borderRadius: '20px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                {plan.featured && <div style={{ position: 'absolute', top: '16px', right: '16px', backgroundColor: '#d4e8c2', color: '#2d5a27', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>MOST POPULAR</div>}
                <div style={{ fontSize: '13px', fontWeight: '700', color: plan.featured ? '#a8d48a' : '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{plan.name}</div>
                <div style={{ fontSize: '42px', fontWeight: '900', color: plan.featured ? 'white' : '#1a1a1a', letterSpacing: '-1px', marginBottom: '4px' }}>
                  {plan.price}<span style={{ fontSize: '16px', fontWeight: '500', color: plan.featured ? '#a8d48a' : '#888' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: '13px', color: plan.featured ? '#c2dba8' : '#888', marginBottom: '1.5rem' }}>{plan.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: plan.featured ? '#d4e8c2' : '#444' }}>
                      <span style={{ color: plan.featured ? '#a8d48a' : '#2d5a27', fontWeight: '700' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => router.push('/login')}
                  style={{ width: '100%', backgroundColor: plan.featured ? '#d4e8c2' : '#2d5a27', color: plan.featured ? '#2d5a27' : '#d4e8c2', border: 'none', borderRadius: '10px', padding: '13px', fontSize: '15px', cursor: 'pointer', fontWeight: '700' }}
                >
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '52px', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-2px', lineHeight: '1.1', marginBottom: '1.25rem' }}>
            Your ideas deserve<br /><span style={{ color: '#2d5a27', fontStyle: 'italic' }}>more than a notes app.</span>
          </div>
          <p style={{ fontSize: '17px', color: '#666', marginBottom: '2.5rem', lineHeight: '1.7' }}>Join Clarity and turn your ideas into action — starting today.</p>
          <button className="btn-primary" onClick={() => router.push('/login')} style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '14px', padding: '18px 44px', fontSize: '18px', cursor: 'pointer', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Get started for free →
          </button>
          <div style={{ marginTop: '1rem', fontSize: '13px', color: '#aaa' }}>No credit card required</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #ede9de', padding: '2rem', textAlign: 'center', fontSize: '13px', color: '#aaa' }}>
        <div style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '700', color: '#2d5a27' }}>✦ Clarity</div>
        © 2026 Clarity. All rights reserved.
      </footer>
    </>
  )
}