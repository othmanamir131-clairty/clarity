'use client'

const RELEASES = [
  {
    date: 'June 9, 2026',
    version: 'v1.4',
    title: 'Onboarding & mobile polish',
    items: [
      'New creator onboarding flow after signup',
      'Improved mobile typography and touch targets',
      'Email confirmation now redirects to your live app',
      'What\'s new page to track releases',
    ],
  },
  {
    date: 'June 8, 2026',
    version: 'v1.3',
    title: 'Payments & feature gating',
    items: [
      'Stripe checkout for Pro ($29.99) and Premium ($59.99)',
      'Upgrade modals on Pro and Premium features',
      'Settings page with plan management',
      'Privacy, Terms, and Contact pages',
    ],
  },
  {
    date: 'June 7, 2026',
    version: 'v1.2',
    title: 'Creator tools launch',
    items: [
      'AI Content Brief generator',
      'Weekly Post Schedule planner',
      'Landing page visual mockups for each tool',
      'Purple/teal glassmorphism theme across all pages',
    ],
  },
  {
    date: 'June 4, 2026',
    version: 'v1.0',
    title: 'Clarity launch',
    items: [
      'AI brain dump on the dashboard',
      'Ideas library with Supabase saving',
      'Clarity Score, Content Tools, and Video Analysis',
      'Live deployment on Vercel',
    ],
  },
]

export default function Updates() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(160deg, #2e1065 0%, #4c1d95 25%, #1e3a5f 60%, #064e3b 100%);
          background-attachment: fixed;
          min-height: 100vh;
          color: white;
          -webkit-font-smoothing: antialiased;
        }
        @keyframes blob { 0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 70%} 50%{border-radius:40% 60% 30% 70%/60% 40% 70% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 1.5rem;
          animation: fadeUp 0.4s ease;
        }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.55); text-decoration: none;
          font-size: 14px; font-weight: 600; margin-bottom: 1.5rem;
          transition: color 0.2s ease;
        }
        .back-link:hover { color: white; }
        @media (max-width: 768px) {
          .page-wrap { padding: 1.25rem 1rem 2rem !important; }
          h1 { font-size: 28px !important; }
          .card { padding: 1.25rem !important; border-radius: 16px !important; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '450px', height: '450px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
      </div>

      <div className="page-wrap" style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>
        <a className="back-link" href="/">← Back to dashboard</a>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Changelog</div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '10px' }}>What&apos;s new in Clarity</h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            The latest features, fixes, and improvements shipped to your workspace.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {RELEASES.map((release, index) => (
            <div key={release.version} className="card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#c4b5fd', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', padding: '4px 10px', borderRadius: '100px' }}>
                  {release.version}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>{release.date}</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.3px' }}>{release.title}</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {release.items.map(item => (
                  <li key={item} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, paddingLeft: '18px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#34d399' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
