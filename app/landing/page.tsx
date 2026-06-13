'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [annual, setAnnual] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const orbX = (mousePos.x - 0.5) * 40
  const orbY = (mousePos.y - 0.5) * 30

  const faqs = [
    { q: 'Is there really a free plan — no credit card needed?', a: 'Yes. The free plan is free forever. You get 5 AI messages per day, the full dashboard, and your ideas library. No credit card, no trial timer, no gotchas.' },
    { q: 'How is Clarity different from ChatGPT or Notion?', a: 'ChatGPT forgets you the moment you close the tab. Notion is a blank page you have to organize yourself. Clarity remembers every idea, asks smart follow-ups, and generates real downloadable files.' },
    { q: 'What kinds of files does it actually generate?', a: 'Excel spreadsheets, content calendars, action plans, and content briefs — all downloadable in one click. You ask in plain English, Clarity builds the file.' },
    { q: 'Do I need to be a content creator to use this?', a: 'Not at all. If you have goals, projects, or ideas you keep losing track of, Clarity works for you. Creators, freelancers, students, and everyday people all use it.' },
    { q: 'Can I cancel or change plans anytime?', a: 'Yes. No contracts, no lock-in. Cancel or switch plans from your settings in under 30 seconds.' },
  ]

  const proMonthly = 29.99
  const premiumMonthly = 59.99

  // ── FEATURE MOCKUPS ──
  const mockups = [
    // 0: AI Brain Dump
    <div key="m0" style={{ borderRadius: '14px', padding: '12px', height: '110px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(167,139,250,0.25)' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', borderRadius: '12px 12px 3px 12px', padding: '6px 11px', fontSize: '10px', color: 'white', fontWeight: '700', maxWidth: '78%' }}>I want to grow my TikTok…</div>
      </div>
      <div style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#34d399)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', fontWeight: '800' }}>✦</div>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '3px 12px 12px 12px', padding: '7px 10px', fontSize: '9px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', border: '1px solid rgba(255,255,255,0.15)', flex: 1, lineHeight: 1.6 }}>
          Here&apos;s your plan:<br />
          <span style={{ color: '#c4b5fd' }}>• Post 4x/week</span> · Best time 6–8pm
        </div>
      </div>
    </div>,
    // 1: Clarity Score
    <div key="m1" style={{ borderRadius: '14px', padding: '14px 16px', height: '110px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg,#059669,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>87</div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#34d399', letterSpacing: '0.06em' }}>CLARITY SCORE</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>This week · +12 from last</div>
        </div>
      </div>
      <div style={{ background: 'rgba(52,211,153,0.15)', borderRadius: '100px', height: '7px', width: '100%', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(90deg,#059669,#34d399)', borderRadius: '100px', height: '100%', width: '87%', boxShadow: '0 0 10px rgba(52,211,153,0.6)' }} />
      </div>
    </div>,
    // 2: Spreadsheets
    <div key="m2" style={{ borderRadius: '14px', padding: '10px', height: '110px', overflow: 'hidden', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
        {['Day', 'Platform', 'Type'].map(h => (
          <div key={h} style={{ background: 'rgba(245,158,11,0.3)', borderRadius: '5px', padding: '4px 6px', fontSize: '8px', fontWeight: '800', color: '#fbbf24', textAlign: 'center', letterSpacing: '0.04em' }}>{h}</div>
        ))}
        {['Mon','TikTok','Tutorial','Wed','Instagram','Reel','Fri','YouTube','Vlog'].map((c, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '5px', padding: '4px 6px', fontSize: '8px', color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</div>
        ))}
      </div>
    </div>,
    // 3: Video Analysis
    <div key="m3" style={{ borderRadius: '14px', padding: '10px', height: '110px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(244,114,182,0.25)' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a0520,#2d0838)', borderRadius: '10px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(244,114,182,0.15)' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(244,114,182,0.6)' }}>
          <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #db2777', marginLeft: '2px' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['12 Hooks','8 Ideas','20 Tags'].map(lbl => (
          <div key={lbl} style={{ background: 'rgba(236,72,153,0.25)', borderRadius: '7px', padding: '4px 8px', fontSize: '8px', fontWeight: '800', color: '#f472b6', flex: 1, textAlign: 'center' }}>{lbl}</div>
        ))}
      </div>
    </div>,
    // 4: Content Tools
    <div key="m4" style={{ borderRadius: '14px', padding: '10px', height: '110px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '7px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(96,165,250,0.25)' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        {['Caption','Hook','#Tags'].map((t, i) => (
          <div key={i} style={{ background: i === 0 ? '#3b82f6' : 'rgba(59,130,246,0.2)', borderRadius: '100px', padding: '3px 10px', fontSize: '8px', fontWeight: '800', color: i === 0 ? 'white' : '#93c5fd', letterSpacing: '0.02em' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '7px 10px', border: '1px solid rgba(96,165,250,0.15)', fontSize: '9px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, flex: 1 }}>
        Ready to level up your fitness game? 💪 Here&apos;s why consistency beats intensity every single time…
      </div>
    </div>,
    // 5: Ideas Library
    <div key="m5" style={{ borderRadius: '14px', padding: '9px', height: '110px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
      {[
        { c: '#a78bfa', t: 'TikTok series idea' },
        { c: '#34d399', t: 'Brand deal pitch' },
        { c: '#fbbf24', t: '30-day challenge' },
        { c: '#f472b6', t: 'Collab strategy' },
      ].map((card, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '7px 8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ height: '3px', background: card.c, borderRadius: '100px', marginBottom: '5px', width: '50%', boxShadow: `0 0 8px ${card.c}80` }} />
          <div style={{ fontSize: '8px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{card.t}</div>
        </div>
      ))}
    </div>,
  ]

  const features = [
    { chip: 'Core', chipBg: 'rgba(167,139,250,0.2)', chipC: '#a78bfa', accent: '#7c3aed', t: 'AI Brain Dump', d: 'Type anything — messy thoughts, big goals, random ideas. Clarity organizes it instantly. No folders, no friction.', mockup: 0 },
    { chip: 'Unique', chipBg: 'rgba(52,211,153,0.2)', chipC: '#34d399', accent: '#059669', t: 'Clarity Score', d: 'Weekly AI report on your ideas, themes, and top priorities. Like a personal coach who actually remembers everything.', mockup: 1 },
    { chip: 'Save Hours', chipBg: 'rgba(251,191,36,0.2)', chipC: '#fbbf24', accent: '#d97706', t: 'Instant Spreadsheets', d: 'Ask for a content calendar and get a real, downloadable Excel file in seconds. Just plain English.', mockup: 2 },
    { chip: 'Premium', chipBg: 'rgba(244,114,182,0.2)', chipC: '#f472b6', accent: '#db2777', t: 'Video Analysis', d: 'Paste any YouTube URL — get 12+ hooks, ideas, hashtags, and a full strategy pulled from that video.', mockup: 3 },
    { chip: 'Creator Tools', chipBg: 'rgba(96,165,250,0.2)', chipC: '#60a5fa', accent: '#2563eb', t: 'Content Tools', d: 'Caption writer, hashtag generator, and hook creator in one place. Built for creators who post every day.', mockup: 4 },
    { chip: 'Never Lose Ideas', chipBg: 'rgba(167,139,250,0.2)', chipC: '#a78bfa', accent: '#7c3aed', t: 'Ideas Library', d: 'Every idea you save lives here permanently. Click any idea for an AI deep dive with actionable next steps.', mockup: 5 },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#040410;color:#fff;-webkit-font-smoothing:antialiased;overflow-x:hidden}

        /* ── KEYFRAMES ── */
        @keyframes f1{0%,100%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(50px,-35px) rotate(6deg)}50%{transform:translate(-25px,55px) rotate(-4deg)}75%{transform:translate(-55px,-25px) rotate(5deg)}}
        @keyframes f2{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-65px,45px) rotate(-7deg)}66%{transform:translate(55px,-35px) rotate(6deg)}}
        @keyframes f3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(35px,65px) scale(1.06)}}
        @keyframes f4{0%,100%{transform:translate(0,0)}40%{transform:translate(-45px,-55px)}80%{transform:translate(35px,35px)}}
        @keyframes f5{0%,100%{transform:translate(0,0) rotate(0deg)}30%{transform:translate(55px,35px) rotate(9deg)}70%{transform:translate(-35px,-45px) rotate(-6deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes glint{0%,88%,100%{opacity:0}94%{opacity:1}}
        @keyframes breathe{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes heroOrb{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}20%{transform:translate(30px,-20px) scale(1.03) rotate(3deg)}40%{transform:translate(-15px,25px) scale(0.98) rotate(-2deg)}60%{transform:translate(20px,15px) scale(1.02) rotate(2deg)}80%{transform:translate(-25px,-10px) scale(1) rotate(-1deg)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ringExpand{0%{transform:scale(0.8);opacity:0.6}100%{transform:scale(1.8);opacity:0}}

        /* ── ORB BG ── */
        .orb-stage{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
        .bg-glow{position:absolute;border-radius:50%;filter:blur(80px);animation:breathe 9s ease-in-out infinite}
        .bg-g1{width:900px;height:900px;top:-300px;left:-200px;background:radial-gradient(circle,rgba(109,40,217,0.35),transparent 70%)}
        .bg-g2{width:800px;height:800px;bottom:-200px;right:-200px;background:radial-gradient(circle,rgba(5,150,105,0.3),transparent 70%);animation-delay:4s}
        .bg-g3{width:600px;height:600px;top:35%;left:35%;background:radial-gradient(circle,rgba(219,39,119,0.15),transparent 70%);animation-delay:7s}

        .orb{position:absolute;border-radius:50%}
        .orb::before{content:'';position:absolute;border-radius:50%}
        .orb::after{content:'';position:absolute;border-radius:50%}

        /* purple orb */
        .o1{
          width:560px;height:560px;top:-120px;left:-140px;
          background:radial-gradient(circle at 30% 26%,
            #fff 0%,rgba(255,255,255,0.7) 4%,
            rgba(216,180,254,0.6) 12%,
            rgba(139,92,246,0.7) 28%,
            rgba(109,40,217,0.8) 48%,
            rgba(30,10,60,0.9) 70%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -35px -35px 70px rgba(0,0,0,0.7),inset 18px 18px 35px rgba(255,255,255,0.07),0 0 120px rgba(124,58,237,0.5),0 0 240px rgba(124,58,237,0.2);
          animation:f1 22s ease-in-out infinite;
        }
        .o1::after{width:38%;height:22%;background:rgba(255,255,255,0.55);top:10%;left:16%;filter:blur(9px);transform:rotate(-28deg);animation:glint 7s ease-in-out infinite}
        .o1::before{width:14%;height:14%;background:rgba(255,255,255,0.9);top:7%;left:22%;filter:blur(4px);box-shadow:0 0 15px rgba(255,255,255,0.6)}

        /* teal orb */
        .o2{
          width:420px;height:420px;bottom:-80px;right:-100px;
          background:radial-gradient(circle at 33% 28%,
            #fff 0%,rgba(255,255,255,0.65) 5%,
            rgba(110,231,183,0.55) 14%,
            rgba(16,185,129,0.7) 32%,
            rgba(5,150,105,0.8) 52%,
            rgba(4,30,22,0.9) 72%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -25px -25px 55px rgba(0,0,0,0.65),inset 14px 14px 28px rgba(255,255,255,0.07),0 0 100px rgba(16,185,129,0.5),0 0 200px rgba(16,185,129,0.18);
          animation:f2 19s ease-in-out infinite;
        }
        .o2::after{width:34%;height:20%;background:rgba(255,255,255,0.5);top:11%;left:18%;filter:blur(8px);transform:rotate(-22deg);animation:glint 9s ease-in-out infinite 2s}
        .o2::before{width:13%;height:13%;background:rgba(255,255,255,0.88);top:8%;left:23%;filter:blur(4px)}

        /* pink orb */
        .o3{
          width:300px;height:300px;top:38%;right:5%;
          background:radial-gradient(circle at 32% 27%,
            #fff 0%,rgba(255,255,255,0.7) 5%,
            rgba(249,168,212,0.55) 14%,
            rgba(236,72,153,0.7) 32%,
            rgba(190,24,93,0.8) 52%,
            rgba(30,4,16,0.9) 72%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -18px -18px 40px rgba(0,0,0,0.65),inset 10px 10px 22px rgba(255,255,255,0.07),0 0 70px rgba(236,72,153,0.5),0 0 140px rgba(236,72,153,0.2);
          animation:f3 26s ease-in-out infinite;
        }
        .o3::after{width:32%;height:18%;background:rgba(255,255,255,0.5);top:10%;left:18%;filter:blur(7px);transform:rotate(-25deg);animation:glint 11s ease-in-out infinite 4s}
        .o3::before{width:12%;height:12%;background:rgba(255,255,255,0.85);top:7%;left:22%;filter:blur(3px)}

        /* blue orb */
        .o4{
          width:200px;height:200px;top:20%;left:8%;
          background:radial-gradient(circle at 34% 28%,
            #fff 0%,rgba(255,255,255,0.65) 5%,
            rgba(147,197,253,0.5) 14%,
            rgba(59,130,246,0.7) 32%,
            rgba(29,78,216,0.8) 52%,
            rgba(4,10,30,0.9) 72%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -12px -12px 28px rgba(0,0,0,0.6),inset 7px 7px 16px rgba(255,255,255,0.07),0 0 50px rgba(59,130,246,0.5),0 0 100px rgba(59,130,246,0.2);
          animation:f4 21s ease-in-out infinite 2s;
        }
        .o4::after{width:30%;height:17%;background:rgba(255,255,255,0.5);top:11%;left:18%;filter:blur(6px);transform:rotate(-22deg);animation:glint 8s ease-in-out infinite 1s}
        .o4::before{width:12%;height:12%;background:rgba(255,255,255,0.85);top:8%;left:23%;filter:blur(3px)}

        /* amber orb */
        .o5{
          width:150px;height:150px;bottom:28%;left:28%;
          background:radial-gradient(circle at 32% 27%,
            #fff 0%,rgba(255,255,255,0.65) 5%,
            rgba(253,230,138,0.55) 14%,
            rgba(245,158,11,0.7) 32%,
            rgba(180,83,9,0.8) 52%,
            rgba(20,8,2,0.9) 72%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -9px -9px 20px rgba(0,0,0,0.6),inset 5px 5px 12px rgba(255,255,255,0.07),0 0 40px rgba(245,158,11,0.5),0 0 80px rgba(245,158,11,0.2);
          animation:f5 17s ease-in-out infinite 3s;
        }
        .o5::after{width:30%;height:16%;background:rgba(255,255,255,0.5);top:10%;left:18%;filter:blur(5px);transform:rotate(-24deg);animation:glint 10s ease-in-out infinite 3s}
        .o5::before{width:11%;height:11%;background:rgba(255,255,255,0.85);top:7%;left:22%;filter:blur(2px)}

        /* small purple */
        .o6{
          width:100px;height:100px;top:14%;right:18%;
          background:radial-gradient(circle at 32% 27%,
            #fff 0%,rgba(255,255,255,0.65) 5%,
            rgba(196,181,253,0.55) 14%,
            rgba(124,58,237,0.7) 32%,
            rgba(76,29,149,0.85) 52%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:inset -6px -6px 14px rgba(0,0,0,0.55),inset 4px 4px 8px rgba(255,255,255,0.07),0 0 30px rgba(124,58,237,0.5),0 0 60px rgba(124,58,237,0.2);
          animation:f1 24s ease-in-out infinite 6s;
        }
        .o6::after{width:28%;height:15%;background:rgba(255,255,255,0.5);top:10%;left:18%;filter:blur(4px);transform:rotate(-22deg)}
        .o6::before{width:10%;height:10%;background:rgba(255,255,255,0.85);top:7%;left:22%;filter:blur(2px)}

        /* ── NOISE ── */
        .noise{position:fixed;inset:0;z-index:1;opacity:0.03;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px;
        }

        /* ── NAV ── */
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.5rem 3rem;display:flex;align-items:center;justify-content:space-between;transition:all 0.5s cubic-bezier(0.16,1,0.3,1)}
        .nav.sc{background:rgba(4,4,16,0.85);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border-bottom:1px solid rgba(255,255,255,0.06);padding:1rem 3rem}
        .nlogo{font-size:22px;font-weight:800;letter-spacing:-0.5px;display:flex;align-items:center;gap:10px}
        .nlogo-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#0d9488);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 4px 16px rgba(124,58,237,0.5),0 0 30px rgba(124,58,237,0.2)}
        .npills{display:flex;gap:2px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:100px;padding:4px;backdrop-filter:blur(16px)}
        .np{background:none;border:none;padding:8px 20px;font-size:13px;color:rgba(255,255,255,0.4);font-weight:600;cursor:pointer;border-radius:100px;font-family:inherit;transition:all 0.2s;letter-spacing:0.01em}
        .np:hover{background:rgba(255,255,255,0.1);color:white}
        .nr{display:flex;gap:10px;align-items:center}
        .nlogin{background:none;border:none;font-size:14px;color:rgba(255,255,255,0.35);font-weight:600;cursor:pointer;font-family:inherit;transition:color 0.2s;padding:8px 12px}
        .nlogin:hover{color:white}
        .nstart{background:white;color:#040410;border:none;border-radius:100px;padding:10px 22px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.25s;letter-spacing:-0.2px}
        .nstart:hover{background:linear-gradient(135deg,#a78bfa,#34d399);color:white;transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5)}

        /* ── HERO (TWO COLUMN) ── */
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;padding:10rem 5rem 7rem;position:relative;z-index:2;max-width:1400px;margin:0 auto}
        .hero-l{display:flex;flex-direction:column;align-items:flex-start}
        .hero-r{display:flex;align-items:center;justify-content:center;position:relative}

        .hero-tag{display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(167,139,250,0.3);border-radius:100px;padding:8px 20px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(167,139,250,0.8);margin-bottom:2.25rem;backdrop-filter:blur(16px);background:rgba(124,58,237,0.12);animation:fadeIn 0.8s ease both}
        .htdot{width:6px;height:6px;border-radius:50%;background:#a78bfa;box-shadow:0 0 12px #a78bfa,0 0 24px rgba(167,139,250,0.5);position:relative}
        .htdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:1px solid rgba(167,139,250,0.4);animation:ringExpand 1.8s ease-out infinite}

        .hero-h{font-size:clamp(48px,5.5vw,80px);font-weight:800;line-height:0.97;letter-spacing:-4px;color:white;margin-bottom:1.75rem}
        .hero-h .w{display:inline-block;animation:fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both}
        .hero-h .w1{animation-delay:0.08s}
        .hero-h .w2{animation-delay:0.15s}
        .hero-h .w3{animation-delay:0.22s}
        .hero-h .w4{animation-delay:0.29s}
        .hgrad{background:linear-gradient(130deg,#c4b5fd 0%,#7c3aed 30%,#2dd4bf 65%,#34d399 100%);background-size:200% 200%;animation:shimmer 5s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:17px;color:rgba(255,255,255,0.4);line-height:1.85;max-width:460px;margin-bottom:2.75rem;animation:fadeUp 0.8s ease 0.35s both}
        .hero-sub strong{color:rgba(255,255,255,0.9)}

        .hero-btns{display:flex;gap:12px;flex-wrap:wrap;animation:fadeUp 0.8s ease 0.45s both;margin-bottom:2rem}
        .btn-primary{background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;border:none;border-radius:100px;padding:18px 40px;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.3s;box-shadow:0 8px 32px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2);letter-spacing:-0.2px}
        .btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 50px rgba(124,58,237,0.6),0 0 0 1px rgba(167,139,250,0.35)}
        .btn-outline{background:rgba(255,255,255,0.05);color:white;border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:17px 32px;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit;backdrop-filter:blur(16px);transition:all 0.3s}
        .btn-outline:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.3);transform:translateY(-2px)}

        .hero-free{font-size:12px;color:rgba(255,255,255,0.18);letter-spacing:0.06em;text-transform:uppercase;animation:fadeUp 0.8s ease 0.5s both;margin-bottom:3rem}
        .hero-proof{display:flex;align-items:center;gap:14px;animation:fadeUp 0.8s ease 0.55s both}
        .avrow{display:flex}
        .av{width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);margin-left:-10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:white}
        .av:first-child{margin-left:0}
        .ptxt{font-size:13px;color:rgba(255,255,255,0.35)}
        .ptxt strong{color:rgba(255,255,255,0.85)}

        /* ── HERO RIGHT: BIG ORB + CHAT CARD ── */
        .hero-orb-wrap{position:relative;width:480px;height:480px;animation:heroOrb 18s ease-in-out infinite;flex-shrink:0}
        .hero-orb{
          width:100%;height:100%;border-radius:50%;
          background:radial-gradient(circle at 30% 26%,
            #fff 0%,rgba(255,255,255,0.8) 4%,
            rgba(216,180,254,0.6) 10%,
            rgba(139,92,246,0.65) 25%,
            rgba(109,40,217,0.7) 42%,
            rgba(13,148,136,0.5) 58%,
            rgba(10,20,50,0.9) 75%,
            rgba(4,4,16,1) 100%
          );
          box-shadow:
            inset -40px -40px 80px rgba(0,0,0,0.6),
            inset 20px 20px 40px rgba(255,255,255,0.06),
            0 0 120px rgba(124,58,237,0.6),
            0 0 240px rgba(124,58,237,0.25),
            0 0 400px rgba(13,148,136,0.15);
        }
        .hero-orb::before{content:'';position:absolute;width:42%;height:24%;background:rgba(255,255,255,0.55);top:10%;left:15%;filter:blur(12px);transform:rotate(-28deg);border-radius:50%}
        .hero-orb::after{content:'';position:absolute;width:15%;height:15%;background:rgba(255,255,255,0.92);top:7%;left:20%;filter:blur(5px);border-radius:50%;box-shadow:0 0 20px rgba(255,255,255,0.7)}
        .hero-chat-float{
          position:absolute;bottom:-24px;left:-60px;
          background:rgba(10,8,25,0.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(167,139,250,0.25);border-radius:20px;
          padding:16px 20px;width:260px;
          box-shadow:0 20px 60px rgba(0,0,0,0.6),0 0 40px rgba(124,58,237,0.2);
          animation:fadeUp 1s ease 0.7s both;
        }
        .hcf-msg{font-size:11px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:10px}
        .hcf-line{display:flex;align-items:center;gap:8px;margin-bottom:6px}
        .hcf-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
        .hcf-txt{font-size:11px;color:rgba(255,255,255,0.5);font-weight:500}
        .hero-score-float{
          position:absolute;top:-20px;right:-50px;
          background:rgba(10,8,25,0.85);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(52,211,153,0.25);border-radius:18px;
          padding:14px 18px;
          box-shadow:0 16px 50px rgba(0,0,0,0.5),0 0 30px rgba(16,185,129,0.15);
          animation:fadeUp 1s ease 0.85s both;
          display:flex;align-items:center;gap:12px;
        }
        .hsf-num{font-size:30px;font-weight:800;background:linear-gradient(135deg,#34d399,#059669);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
        .hsf-lbl{font-size:9px;font-weight:800;color:#34d399;letter-spacing:0.07em;text-transform:uppercase}
        .hsf-sub{font-size:9px;color:rgba(255,255,255,0.3);margin-top:3px}

        /* ── MARQUEE ── */
        .mq-wrap{position:relative;z-index:2;overflow:hidden;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);padding:1.1rem 0;mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent)}
        .mq-track{display:flex;gap:0;width:max-content;animation:marquee 28s linear infinite}
        .mq-item{display:flex;align-items:center;gap:10px;padding:0 2.5rem;font-size:12px;font-weight:700;color:rgba(255,255,255,0.25);white-space:nowrap;letter-spacing:0.06em;text-transform:uppercase}

        /* ── SECTIONS ── */
        .sec{padding:8rem 5rem;position:relative;z-index:2}
        .w{max-width:1160px;margin:0 auto}
        .w-sm{max-width:840px;margin:0 auto}
        .w-xs{max-width:660px;margin:0 auto}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:1.25rem}
        .eyebrow::before{content:'';display:block;width:22px;height:1px;background:rgba(255,255,255,0.2)}
        .sh{font-size:clamp(36px,4.5vw,58px);font-weight:800;letter-spacing:-2.5px;line-height:1.04;color:white}
        .grad{background:linear-gradient(130deg,#c4b5fd 0%,#7c3aed 40%,#34d399 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .div{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)}

        /* ── GLASS CARD ── */
        .gc{background:rgba(255,255,255,0.03);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);border-radius:28px}
        .gch{transition:all 0.4s cubic-bezier(0.16,1,0.3,1)}
        .gch:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.14);transform:translateY(-6px);box-shadow:0 32px 80px rgba(0,0,0,0.6),0 0 60px rgba(124,58,237,0.1)}

        /* ── HOW IT WORKS ── */
        .hiw{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:4rem}
        .hiw-c{padding:2.5rem;border-radius:28px;position:relative;overflow:hidden}
        .hiw-c::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)}
        .hiw-n{width:66px;height:66px;border-radius:20px;background:linear-gradient(135deg,#7c3aed,#0d9488);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:white;margin-bottom:1.75rem;box-shadow:0 10px 32px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2)}
        .hiw-t{font-size:21px;font-weight:800;color:white;letter-spacing:-0.5px;margin-bottom:0.75rem}
        .hiw-d{font-size:15px;color:rgba(255,255,255,0.4);line-height:1.8}

        /* ── FEATURES GRID ── */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:4rem}
        .feat-c{padding:1.75rem;border-radius:28px;position:relative;overflow:hidden;display:flex;flex-direction:column}
        .feat-c::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)}
        .feat-mockup-wrap{border-radius:14px;overflow:hidden;margin-bottom:1.25rem;flex-shrink:0}
        .feat-chip{display:inline-block;padding:3px 12px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px}
        .feat-t{font-size:19px;font-weight:800;color:white;letter-spacing:-0.4px;margin-bottom:8px}
        .feat-d{font-size:14px;color:rgba(255,255,255,0.4);line-height:1.75}

        /* ── TESTIMONIALS ── */
        .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:4rem}
        .testi-c{padding:2.25rem;border-radius:28px;position:relative;overflow:hidden}
        .testi-c::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)}
        .testi-stars{font-size:13px;color:#fbbf24;letter-spacing:2.5px;margin-bottom:1.25rem}
        .testi-q{font-size:15px;color:rgba(255,255,255,0.65);line-height:1.8;font-style:italic;margin-bottom:1.75rem}
        .testi-auth{display:flex;align-items:center;gap:14px}
        .testi-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;flex-shrink:0}
        .testi-name{font-size:14px;font-weight:700;color:white}
        .testi-h{font-size:12px;color:rgba(255,255,255,0.3);margin-top:3px}

        /* ── COMPARISON ── */
        .cmp-tbl{width:100%;border-collapse:collapse}
        .cmp-tbl thead{background:linear-gradient(135deg,rgba(124,58,237,0.25),rgba(13,148,136,0.18))}
        .cmp-tbl thead th{padding:1.25rem 1.75rem;font-size:14px;font-weight:700;color:white;text-align:center}
        .cmp-tbl thead th:first-child{text-align:left;font-size:11px;font-weight:600;color:rgba(255,255,255,0.3);letter-spacing:0.08em;text-transform:uppercase}
        .cmp-tbl tbody tr{border-bottom:1px solid rgba(255,255,255,0.04)}
        .cmp-tbl tbody tr:last-child{border-bottom:none}
        .cmp-tbl tbody tr:nth-child(even){background:rgba(255,255,255,0.015)}
        .cmp-tbl tbody td{padding:1.1rem 1.75rem;font-size:14px;color:rgba(255,255,255,0.45);text-align:center}
        .cmp-tbl tbody td:first-child{text-align:left;color:rgba(255,255,255,0.8);font-weight:600}
        .cmp-hl{background:rgba(124,58,237,0.07) !important}
        .cy{color:#34d399;font-size:17px;font-weight:800}
        .cn{color:rgba(255,255,255,0.12);font-size:17px}
        .cp{color:#fbbf24;font-size:12px;font-weight:700}

        /* ── STATS ── */
        .stats-sec{padding:8rem 5rem;text-align:center;position:relative;z-index:2}
        .stats-q{font-size:clamp(36px,5vw,60px);font-weight:800;letter-spacing:-3px;line-height:1.08;color:white;margin-bottom:1rem}
        .stats-s{font-size:16px;color:rgba(255,255,255,0.3);margin-bottom:5rem;line-height:1.75}
        .stats-row{display:flex;justify-content:center;gap:6rem;flex-wrap:wrap}
        .stat-n{font-size:clamp(44px,6vw,72px);font-weight:800;letter-spacing:-3px;line-height:1}
        .stat-l{font-size:12px;color:rgba(255,255,255,0.28);margin-top:10px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase}

        /* ── PRICING ── */
        .tog-row{display:flex;align-items:center;gap:14px;margin-bottom:4rem}
        .tog-lbl{font-size:14px;font-weight:600;color:rgba(255,255,255,0.28)}
        .tog-lbl.on{color:white}
        .tog{width:52px;height:28px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:100px;position:relative;cursor:pointer;padding:0;transition:all 0.3s}
        .tog.on{background:linear-gradient(135deg,#7c3aed,#0d9488);border-color:transparent;box-shadow:0 0 20px rgba(124,58,237,0.4)}
        .tog-k{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:white;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:0 2px 8px rgba(0,0,0,0.3)}
        .tog.on .tog-k{transform:translateX(24px)}
        .save-pill{background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);color:#34d399;font-size:11px;font-weight:800;padding:4px 14px;border-radius:100px}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .price-c{border-radius:32px;padding:2.75rem;position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.16,1,0.3,1)}
        .price-c::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)}
        .price-c:hover{transform:translateY(-8px)}
        .price-c.ft{background:linear-gradient(155deg,rgba(124,58,237,0.22),rgba(13,148,136,0.14)) !important;border-color:rgba(167,139,250,0.35) !important;box-shadow:0 0 0 1px rgba(167,139,250,0.18),0 40px 100px rgba(124,58,237,0.3) !important}
        .price-c.ft:hover{box-shadow:0 0 0 1px rgba(167,139,250,0.3),0 60px 120px rgba(124,58,237,0.4) !important}
        .price-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;font-size:10px;font-weight:800;padding:6px 20px;border-radius:0 0 14px 14px;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 16px rgba(124,58,237,0.4)}
        .price-tier{font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:12px;margin-top:0.75rem}
        .price-amt{font-size:clamp(44px,5vw,62px);font-weight:800;letter-spacing:-3px;line-height:1;color:white;margin-bottom:4px}
        .price-per{font-size:16px;font-weight:500;color:rgba(255,255,255,0.3)}
        .price-desc{font-size:14px;color:rgba(255,255,255,0.32);margin-bottom:2.25rem;margin-top:5px}
        .price-feats{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:2.5rem}
        .price-feats li{font-size:14px;font-weight:500;color:rgba(255,255,255,0.7);display:flex;align-items:flex-start;gap:10px;line-height:1.5}
        .pck{color:#34d399;font-weight:800;flex-shrink:0;margin-top:1px}
        .pbtn{width:100%;border-radius:100px;padding:15px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all 0.25s}
        .pbtn:hover{transform:translateY(-2px)}
        .pbtn-g{background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;box-shadow:0 8px 28px rgba(124,58,237,0.45)}
        .pbtn-g:hover{box-shadow:0 14px 40px rgba(124,58,237,0.6)}
        .pbtn-o{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);border:1px solid rgba(255,255,255,0.12) !important}
        .pbtn-o:hover{background:rgba(255,255,255,0.1);color:white}

        /* ── FAQ ── */
        .faq-list{margin-top:4rem;display:flex;flex-direction:column;gap:12px}
        .faq-item{border-radius:20px;overflow:hidden;transition:all 0.3s cubic-bezier(0.16,1,0.3,1)}
        .faq-item.open{border-color:rgba(124,58,237,0.4) !important;box-shadow:0 0 0 1px rgba(124,58,237,0.15),0 10px 40px rgba(124,58,237,0.1)}
        .faq-btn{width:100%;background:none;border:none;display:flex;justify-content:space-between;align-items:center;padding:1.4rem 1.75rem;text-align:left;cursor:pointer;font-family:inherit}
        .faq-q{font-size:15px;font-weight:700;color:white;flex:1;padding-right:1rem;line-height:1.5}
        .faq-icon{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:16px;color:rgba(255,255,255,0.4);flex-shrink:0;transition:all 0.3s}
        .faq-item.open .faq-icon{transform:rotate(180deg);background:rgba(124,58,237,0.3);color:#c4b5fd}
        .faq-ans{padding:0 1.75rem 1.5rem;font-size:14px;color:rgba(255,255,255,0.42);line-height:1.88}

        /* ── CTA ── */
        .cta-sec{padding:10rem 5rem;text-align:center;position:relative;z-index:2}
        .cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(124,58,237,0.14),transparent);pointer-events:none}
        .cta-h{font-size:clamp(42px,6vw,80px);font-weight:800;letter-spacing:-4px;line-height:1.02;color:white;margin-bottom:1.75rem}
        .cta-p{font-size:18px;color:rgba(255,255,255,0.32);line-height:1.8;margin-bottom:3rem;max-width:480px;margin-left:auto;margin-right:auto}
        .btn-cta{background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;border:none;border-radius:100px;padding:22px 56px;font-size:18px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.3s;box-shadow:0 12px 40px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2);letter-spacing:-0.3px}
        .btn-cta:hover{transform:translateY(-3px);box-shadow:0 24px 60px rgba(124,58,237,0.65),0 0 0 1px rgba(167,139,250,0.35)}
        .cta-note{margin-top:1.75rem;font-size:12px;color:rgba(255,255,255,0.18);letter-spacing:0.05em;text-transform:uppercase}

        /* ── FOOTER ── */
        .footer{position:relative;z-index:2;border-top:1px solid rgba(255,255,255,0.05);background:rgba(0,0,0,0.35);backdrop-filter:blur(20px);padding:2rem 5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
        .flogo{font-size:20px;font-weight:800}
        .fcopy{font-size:12px;color:rgba(255,255,255,0.2)}
        .flinks{display:flex;gap:1.5rem}
        .fl{background:none;border:none;font-size:13px;color:rgba(255,255,255,0.2);cursor:pointer;font-family:inherit;transition:color 0.2s;padding:0}
        .fl:hover{color:rgba(255,255,255,0.6)}

        /* ── RESPONSIVE ── */
        @media(max-width:1024px){
          .hero{grid-template-columns:1fr;padding:8rem 3rem 5rem;max-width:100%}
          .hero-r{display:none}
          .hero-l{align-items:center;text-align:center}
          .hero-h{text-align:center}
          .hero-sub{text-align:center}
          .hero-btns{justify-content:center}
          .hero-proof{justify-content:center}
          .sec{padding:5rem 2rem}
          .stats-sec{padding:5rem 2rem}
          .cta-sec{padding:6rem 2rem}
          .footer{padding:2rem}
        }
        @media(max-width:860px){
          .nav{padding:1rem 1.5rem}
          .nav.sc{padding:0.75rem 1.5rem}
          .npills,.nlogin{display:none}
          .hiw{grid-template-columns:1fr;gap:14px}
          .feat-grid{grid-template-columns:1fr 1fr;gap:14px}
          .testi-grid{grid-template-columns:1fr;gap:14px}
          .price-grid{grid-template-columns:1fr;gap:16px}
          .stats-row{gap:3rem}
        }
        @media(max-width:560px){
          .hero-h{letter-spacing:-2.5px}
          .feat-grid{grid-template-columns:1fr}
          .stats-row{flex-direction:column;gap:2.5rem}
          .cta-h{letter-spacing:-2.5px}
          .btn-primary,.btn-outline{width:100%;text-align:center}
          .hero-btns{flex-direction:column;width:100%;max-width:300px}
        }
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms !important;transition-duration:0.01ms !important}}
      `}</style>

      {/* ── ORB STAGE ── */}
      <div className="orb-stage" aria-hidden="true">
        <div className="bg-glow bg-g1" />
        <div className="bg-glow bg-g2" />
        <div className="bg-glow bg-g3" />
        <div className="orb o1" style={{ transform: `translate(${orbX * 0.5}px,${orbY * 0.4}px)` }} />
        <div className="orb o2" style={{ transform: `translate(${-orbX * 0.35}px,${-orbY * 0.3}px)` }} />
        <div className="orb o3" style={{ transform: `translate(${orbX * 0.25}px,${orbY * 0.45}px)` }} />
        <div className="orb o4" style={{ transform: `translate(${-orbX * 0.45}px,${orbY * 0.3}px)` }} />
        <div className="orb o5" style={{ transform: `translate(${orbX * 0.6}px,${-orbY * 0.35}px)` }} />
        <div className="orb o6" style={{ transform: `translate(${-orbX * 0.3}px,${orbY * 0.5}px)` }} />
      </div>
      <div className="noise" aria-hidden="true" />

      <div className="page">

        {/* ── NAV ── */}
        <nav className={`nav ${scrolled ? 'sc' : ''}`}>
          <div className="nlogo">
            <div className="nlogo-icon">✦</div>
            <span>Clarity</span>
          </div>
          <div className="npills">
            <button className="np" onClick={() => scrollToSection('how-it-works')}>How it works</button>
            <button className="np" onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button className="np" onClick={() => scrollToSection('faq')}>FAQ</button>
          </div>
          <div className="nr">
            <button className="nlogin" onClick={() => router.push('/login')}>Log in</button>
            <button className="nstart" onClick={() => router.push('/login')}>Start free →</button>
          </div>
        </nav>

        {/* ── HERO (TWO COLUMN) ── */}
        <section className="hero">
          {/* LEFT */}
          <div className="hero-l">
            <div className="hero-tag">
              <span className="htdot" aria-hidden="true" />
              AI-powered for creators &amp; thinkers
            </div>

            <h1 className="hero-h">
              <span className="w w1">Your brain</span><br />
              <span className="w w2">thinks in</span>&nbsp;<span className="w w3 hgrad">chaos.</span><br />
              <span className="w w4" style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.88em' }}>We fix that.</span>
            </h1>

            <p className="hero-sub">
              Dump your thoughts into Clarity. The AI organizes everything and turns it into <strong>spreadsheets, calendars, and action plans</strong> — in seconds.
            </p>

            <div className="hero-btns">
              <button className="btn-primary" onClick={() => router.push('/login')}>Organize my ideas free →</button>
              <button className="btn-outline" onClick={() => scrollToSection('how-it-works')}>See how it works</button>
            </div>

            <p className="hero-free">Free forever · No credit card · Ready in 30 seconds</p>

            <div className="hero-proof">
              <div className="avrow" aria-hidden="true">
                {[
                  { l: 'M', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
                  { l: 'J', bg: 'linear-gradient(135deg,#059669,#34d399)' },
                  { l: 'N', bg: 'linear-gradient(135deg,#db2777,#f472b6)' },
                  { l: 'A', bg: 'linear-gradient(135deg,#d97706,#fbbf24)' },
                  { l: 'R', bg: 'linear-gradient(135deg,#1d4ed8,#60a5fa)' },
                ].map((a, i) => <div key={i} className="av" style={{ background: a.bg }}>{a.l}</div>)}
              </div>
              <p className="ptxt"><strong>2,400+ creators</strong> stopped losing their ideas</p>
            </div>
          </div>

          {/* RIGHT: BIG ORB + FLOATING CARDS */}
          <div className="hero-r">
            <div className="hero-orb-wrap">
              <div className="hero-orb" />

              {/* floating chat card */}
              <div className="hero-chat-float">
                <div className="hcf-msg">✦ Your growth plan is ready</div>
                {[
                  { c: '#a78bfa', t: 'Post 4x/week · 6–8pm' },
                  { c: '#34d399', t: '60% educational content' },
                  { c: '#fbbf24', t: 'Content calendar ↓ ready' },
                ].map((item, i) => (
                  <div key={i} className="hcf-line">
                    <div className="hcf-dot" style={{ background: item.c, boxShadow: `0 0 8px ${item.c}` }} />
                    <span className="hcf-txt">{item.t}</span>
                  </div>
                ))}
              </div>

              {/* floating score card */}
              <div className="hero-score-float">
                <div className="hsf-num">87</div>
                <div>
                  <div className="hsf-lbl">Clarity Score</div>
                  <div className="hsf-sub">+12 from last week</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="mq-wrap" aria-hidden="true">
          <div className="mq-track">
            {[
              'Private & secure','✦','Powered by Claude AI','✦','Results in seconds','✦',
              'No credit card','✦','40+ countries','✦','Free forever plan','✦',
              'Real downloadable files','✦','Built for creators','✦',
              'Private & secure','✦','Powered by Claude AI','✦','Results in seconds','✦',
              'No credit card','✦','40+ countries','✦','Free forever plan','✦',
              'Real downloadable files','✦','Built for creators','✦',
            ].map((t, i) => (
              <span key={i} className="mq-item" style={{ color: t === '✦' ? 'rgba(167,139,250,0.35)' : undefined }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="sec">
          <div className="w">
            <p className="eyebrow">How it works</p>
            <h2 className="sh" style={{ maxWidth: '560px' }}>
              Three steps from <span className="grad">scattered to sorted.</span>
            </h2>
            <div className="hiw">
              {[
                { n: '1', t: 'Dump everything', d: 'Type your ideas, goals, or tasks — messy, half-formed, whatever. No formatting needed. Clarity accepts it all.' },
                { n: '2', t: 'AI organizes it', d: 'Clarity asks smart follow-up questions, then organizes your thoughts into a clear, structured plan automatically.' },
                { n: '3', t: 'Download and act', d: 'Get a real Excel spreadsheet, content calendar, or action plan downloaded to your device in one click.' },
              ].map((s, i) => (
                <div key={i} className="hiw-c gc gch">
                  <div className="hiw-n">{s.n}</div>
                  <div className="hiw-t">{s.t}</div>
                  <p className="hiw-d">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── SIX FEATURES WITH MOCKUPS ── */}
        <section id="product" className="sec">
          <div className="w">
            <p className="eyebrow">What&apos;s inside</p>
            <h2 className="sh" style={{ maxWidth: '540px', marginBottom: '0' }}>
              Six tools. Built for creators who think <span className="grad">fast.</span>
            </h2>
            <div className="feat-grid">
              {features.map((f, i) => (
                <div key={i} className="feat-c gc gch" style={{ background: `rgba(${f.accent === '#7c3aed' ? '124,58,237' : f.accent === '#059669' ? '5,150,105' : f.accent === '#d97706' ? '217,119,6' : f.accent === '#db2777' ? '219,39,119' : f.accent === '#2563eb' ? '37,99,235' : '124,58,237'},0.04)` }}>
                  {/* mockup preview */}
                  <div className="feat-mockup-wrap">
                    {mockups[f.mockup]}
                  </div>
                  <span className="feat-chip" style={{ background: f.chipBg, color: f.chipC }}>{f.chip}</span>
                  <div className="feat-t">{f.t}</div>
                  <p className="feat-d">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── TESTIMONIALS ── */}
        <section className="sec">
          <div className="w">
            <p className="eyebrow">Real creators. Real results.</p>
            <h2 className="sh" style={{ maxWidth: '560px', marginBottom: '0' }}>
              They stopped losing ideas. <span className="grad">So can you.</span>
            </h2>
            <div className="testi-grid">
              {[
                { stars: '★★★★★', q: '"I had 47 voice memos I never listened to. I pasted them all into Clarity and had a 4-week content calendar downloaded in under 20 minutes. Actually insane."', name: 'Maya T.', handle: 'TikTok fitness · 52K followers', i: 'M', bg: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
                { stars: '★★★★★', q: '"I used to lose 3–4 video ideas per week. Now everything goes straight into Clarity. I haven\'t run out of content in two months. Absolute game changer."', name: 'Jake R.', handle: 'YouTube tech reviewer · 28K subs', i: 'J', bg: 'linear-gradient(135deg,#059669,#34d399)' },
                { stars: '★★★★★', q: '"The video analysis feature is worth the price alone. I pasted 3 competitor videos and had 30 content ideas in 5 minutes. I use it every single week."', name: 'Nina K.', handle: 'Lifestyle creator · 31K Instagram', i: 'N', bg: 'linear-gradient(135deg,#db2777,#f472b6)' },
              ].map((t, i) => (
                <div key={i} className="testi-c gc gch">
                  <div className="testi-stars">{t.stars}</div>
                  <p className="testi-q">{t.q}</p>
                  <div className="testi-auth">
                    <div className="testi-av" style={{ background: t.bg }}>{t.i}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-h">{t.handle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── COMPARISON ── */}
        <section className="sec">
          <div className="w-sm">
            <p className="eyebrow">Why Clarity</p>
            <h2 className="sh" style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Not just another <span className="grad">notes app.</span>
            </h2>
            <div className="gc" style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <table className="cmp-tbl">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Feature</th>
                    <th>✦ Clarity</th>
                    <th>Notes App</th>
                    <th>ChatGPT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Organizes automatically', true, false, false],
                    ['Remembers your ideas', true, true, false],
                    ['Generates real files', true, false, false],
                    ['Asks smart follow-ups', true, false, 'partial'],
                    ['Built for creators', true, false, false],
                    ['Tracks your growth', true, false, false],
                    ['Free to start', true, true, true],
                  ].map(([lbl, c, n, g], i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>{lbl}</td>
                      <td className="cmp-hl">{c === true ? <span className="cy">✓</span> : <span className="cn">—</span>}</td>
                      <td>{n === true ? <span className="cy">✓</span> : <span className="cn">—</span>}</td>
                      <td>{g === true ? <span className="cy">✓</span> : g === 'partial' ? <span className="cp">Partial</span> : <span className="cn">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── STATS ── */}
        <section className="stats-sec">
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>By the numbers</p>
            <h2 className="stats-q">
              &ldquo;ChatGPT forgets you.<br /><span className="grad">Clarity grows with you.&rdquo;</span>
            </h2>
            <p className="stats-s">Your AI remembers every idea, tracks growth over time, and turns scattered thoughts into action — every week.</p>
            <div className="stats-row">
              {[
                { n: '2.4K+', l: 'Active creators', c: '#a78bfa' },
                { n: '7 days', l: 'To see results', c: '#34d399' },
                { n: '1 app', l: 'For everything', c: '#60a5fa' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div className="stat-n" style={{ background: `linear-gradient(135deg,${s.c},white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.n}</div>
                  <div className="stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── PRICING ── */}
        <section id="pricing" className="sec">
          <div className="w">
            <p className="eyebrow">Pricing</p>
            <h2 className="sh">Start free. <span className="grad">Upgrade when ready.</span></h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.28)', marginBottom: '2.5rem' }}>No hidden fees. No contracts. Cancel anytime.</p>
            <div className="tog-row">
              <span className={`tog-lbl ${!annual ? 'on' : ''}`}>Monthly</span>
              <button className={`tog ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-pressed={annual}>
                <span className="tog-k" />
              </button>
              <span className={`tog-lbl ${annual ? 'on' : ''}`}>Annual</span>
              {annual && <span className="save-pill">Save 25%</span>}
            </div>
            <div className="price-grid">
              {[
                { name: 'Free', price: '$0', per: '', desc: 'Everything to get started', feats: ['5 AI messages per day', 'Dashboard & ideas library', 'AI brain dump', 'Spreadsheet downloads'], btn: 'Get started free', ft: false },
                { name: 'Pro', price: annual ? `$${(proMonthly * 0.75).toFixed(2)}` : `$${proMonthly}`, per: '/mo', desc: 'For creators serious about growth', feats: ['Unlimited AI messages', 'Clarity Score weekly report', 'Spreadsheet & calendar generator', 'Content brief & post schedule', 'Content tools (captions, hooks, hashtags)'], btn: 'Start Pro', ft: true },
                { name: 'Premium', price: annual ? `$${(premiumMonthly * 0.75).toFixed(2)}` : `$${premiumMonthly}`, per: '/mo', desc: 'For power users who want everything', feats: ['Everything in Pro', 'Video analysis (any YouTube URL)', 'Unlimited AI + priority responses', 'Advanced content docs', 'Early access to new features'], btn: 'Start Premium', ft: false },
              ].map(p => (
                <div key={p.name} className={`price-c gc ${p.ft ? 'ft' : ''}`}>
                  {p.ft && <div className="price-badge">⭐ Most Popular</div>}
                  <div className="price-tier">{p.name}</div>
                  <div className="price-amt">{p.price}<span className="price-per">{p.per}</span></div>
                  <p className="price-desc">{p.desc}</p>
                  <ul className="price-feats">
                    {p.feats.map(f => <li key={f}><span className="pck">✓</span>{f}</li>)}
                  </ul>
                  <button className={`pbtn ${p.ft ? 'pbtn-g' : 'pbtn-o'}`} onClick={() => router.push('/login')}>{p.btn}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="div" />

        {/* ── FAQ ── */}
        <section id="faq" className="sec">
          <div className="w-xs">
            <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>FAQ</p>
            <h2 className="sh" style={{ textAlign: 'center' }}>Questions? <span className="grad">Answered.</span></h2>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div key={i} className={`faq-item gc ${activeFaq === i ? 'open' : ''}`}>
                  <button className="faq-btn" onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}>
                    <span className="faq-q">{f.q}</span>
                    <span className="faq-icon">▾</span>
                  </button>
                  {activeFaq === i && <div className="faq-ans">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec">
          <div className="cta-glow" aria-hidden="true" />
          <div className="w-xs" style={{ position: 'relative', zIndex: 1 }}>
            <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>Start today</p>
            <h2 className="cta-h">
              Your best ideas deserve more than <span className="grad">a voice memo.</span>
            </h2>
            <p className="cta-p">Join 2,400+ creators who turned scattered thoughts into real action. Free to start. No credit card. No excuses.</p>
            <button className="btn-cta" onClick={() => router.push('/login')}>Organize my ideas free →</button>
            <p className="cta-note">Free forever plan · No credit card · Cancel paid plans anytime</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer id="about" className="footer">
          <div className="flogo"><span className="grad">✦ Clarity</span></div>
          <div className="fcopy">© 2026 Clarity. All rights reserved.</div>
          <nav className="flinks">
            <button className="fl" onClick={() => router.push('/privacy')}>Privacy</button>
            <button className="fl" onClick={() => router.push('/terms')}>Terms</button>
            <button className="fl" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </footer>

      </div>
    </>
  )
}
