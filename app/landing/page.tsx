'use client'

import { useRouter } from 'next/navigation'

export default function Landing() {
  const router = useRouter()

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #faf8f4; }
        .hero { min-height: 100vh; display: flex; flex-direction: column; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 4rem; }
        .nav-logo { font-size: 20px; font-weight: 600; color: #2d5a27; }
        .nav-buttons { display: flex; gap: 12px; }
        .btn-ghost { background: none; border: 1px solid #d6cfc0; border-radius: 8px; padding: 8px 20px; font-size: 14px; cursor: pointer; color: #4a4a4a; }
        .btn-primary { background: #2d5a27; border: none; border-radius: 8px; padding: 8px 20px; font-size: 14px; cursor: pointer; color: #d4e8c2; }
        .hero-content { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem; gap: 1.5rem; }
        .badge { background: #eaf3de; color: #2d5a27; font-size: 13px; padding: 6px 16px; border-radius: 20px; border: 1px solid #c2dba8; }
        .hero-title { font-size: 56px; font-weight: 600; color: #1a1a1a; line-height: 1.15; max-width: 700px; }
        .hero-title span { color: #2d5a27; }
        .hero-subtitle { font-size: 18px; color: #888; max-width: 500px; line-height: 1.6; }
        .hero-buttons { display: flex; gap: 12px; margin-top: 8px; }
        .btn-large { background: #2d5a27; border: none; border-radius: 10px; padding: 14px 32px; font-size: 16px; cursor: pointer; color: #d4e8c2; font-weight: 500; }
        .btn-large-ghost { background: none; border: 1px solid #d6cfc0; border-radius: 10px; padding: 14px 32px; font-size: 16px; cursor: pointer; color: #4a4a4a; }
        .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 2rem auto; padding: 0 2rem; }
        .feature-card { background: white; border: 1px solid #d6cfc0; border-radius: 16px; padding: 1.5rem; text-align: left; }
        .feature-icon { font-size: 28px; margin-bottom: 12px; }
        .feature-title { font-size: 16px; font-weight: 500; color: #1a1a1a; margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: #888; line-height: 1.5; }
        .pricing { padding: 4rem 2rem; text-align: center; }
        .pricing-title { font-size: 36px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
        .pricing-sub { font-size: 16px; color: #888; margin-bottom: 3rem; }
        .pricing-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 900px; margin: 0 auto; }
        .pricing-card { background: white; border: 1px solid #d6cfc0; border-radius: 16px; padding: 2rem; text-align: left; }
        .pricing-card.featured { border-color: #2d5a27; border-width: 2px; }
        .plan-name { font-size: 14px; font-weight: 500; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .plan-price { font-size: 36px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
        .plan-price span { font-size: 16px; font-weight: 400; color: #888; }
        .plan-desc { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
        .plan-features li { font-size: 13px; color: #4a4a4a; display: flex; align-items: center; gap: 8px; }
        .plan-features li::before { content: '✓'; color: #2d5a27; font-weight: 600; }
        .plan-btn { width: 100%; background: #2d5a27; border: none; border-radius: 8px; padding: 10px; font-size: 14px; cursor: pointer; color: #d4e8c2; font-weight: 500; }
        .plan-btn.ghost { background: none; border: 1px solid #d6cfc0; color: #4a4a4a; }
        .footer { text-align: center; padding: 2rem; font-size: 13px; color: #aaa; border-top: 1px solid #ede9de; }
        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
          .hero-title { font-size: 36px; }
          .features { grid-template-columns: 1fr; }
          .pricing-cards { grid-template-columns: 1fr; }
          .hero-buttons { flex-direction: column; }
        }
      `}</style>

      <div className="hero">
        <nav className="nav">
          <div className="nav-logo">✦ Clarity</div>
          <div className="nav-buttons">
            <button className="btn-ghost" onClick={() => router.push('/login')}>Sign in</button>
            <button className="btn-primary" onClick={() => router.push('/login')}>Get started</button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="badge">✨ AI powered organization</div>
          <h1 className="hero-title">
            Stop losing your ideas.<br />
            <span>Start acting on them.</span>
          </h1>
          <p className="hero-subtitle">
            Dump your thoughts, goals, and ideas into Clarity. The AI organizes everything and turns it into action plans, content calendars, and spreadsheets — instantly.
          </p>
          <div className="hero-buttons">
            <button className="btn-large" onClick={() => router.push('/login')}>Start for free →</button>
            <button className="btn-large-ghost">See how it works</button>
          </div>
        </div>

        <div className="features">
          {[
            { icon: '🧠', title: 'AI brain dump', desc: 'Type anything — messy thoughts, random ideas, big goals. The AI organizes it all for you instantly.' },
            { icon: '📊', title: 'Instant outputs', desc: 'Get spreadsheets, content calendars, and action plans generated in seconds — ready to use.' },
            { icon: '🎬', title: 'Video analysis', desc: 'Paste any YouTube or TikTok link and get content ideas, hooks, and strategies pulled from it.' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="pricing">
          <div className="pricing-title">Simple pricing</div>
          <div className="pricing-sub">Start free. Upgrade when you're ready.</div>
          <div className="pricing-cards">
            {[
              {
                name: 'Free', price: '$0', period: '', desc: 'Perfect to get started',
                features: ['Basic AI organizing', '5 ideas per day', 'Dashboard access'],
                btn: 'Get started', ghost: true, featured: false
              },
              {
                name: 'Pro', price: '$17', period: '/month', desc: 'For serious creators',
                features: ['Unlimited AI', 'Spreadsheet generator', 'Content calendar', 'Save everything', 'Priority support'],
                btn: 'Start Pro', ghost: false, featured: true
              },
              {
                name: 'Premium', price: '$40', period: '/month', desc: 'For power users',
                features: ['Everything in Pro', 'Video analysis', 'Advanced docs', 'Early access to features'],
                btn: 'Start Premium', ghost: false, featured: false
              },
            ].map((plan) => (
              <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price}<span>{plan.period}</span></div>
                <div className="plan-desc">{plan.desc}</div>
                <ul className="plan-features">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button className={`plan-btn ${plan.ghost ? 'ghost' : ''}`} onClick={() => router.push('/login')}>{plan.btn}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="footer">© 2026 Clarity. All rights reserved.</div>
      </div>
    </>
  )
}