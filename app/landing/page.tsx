'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

const REVEAL_R = 260

function RevealLayer({ image, cursorX, cursorY }: { image: string; cursorX: number; cursorY: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [maskUrl, setMaskUrl] = useState<string | null>(null)

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, REVEAL_R)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, REVEAL_R, 0, Math.PI * 2)
    ctx.fill()
    setMaskUrl(canvas.toDataURL())
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="reveal-canvas" aria-hidden="true" />
      <div
        className="reveal-mask"
        style={{
          backgroundImage: image,
          WebkitMaskImage: maskUrl ? `url(${maskUrl})` : undefined,
          maskImage: maskUrl ? `url(${maskUrl})` : undefined,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        } as React.CSSProperties}
      />
    </>
  )
}

function RevealHero({ onStart }: { onStart: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealCursor, setRevealCursor] = useState({ x: -999, y: -999 })
  const revealMouse = useRef({ x: -999, y: -999 })
  const revealSmooth = useRef({ x: -999, y: -999 })
  const revealRaf = useRef<number | null>(null)

  useEffect(() => {
    const handleRevealMove = (e: MouseEvent) => {
      revealMouse.current.x = e.clientX
      revealMouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleRevealMove, { passive: true })

    const tick = () => {
      // Mouse coords are viewport-relative, but the canvas/mask are positioned
      // relative to this section — so subtract the section's own scroll offset
      // or the spotlight drifts away from the real cursor once the page scrolls.
      const rect = sectionRef.current?.getBoundingClientRect()
      const targetX = revealMouse.current.x - (rect?.left ?? 0)
      const targetY = revealMouse.current.y - (rect?.top ?? 0)
      revealSmooth.current.x += (targetX - revealSmooth.current.x) * 0.1
      revealSmooth.current.y += (targetY - revealSmooth.current.y) * 0.1
      setRevealCursor({ x: revealSmooth.current.x, y: revealSmooth.current.y })
      revealRaf.current = requestAnimationFrame(tick)
    }
    revealRaf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleRevealMove)
      if (revealRaf.current) cancelAnimationFrame(revealRaf.current)
    }
  }, [])

  return (
    <section className="reveal-sec" ref={sectionRef}>
      <div
        className="reveal-base"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(167,139,250,0.45), transparent 22%),' +
            'radial-gradient(circle at 80% 12%, rgba(244,114,182,0.4), transparent 20%),' +
            'radial-gradient(circle at 28% 75%, rgba(251,191,36,0.35), transparent 24%),' +
            'radial-gradient(circle at 88% 68%, rgba(94,234,212,0.4), transparent 22%),' +
            'radial-gradient(circle at 55% 42%, rgba(124,58,237,0.35), transparent 28%),' +
            'radial-gradient(circle at 18% 90%, rgba(96,165,250,0.3), transparent 20%),' +
            'linear-gradient(160deg, #060418 0%, #0a0620 55%, #040410 100%)',
        }}
      />

      <RevealLayer
        cursorX={revealCursor.x}
        cursorY={revealCursor.y}
        image="repeating-linear-gradient(0deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 42px), linear-gradient(135deg, #7c3aed 0%, #0d9488 55%, #34d399 100%)"
      />

      <div className="reveal-h">
        <h1>
          <span className="l1 grad reveal-anim reveal-rise" style={{ animationDelay: '0.25s' }}>Find the clarity</span>
          <span className="l2 reveal-anim reveal-rise" style={{ animationDelay: '0.42s' }}>in your chaos</span>
        </h1>
      </div>

      <div className="reveal-bl reveal-anim reveal-fade-in" style={{ animationDelay: '0.7s' }}>
        <p>Every idea you&apos;ve ever typed is still in there. Move your cursor and watch Clarity bring it into focus.</p>
      </div>

      <div className="reveal-br reveal-anim reveal-fade-in" style={{ animationDelay: '0.85s' }}>
        <p>This is what happens every time you brain-dump: chaos in, a clear plan out — in seconds.</p>
        <button type="button" className="btn-primary" onClick={onStart}>Start free →</button>
      </div>
    </section>
  )
}

export default function Landing() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [annual, setAnnual] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [motes, setMotes] = useState<{ left: number; size: number; color: string; duration: number; delay: number }[]>([])

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

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const colors = ['#a78bfa', '#5eead4', '#f9a8d4', '#93c5fd']
    // setState is deferred into the rAF callback (rather than called inline in the
    // effect body) so this is a subscription-style update, not a synchronous one.
    const raf = requestAnimationFrame(() => {
      setMotes(Array.from({ length: 18 }, (_, i) => ({
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 1.5,
        color: colors[i % colors.length],
        duration: Math.random() * 8 + 12,
        delay: -(Math.random() * 14),
      })))
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const nx = mousePos.x - 0.5
  const ny = mousePos.y - 0.5

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

        /* ── DESIGN TOKENS (primitive → semantic) ── */
        :root{
          --c-bg:#040410;
          --c-violet:#7c3aed; --c-violet-light:#a78bfa; --c-violet-pale:#c4b5fd;
          --c-teal:#0d9488; --c-emerald:#34d399; --c-emerald-deep:#059669;
          --c-pink:#ec4899; --c-pink-light:#f472b6;
          --c-amber:#f59e0b; --c-amber-light:#fbbf24;
          --c-blue:#3b82f6; --c-blue-light:#60a5fa;
          --c-text:#ffffff;
          --c-text-muted:rgba(255,255,255,0.62);
          --c-text-faint:rgba(255,255,255,0.42);
          --c-border:rgba(255,255,255,0.08);
          --c-border-strong:rgba(255,255,255,0.16);
          --c-surface:rgba(255,255,255,0.03);
          --c-focus-ring:#a78bfa;
          --r-pill:100px; --r-card:28px; --r-sm:14px;
          --sp-1:4px; --sp-2:8px; --sp-3:16px; --sp-4:24px; --sp-5:40px;
          --dur-fast:150ms; --dur-base:250ms; --dur-slow:400ms;
          --ease-out:cubic-bezier(0.16,1,0.3,1);
        }

        body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--c-bg);color:var(--c-text);-webkit-font-smoothing:antialiased;overflow-x:hidden}

        /* ── ACCESSIBILITY: focus-visible rings on all interactive elements ── */
        a:focus-visible,button:focus-visible,[role="button"]:focus-visible,input:focus-visible{
          outline:2px solid var(--c-focus-ring);
          outline-offset:3px;
          border-radius:8px;
        }
        .btn-primary:focus-visible,.btn-outline:focus-visible,.nstart:focus-visible,.np:focus-visible,.pbtn:focus-visible,.nlogin:focus-visible,.tog:focus-visible{
          border-radius:var(--r-pill);
        }
        button{font-family:inherit}

        /* ── KEYFRAMES ── */
        @keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes heroOrb{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}20%{transform:translate(30px,-20px) scale(1.03) rotate(3deg)}40%{transform:translate(-15px,25px) scale(0.98) rotate(-2deg)}60%{transform:translate(20px,15px) scale(1.02) rotate(2deg)}80%{transform:translate(-25px,-10px) scale(1) rotate(-1deg)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes ringExpand{0%{transform:scale(0.8);opacity:0.6}100%{transform:scale(1.8);opacity:0}}
        @keyframes gridDrift{from{background-position:0 0}to{background-position:0 48px}}
        @keyframes horizonPulse{0%,100%{opacity:.35}50%{opacity:.8}}
        @keyframes spotBreathe{0%,100%{opacity:.5}50%{opacity:.95}}
        @keyframes spotFadeA{0%,100%{opacity:1}33%{opacity:.15}66%{opacity:.15}}
        @keyframes spotFadeB{0%,100%{opacity:.15}33%{opacity:1}66%{opacity:.15}}
        @keyframes spotFadeC{0%,100%{opacity:.15}33%{opacity:.15}66%{opacity:1}}
        @keyframes moteRise{0%{transform:translateY(0) scale(.6);opacity:0}10%{opacity:.85}85%{opacity:.4}100%{transform:translateY(-100vh) scale(1.1);opacity:0}}

        /* ── GRID + SPOTLIGHT BG ── */
        .gbg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:var(--c-bg)}
        .gbg-grid{position:absolute;inset:-60% -20% -20% -20%;
          background-image:linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size:48px 48px;
          transform:perspective(600px) rotateX(62deg);
          transform-origin:top center;
          -webkit-mask-image:linear-gradient(to bottom, transparent, black 35%, black 75%, transparent);
          mask-image:linear-gradient(to bottom, transparent, black 35%, black 75%, transparent);
          animation:gridDrift 16s linear infinite;
          transition:transform .5s cubic-bezier(.16,1,.3,1);
        }
        .gbg-horizon{position:absolute;top:18%;left:8%;right:8%;height:2px;
          background:linear-gradient(90deg,transparent,var(--c-violet-light),var(--c-teal),var(--c-pink-light),transparent);
          filter:blur(1px);opacity:.5;animation:horizonPulse 9s ease-in-out infinite;
        }
        .gbg-spot-wrap{position:absolute;width:55vw;height:50vh;left:50%;top:22%;
          transform:translate(-50%,-50%);
          transition:left .6s cubic-bezier(.16,1,.3,1), top .6s cubic-bezier(.16,1,.3,1);
        }
        .gbg-spot{position:absolute;inset:0;filter:blur(40px)}
        .gbg-spot-a{background:radial-gradient(circle,rgba(167,139,250,.45),transparent 70%);
          animation:spotBreathe 7s ease-in-out infinite, spotFadeA 21s ease-in-out infinite;
        }
        .gbg-spot-b{background:radial-gradient(circle,rgba(94,234,212,.4),transparent 70%);
          animation:spotBreathe 7s ease-in-out infinite, spotFadeB 21s ease-in-out infinite;
        }
        .gbg-spot-c{background:radial-gradient(circle,rgba(244,114,182,.4),transparent 70%);
          animation:spotBreathe 7s ease-in-out infinite, spotFadeC 21s ease-in-out infinite;
        }
        .gbg-motes{position:absolute;inset:0;overflow:hidden}
        .gbg-mote{position:absolute;bottom:0;border-radius:50%;
          box-shadow:0 0 6px 1px currentColor;animation:moteRise linear infinite;
        }

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
        .np{background:none;border:none;padding:8px 20px;font-size:13px;color:rgba(255,255,255,0.65);font-weight:600;cursor:pointer;border-radius:100px;font-family:inherit;transition:all 0.2s;letter-spacing:0.01em}
        .np:hover{background:rgba(255,255,255,0.1);color:white}
        .nr{display:flex;gap:10px;align-items:center}
        .nlogin{background:none;border:none;font-size:14px;color:rgba(255,255,255,0.62);font-weight:600;cursor:pointer;font-family:inherit;transition:color 0.2s;padding:8px 12px}
        .nlogin:hover{color:white}
        .nstart{background:white;color:#040410;border:none;border-radius:100px;padding:10px 22px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.25s;letter-spacing:-0.2px}
        .nstart:hover{background:linear-gradient(135deg,#a78bfa,#34d399);color:white;transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.5)}
        .nstart:active{transform:scale(0.96);transition-duration:var(--dur-fast)}

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
        .hero-sub{font-size:17px;color:rgba(255,255,255,0.65);line-height:1.85;max-width:460px;margin-bottom:2.75rem;animation:fadeUp 0.8s ease 0.35s both}
        .hero-sub strong{color:rgba(255,255,255,0.9)}

        .hero-btns{display:flex;gap:12px;flex-wrap:wrap;animation:fadeUp 0.8s ease 0.45s both;margin-bottom:2rem}
        .btn-primary{background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;border:none;border-radius:100px;padding:18px 40px;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.3s;box-shadow:0 8px 32px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2);letter-spacing:-0.2px}
        .btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 50px rgba(124,58,237,0.6),0 0 0 1px rgba(167,139,250,0.35)}
        .btn-primary:active{transform:translateY(-1px) scale(0.97);transition-duration:var(--dur-fast)}
        .btn-outline{background:rgba(255,255,255,0.05);color:white;border:1px solid rgba(255,255,255,0.15);border-radius:100px;padding:17px 32px;font-size:16px;font-weight:600;cursor:pointer;font-family:inherit;backdrop-filter:blur(16px);transition:all 0.3s}
        .btn-outline:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.3);transform:translateY(-2px)}
        .btn-outline:active{transform:scale(0.97);transition-duration:var(--dur-fast)}

        .hero-free{font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:0.06em;text-transform:uppercase;animation:fadeUp 0.8s ease 0.5s both;margin-bottom:3rem}
        .hero-proof{display:flex;align-items:center;gap:14px;animation:fadeUp 0.8s ease 0.55s both}
        .avrow{display:flex}
        .av{width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);margin-left:-10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:white}
        .av:first-child{margin-left:0}
        .ptxt{font-size:13px;color:rgba(255,255,255,0.35)}
        .ptxt strong{color:rgba(255,255,255,0.85)}

        /* ── HERO RIGHT: BIG ORB + CHAT CARD ── */
        .hero-orb-wrap{position:relative;width:480px;height:480px;animation:heroOrb 18s ease-in-out infinite;flex-shrink:0}
        .stack-card{
          position:absolute;width:270px;height:182px;left:50%;top:50%;
          background:rgba(15,12,30,0.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,0.1);border-radius:18px;
          padding:20px 22px;
          box-shadow:0 24px 60px rgba(0,0,0,0.55),0 0 50px rgba(124,58,237,0.12);
          animation:stackFloat 7s ease-in-out infinite;
        }
        .stack-card h4{font-size:13px;font-weight:800;color:#fff;margin:0 0 16px;display:flex;align-items:center;gap:9px}
        .sc-icon{width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sc-bar{height:8px;border-radius:5px;margin-bottom:9px;background:rgba(255,255,255,0.08);overflow:hidden}
        .sc-bar span{display:block;height:100%;border-radius:5px}
        .sc1{transform:translate(-50%,-50%) rotate(-10deg) translate(-72px,-52px);z-index:1;animation-delay:0s}
        .sc2{transform:translate(-50%,-50%) rotate(-2deg) translate(-4px,2px);z-index:2;animation-delay:.4s}
        .sc3{transform:translate(-50%,-50%) rotate(9deg) translate(66px,58px);z-index:3;animation-delay:.8s}
        @keyframes stackFloat{0%,100%{margin-top:0}50%{margin-top:-10px}}
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
        .mq-item{display:flex;align-items:center;gap:10px;padding:0 2.5rem;font-size:12px;font-weight:700;color:rgba(255,255,255,0.5);white-space:nowrap;letter-spacing:0.06em;text-transform:uppercase}

        /* ── REVEAL HERO (cursor spotlight) ── */
        .reveal-sec{position:relative;width:100%;overflow:hidden;height:100vh;height:100dvh;background:#000;z-index:2}
        .reveal-base{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;z-index:1;animation:revealZoom 1.8s cubic-bezier(0.16,1,0.3,1) forwards}
        .reveal-canvas{position:absolute;inset:0;display:none;pointer-events:none}
        .reveal-mask{position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;z-index:3;pointer-events:none}
        .reveal-h{position:absolute;top:14%;left:0;right:0;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 20px;pointer-events:none;z-index:5}
        .reveal-h h1{line-height:0.95;margin:0}
        .reveal-h .l1{display:block;font-style:italic;font-weight:600;font-size:clamp(40px,7vw,84px);letter-spacing:-0.04em}
        .reveal-h .l2{display:block;font-weight:800;font-size:clamp(40px,7vw,84px);letter-spacing:-0.04em;margin-top:-4px;color:white}
        .reveal-bl{position:absolute;bottom:3.5rem;left:2.5rem;max-width:260px;z-index:5}
        .reveal-bl p{font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;margin:0}
        .reveal-br{position:absolute;bottom:2.5rem;right:2.5rem;max-width:280px;display:flex;flex-direction:column;align-items:flex-start;gap:18px;z-index:5}
        .reveal-br p{font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;margin:0}
        .reveal-anim{opacity:0;animation-fill-mode:forwards;animation-timing-function:cubic-bezier(0.16,1,0.3,1)}
        .reveal-fade-in{animation-name:revealFadeUp;animation-duration:1s}
        .reveal-rise{animation-name:revealRise;animation-duration:1.1s}
        @media (max-width:760px){
          .reveal-bl{display:none}
          .reveal-br{left:1.5rem;right:1.5rem;bottom:2rem;max-width:none;align-items:center;text-align:center}
        }
        @keyframes revealZoom{0%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes revealFadeUp{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes revealRise{0%{opacity:0;transform:translateY(28px);filter:blur(12px)}100%{opacity:1;transform:translateY(0);filter:blur(0)}}
        @media (prefers-reduced-motion: reduce){
          .reveal-anim{animation:none !important;opacity:1 !important}
          .reveal-base{animation:none !important}
        }

        /* ── SECTIONS ── */
        .sec{padding:8rem 5rem;position:relative;z-index:2}
        .w{max-width:1160px;margin:0 auto}
        .w-sm{max-width:840px;margin:0 auto}
        .w-xs{max-width:660px;margin:0 auto}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.58);margin-bottom:1.25rem}
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
        .cmp-tbl thead th:first-child{text-align:left;font-size:11px;font-weight:600;color:rgba(255,255,255,0.6);letter-spacing:0.08em;text-transform:uppercase}
        .cmp-tbl tbody tr{border-bottom:1px solid rgba(255,255,255,0.04)}
        .cmp-tbl tbody tr:last-child{border-bottom:none}
        .cmp-tbl tbody tr:nth-child(even){background:rgba(255,255,255,0.015)}
        .cmp-tbl tbody td{padding:1.1rem 1.75rem;font-size:14px;color:rgba(255,255,255,0.62);text-align:center}
        .cmp-tbl tbody td:first-child{text-align:left;color:rgba(255,255,255,0.8);font-weight:600}
        .cmp-hl{background:rgba(124,58,237,0.07) !important}
        .cy{color:#34d399;font-size:17px;font-weight:800}
        .cn{color:rgba(255,255,255,0.38);font-size:17px}
        .cp{color:#fbbf24;font-size:12px;font-weight:700}

        /* ── STATS ── */
        .stats-sec{padding:8rem 5rem;text-align:center;position:relative;z-index:2}
        .stats-q{font-size:clamp(36px,5vw,60px);font-weight:800;letter-spacing:-3px;line-height:1.08;color:white;margin-bottom:1rem}
        .stats-s{font-size:16px;color:rgba(255,255,255,0.3);margin-bottom:5rem;line-height:1.75}
        .stats-row{display:flex;justify-content:center;gap:6rem;flex-wrap:wrap}
        .stat-n{font-size:clamp(44px,6vw,72px);font-weight:800;letter-spacing:-3px;line-height:1}
        .stat-l{font-size:12px;color:rgba(255,255,255,0.58);margin-top:10px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase}

        /* ── PRICING ── */
        .tog-row{display:flex;align-items:center;gap:14px;margin-bottom:4rem}
        .tog-lbl{font-size:14px;font-weight:600;color:rgba(255,255,255,0.55)}
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
        .price-tier{font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.58);margin-bottom:12px;margin-top:0.75rem}
        .price-amt{font-size:clamp(44px,5vw,62px);font-weight:800;letter-spacing:-3px;line-height:1;color:white;margin-bottom:4px}
        .price-per{font-size:16px;font-weight:500;color:rgba(255,255,255,0.3)}
        .price-desc{font-size:14px;color:rgba(255,255,255,0.32);margin-bottom:2.25rem;margin-top:5px}
        .price-feats{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:2.5rem}
        .price-feats li{font-size:14px;font-weight:500;color:rgba(255,255,255,0.7);display:flex;align-items:flex-start;gap:10px;line-height:1.5}
        .pck{color:#34d399;font-weight:800;flex-shrink:0;margin-top:1px}
        .pbtn{width:100%;border-radius:100px;padding:15px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all 0.25s}
        .pbtn:active{transform:scale(0.97);transition-duration:var(--dur-fast)}
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
        .faq-icon{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:16px;color:rgba(255,255,255,0.62);flex-shrink:0;transition:all var(--dur-base)}
        .faq-item.open .faq-icon{transform:rotate(180deg);background:rgba(124,58,237,0.3);color:#c4b5fd}
        .faq-ans{padding:0 1.75rem 1.5rem;font-size:14px;color:rgba(255,255,255,0.42);line-height:1.88}

        /* ── CTA ── */
        .cta-sec{padding:10rem 5rem;text-align:center;position:relative;z-index:2}
        .cta-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(124,58,237,0.14),transparent);pointer-events:none}
        .cta-h{font-size:clamp(42px,6vw,80px);font-weight:800;letter-spacing:-4px;line-height:1.02;color:white;margin-bottom:1.75rem}
        .cta-p{font-size:18px;color:rgba(255,255,255,0.32);line-height:1.8;margin-bottom:3rem;max-width:480px;margin-left:auto;margin-right:auto}
        .btn-cta{background:linear-gradient(135deg,#7c3aed,#0d9488);color:white;border:none;border-radius:100px;padding:22px 56px;font-size:18px;font-weight:800;cursor:pointer;font-family:inherit;transition:all 0.3s;box-shadow:0 12px 40px rgba(124,58,237,0.5),0 0 0 1px rgba(167,139,250,0.2);letter-spacing:-0.3px}
        .btn-cta:hover{transform:translateY(-3px);box-shadow:0 24px 60px rgba(124,58,237,0.65),0 0 0 1px rgba(167,139,250,0.35)}
        .btn-cta:active{transform:translateY(-1px) scale(0.97);transition-duration:var(--dur-fast)}
        .cta-note{margin-top:1.75rem;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:0.05em;text-transform:uppercase}

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

      {/* ── GRID + SPOTLIGHT BG ── */}
      <div className="gbg" aria-hidden="true">
        <div className="gbg-grid" style={{ transform: `perspective(600px) rotateX(${62 + ny * 4}deg) rotateY(${nx * 4}deg)` }} />
        <div className="gbg-horizon" />
        <div className="gbg-spot-wrap" style={{ left: `${50 + nx * 16}%`, top: `${22 + ny * 12}%` }}>
          <div className="gbg-spot gbg-spot-a" />
          <div className="gbg-spot gbg-spot-b" />
          <div className="gbg-spot gbg-spot-c" />
        </div>
        <div className="gbg-motes">
          {motes.map((m, i) => (
            <div
              key={i}
              className="gbg-mote"
              style={{
                left: `${m.left}%`,
                width: `${m.size}px`,
                height: `${m.size}px`,
                background: m.color,
                color: m.color,
                animationDuration: `${m.duration}s`,
                animationDelay: `${m.delay}s`,
              }}
            />
          ))}
        </div>
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
            <button type="button" className="np" onClick={() => scrollToSection('how-it-works')}>How it works</button>
            <button type="button" className="np" onClick={() => scrollToSection('pricing')}>Pricing</button>
            <button type="button" className="np" onClick={() => scrollToSection('faq')}>FAQ</button>
          </div>
          <div className="nr">
            <button type="button" className="nlogin" onClick={() => router.push('/login')}>Log in</button>
            <button type="button" className="nstart" onClick={() => router.push('/login')}>Start free →</button>
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
              <span className="w w4" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88em' }}>We fix that.</span>
            </h1>

            <p className="hero-sub">
              Dump your thoughts into Clarity. The AI organizes everything and turns it into <strong>spreadsheets, calendars, and action plans</strong> — in seconds.
            </p>

            <div className="hero-btns">
              <button type="button" className="btn-primary" onClick={() => router.push('/login')}>Organize my ideas free →</button>
              <button type="button" className="btn-outline" onClick={() => scrollToSection('how-it-works')}>See how it works</button>
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

          {/* RIGHT: STACKED OUTPUT CARDS + FLOATING CARDS */}
          <div className="hero-r">
            <div className="hero-orb-wrap">
              {/* stacked output cards — the actual deliverables Clarity produces */}
              <div className="stack-card sc1">
                <h4>
                  <span className="sc-icon" style={{ background: 'rgba(167,139,250,0.18)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth={2.5}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                  </span>
                  Spreadsheet
                </h4>
                <div className="sc-bar"><span style={{ width: '82%', background: '#a78bfa' }} /></div>
                <div className="sc-bar"><span style={{ width: '56%', background: '#a78bfa' }} /></div>
                <div className="sc-bar"><span style={{ width: '70%', background: '#a78bfa' }} /></div>
              </div>
              <div className="stack-card sc2">
                <h4>
                  <span className="sc-icon" style={{ background: 'rgba(52,211,153,0.18)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth={2.5}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
                  </span>
                  Calendar
                </h4>
                <div className="sc-bar"><span style={{ width: '60%', background: '#34d399' }} /></div>
                <div className="sc-bar"><span style={{ width: '92%', background: '#34d399' }} /></div>
                <div className="sc-bar"><span style={{ width: '40%', background: '#34d399' }} /></div>
              </div>
              <div className="stack-card sc3">
                <h4>
                  <span className="sc-icon" style={{ background: 'rgba(244,114,182,0.18)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth={2.5}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  </span>
                  Action Plan
                </h4>
                <div className="sc-bar"><span style={{ width: '74%', background: '#f472b6' }} /></div>
                <div className="sc-bar"><span style={{ width: '52%', background: '#f472b6' }} /></div>
                <div className="sc-bar"><span style={{ width: '86%', background: '#f472b6' }} /></div>
              </div>

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

        {/* ── REVEAL HERO (cursor spotlight) ── */}
        <RevealHero onStart={() => router.push('/login')} />

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
          <div className="w">
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
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.58)', marginBottom: '2.5rem' }}>No hidden fees. No contracts. Cancel anytime.</p>
            <div className="tog-row">
              <span className={`tog-lbl ${!annual ? 'on' : ''}`}>Monthly</span>
              <button type="button" className={`tog ${annual ? 'on' : ''}`} onClick={() => setAnnual(a => !a)} aria-pressed={annual}>
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
                  <button type="button" className={`pbtn ${p.ft ? 'pbtn-g' : 'pbtn-o'}`} onClick={() => router.push('/login')}>{p.btn}</button>
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
                  <button type="button" className="faq-btn" onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}>
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
            <button type="button" className="btn-cta" onClick={() => router.push('/login')}>Organize my ideas free →</button>
            <p className="cta-note">Free forever plan · No credit card · Cancel paid plans anytime</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer id="about" className="footer">
          <div className="flogo"><span className="grad">✦ Clarity</span></div>
          <div className="fcopy">© 2026 Clarity. All rights reserved.</div>
          <nav className="flinks">
            <button type="button" className="fl" onClick={() => router.push('/privacy')}>Privacy</button>
            <button type="button" className="fl" onClick={() => router.push('/terms')}>Terms</button>
            <button type="button" className="fl" onClick={() => router.push('/contact')}>Contact</button>
          </nav>
        </footer>

      </div>
    </>
  )
}
