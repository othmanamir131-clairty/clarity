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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f0e8; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float1 { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-10px) rotate(-1deg); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .btn-main { transition: all 0.2s ease; }
        .btn-main:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .btn-outline { transition: all 0.2s ease; }
        .btn-outline:hover { background: #1a1a2e !important; color: white !important; }
        .feature-row { transition: all 0.2s ease; }
        .feature-row:hover { transform: translateX(6px); }
        .pricing-card { transition: all 0.25s ease; }
        .pricing-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(0,0,0,0.1); }
        .nav-sticky { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 0.3s ease; }
        @media (max-width: 768px) {
          .hero-title { font-size: 48px !important; letter-spacing: -2px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-layout { flex-direction: column !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .circles-area { display: none !important; }
          .quote-big { font-size: 36px !important; }
          .cta-big { font-size: 40px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav className="nav-sticky" style={{ backgroundColor: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none', padding: '1.25rem 4rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' }}>✦ Clarity</div>
          <div className="nav-links" style={{ display: 'flex', gap: '2.5rem', fontSize: '15px', color: '#666', fontWeight: '500' }}>
            <span style={{ cursor: 'pointer' }}>Product</span>
            <span style={{ cursor: 'pointer' }}>Pricing</span>
            <span style={{ cursor: 'pointer' }}>About</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', fontSize: '15px', cursor: 'pointer', color: '#1a1a2e', fontWeight: '500' }}>Log in</button>
            <button className="btn-main" onClick={() => router.push('/login')} style={{ background: '#1a1a2e', border: 'none', borderRadius: '100px', padding: '10px 24px', fontSize: '15px', cursor: 'pointer', color: 'white', fontWeight: '600' }}>Get started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', alignItems: 'center', padding: '8rem 4rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left */}
            <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', borderRadius: '100px', padding: '6px 16px', fontSize: '13px', color: '#7c3aed', fontWeight: '600', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'inline-block', animation: 'pulse 2s ease infinite' }}></span>
                AI powered organization for creators
              </div>
              <h1 className="hero-title" style={{ fontSize: '68px', fontWeight: '900', color: '#1a1a2e', lineHeight: '1.02', letterSpacing: '-3px', marginBottom: '1.5rem' }}>
                One place for<br />
                everything on<br />
                <span style={{ color: '#7c3aed' }}>your mind.</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.7', marginBottom: '2.5rem', maxWidth: '420px' }}>
                Dump your ideas, goals, and content plans into Clarity — and get it all organized, actionable, and ready to go.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn-main" onClick={() => router.push('/login')} style={{ background: '#1a1a2e', border: 'none', borderRadius: '100px', padding: '16px 32px', fontSize: '16px', cursor: 'pointer', color: 'white', fontWeight: '700' }}>
                  Get Clarity free
                </button>
                <button className="btn-outline" onClick={() => router.push('/login')} style={{ background: 'none', border: '1.5px solid #1a1a2e', borderRadius: '100px', padding: '15px 28px', fontSize: '16px', cursor: 'pointer', color: '#1a1a2e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ▶ See how it works
                </button>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '13px', color: '#aaa' }}>Free forever plan · No credit card required</div>
            </div>

            {/* Right — circles like Mem */}
            <div className="circles-area" style={{ position: 'relative', height: '520px' }}>
              {/* Big purple circle */}
              <div style={{ position: 'absolute', top: '0', left: '10%', width: '280px', height: '280px', borderRadius: '50%', backgroundColor: '#7c3aed', animation: 'float1 5s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', padding: '20px 24px', maxWidth: '200px' }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontWeight: '500' }}>AI Brain Dump</div>
                  <div style={{ fontSize: '15px', color: 'white', fontWeight: '700', lineHeight: '1.4' }}>"Make me a content calendar for my fitness page"</div>
                </div>
              </div>

              {/* Mint green circle */}
              <div style={{ position: 'absolute', bottom: '5%', left: '0%', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: '#34d399', animation: 'float2 4s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '36px', marginBottom: '6px' }}>✨</div>
                  <div style={{ fontSize: '14px', color: 'white', fontWeight: '800' }}>Clarity Score</div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>87</div>
                </div>
              </div>

              {/* Cream/beige circle */}
              <div style={{ position: 'absolute', top: '10%', right: '0%', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#e8e0d0', animation: 'float3 6s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', marginBottom: '4px' }}>Ideas saved</div>
                  <div style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a2e' }}>24</div>
                  <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600' }}>this week</div>
                </div>
              </div>

              {/* White card floating */}
              <div style={{ position: 'absolute', bottom: '15%', right: '5%', backgroundColor: 'white', borderRadius: '20px', padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', animation: 'float2 7s ease-in-out infinite', maxWidth: '200px' }}>
                <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>⚡ Content Tools</div>
                <div style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600', lineHeight: '1.4' }}>30 hashtags generated for your fitness niche</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Remembering is so yesterday" style section */}
      <section style={{ backgroundColor: '#f5f0e8', padding: '6rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Why Clarity</div>
          <h2 style={{ fontSize: '56px', fontWeight: '900', color: '#1a1a2e', lineHeight: '1.08', letterSpacing: '-2px', marginBottom: '1.5rem' }}>
            Stop planning.<br />Start creating.
          </h2>
          <p style={{ fontSize: '20px', color: '#666', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 3rem' }}>
            You spend hours every week organizing ideas that never get acted on. Clarity changes that — the AI does the organizing so you can focus on creating.
          </p>

          {/* Mock chat UI like Mem */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: '560px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#7c3aed', color: 'white', borderRadius: '18px 18px 4px 18px', padding: '12px 18px', fontSize: '14px', fontWeight: '600', maxWidth: '75%' }}>
                I want to grow my TikTok and Instagram for fitness
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>✦</div>
              <div style={{ backgroundColor: '#f5f0e8', borderRadius: '4px 18px 18px 18px', padding: '14px 18px', fontSize: '14px', color: '#1a1a2e', lineHeight: '1.6', flex: 1 }}>
                <strong>Here's your growth plan:</strong><br />
                • Post 4x/week — Mon, Wed, Fri, Sun<br />
                • Content mix: 60% educational, 40% personal<br />
                • Best time to post: 6-8pm your timezone
              </div>
            </div>
            <div style={{ backgroundColor: '#f8f7ff', border: '1.5px solid #ede9fe', borderRadius: '14px', padding: '14px 16px' }}>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '700', marginBottom: '4px' }}>📊 Action Plan — Created by Clarity</div>
              <div style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: '600' }}>Fitness Creator Growth Plan · June 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — Mem style alternating left/right */}
      <section style={{ backgroundColor: 'white', padding: '6rem 4rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Everything you need</div>
            <h2 style={{ fontSize: '52px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '-2px', lineHeight: '1.08' }}>Get things out of<br />your head and<br /><span style={{ color: '#7c3aed' }}>into Clarity.</span></h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { emoji: '🧠', title: 'AI Brain Dump', desc: 'Type anything — messy thoughts, random ideas, big goals. The AI organizes it all instantly. No folders, no structure needed. Just dump and go.', tag: 'Core', color: '#7c3aed' },
              { emoji: '✨', title: 'Clarity Score', desc: 'Every week, your AI analyzes everything you\'ve saved and gives you a personal report — your top themes, what to focus on, and your score out of 100.', tag: 'Unique', color: '#34d399' },
              { emoji: '📊', title: 'Instant Spreadsheets', desc: 'Ask for a content calendar or action plan and get a real downloadable Excel file in seconds. No templates, no setup — just ask and download.', tag: 'Save Time', color: '#7c3aed' },
              { emoji: '🎬', title: 'Video Analysis', desc: 'Paste any YouTube URL and get scroll-stopping hooks, content ideas, hashtags, and a full strategy pulled directly from that video.', tag: 'Premium', color: '#f59e0b' },
              { emoji: '⚡', title: 'Content Tools', desc: 'Caption writer, hashtag generator, and hook creator — three powerful AI tools built specifically for creators who post every day.', tag: 'Creator Tools', color: '#34d399' },
              { emoji: '💡', title: 'Ideas Library', desc: 'Every idea you save lives here forever. Click any idea and get an AI deep dive — why it\'s great, how to execute it, and what to do today.', tag: 'Never Lose Ideas', color: '#7c3aed' },
            ].map((f, i) => (
              <div key={f.title} className="feature-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', padding: '2.5rem 0', borderBottom: i < 5 ? '1px solid #f0ece4' : 'none', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: i % 2 === 0 ? '#f8f7ff' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>{f.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' }}>{f.title}</div>
                    <span style={{ fontSize: '11px', backgroundColor: f.color === '#f59e0b' ? '#fef3c7' : f.color === '#34d399' ? '#d1fae5' : '#ede9fe', color: f.color, padding: '3px 10px', borderRadius: '100px', fontWeight: '700' }}>{f.tag}</span>
                  </div>
                  <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.7' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big quote section */}
      <section style={{ backgroundColor: '#1a1a2e', padding: '8rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: '#7c3aed', opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: '#34d399', opacity: 0.08, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '72px', marginBottom: '1.5rem' }}>💬</div>
          <h2 className="quote-big" style={{ fontSize: '52px', fontWeight: '900', color: 'white', lineHeight: '1.15', letterSpacing: '-2px', marginBottom: '1.5rem' }}>
            "ChatGPT forgets you.<br /><span style={{ color: '#34d399' }}>Clarity grows with you."</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7', marginBottom: '3rem' }}>
            Your AI that remembers every idea, tracks your growth over time,<br />and helps you turn scattered thoughts into real action.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[{ num: '∞', label: 'Ideas saved forever' }, { num: '7', label: 'Days to see results' }, { num: '1', label: 'App for everything' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '44px', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>{s.num}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ backgroundColor: '#f5f0e8', padding: '7rem 4rem' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Simple pricing</div>
            <h2 style={{ fontSize: '52px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '-2px' }}>Start free.<br /><span style={{ color: '#7c3aed' }}>Upgrade when ready.</span></h2>
          </div>

          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { name: 'Free', price: '$0', period: '', desc: 'Perfect to get started', features: ['Basic AI organizing', '5 ideas per day', 'Dashboard access', 'Ideas library'], btn: 'Get started free', featured: false },
              { name: 'Pro', price: '$29.99', period: '/mo', desc: 'For serious creators', features: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Clarity Score', 'Content tools', 'Daily Focus'], btn: 'Start Pro', featured: true },
              { name: 'Premium', price: '$59.99', period: '/mo', desc: 'For power users', features: ['Everything in Pro', 'Video analysis', 'AI Content Brief', 'Posting Schedule', 'Priority support'], btn: 'Start Premium', featured: false },
            ].map((plan) => (
              <div key={plan.name} className="pricing-card" style={{ backgroundColor: plan.featured ? '#1a1a2e' : 'white', borderRadius: '24px', padding: '2.25rem', position: 'relative', boxShadow: plan.featured ? '0 24px 64px rgba(26,26,46,0.25)' : '0 4px 16px rgba(0,0,0,0.04)' }}>
                {plan.featured && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#7c3aed', color: 'white', fontSize: '11px', fontWeight: '800', padding: '5px 16px', borderRadius: '100px', whiteSpace: 'nowrap' }}>⭐ MOST POPULAR</div>}
                <div style={{ fontSize: '13px', fontWeight: '700', color: plan.featured ? 'rgba(255,255,255,0.4)' : '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{plan.name}</div>
                <div style={{ fontSize: '48px', fontWeight: '900', color: plan.featured ? 'white' : '#1a1a2e', letterSpacing: '-2px', marginBottom: '4px' }}>
                  {plan.price}<span style={{ fontSize: '16px', fontWeight: '500', color: plan.featured ? 'rgba(255,255,255,0.4)' : '#aaa' }}>{plan.period}</span>
                </div>
                <div style={{ fontSize: '14px', color: plan.featured ? 'rgba(255,255,255,0.5)' : '#888', marginBottom: '2rem' }}>{plan.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: plan.featured ? 'rgba(255,255,255,0.8)' : '#444', fontWeight: '500' }}>
                      <span style={{ color: plan.featured ? '#34d399' : '#7c3aed', fontWeight: '800' }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button className="btn-main" onClick={() => router.push('/login')} style={{ width: '100%', backgroundColor: plan.featured ? '#7c3aed' : '#1a1a2e', color: 'white', border: 'none', borderRadius: '100px', padding: '14px', fontSize: '15px', cursor: 'pointer', fontWeight: '700' }}>
                  {plan.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ backgroundColor: 'white', padding: '8rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 className="cta-big" style={{ fontSize: '60px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '-2.5px', lineHeight: '1.06', marginBottom: '1.5rem' }}>
            Your ideas deserve<br /><span style={{ color: '#7c3aed' }}>more than a notes app.</span>
          </h2>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '2.5rem', lineHeight: '1.7' }}>
            Join Clarity and turn your scattered thoughts into real action — starting today.
          </p>
          <button className="btn-main" onClick={() => router.push('/login')} style={{ background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '100px', padding: '20px 48px', fontSize: '18px', cursor: 'pointer', fontWeight: '800' }}>
            Get Clarity free →
          </button>
          <div style={{ marginTop: '1.25rem', fontSize: '13px', color: '#bbb' }}>No credit card required · Free forever plan</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#f5f0e8', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '2.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e' }}>✦ Clarity</div>
        <div style={{ fontSize: '13px', color: '#bbb' }}>© 2026 Clarity. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '13px', color: '#888' }}>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
          <span style={{ cursor: 'pointer' }}>Terms</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>
      </footer>
    </>
  )
}