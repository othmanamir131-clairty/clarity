'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { MacbookScroll } from '@/components/ui/macbook-scroll'

const GREEN_GRADIENT = 'linear-gradient(135deg,#10b981,#059669)'

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
]

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.05V17h6v-.25c0-.85.4-1.55 1-2.05A7 7 0 0 0 12 2Z" />
    </svg>
  )
}

function BriefIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z" />
      <path d="M9 11h6M9 15h4" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" style={{ color: '#10b981' }}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const FEATURES = [
  {
    icon: <LightbulbIcon />,
    title: 'Brain Dump',
    desc: 'Type, talk, or paste — get every idea out of your head before it evaporates. No folders to file it into, no structure required.',
  },
  {
    icon: <BriefIcon />,
    title: 'Content Brief',
    desc: 'Turn one loose idea into a full production brief — hook, script, thumbnail direction, hashtags — in seconds, not hours.',
  },
  {
    icon: <CalendarIcon />,
    title: 'Post Schedule',
    desc: 'Clarity builds your optimal week: what to post, when, and why — so you always know exactly what to make next.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Dump it',
    desc: 'Open Clarity and let it all out — half-formed thoughts, video ideas, to-dos. No structure required.',
  },
  {
    n: '02',
    title: 'Clarity sorts it',
    desc: 'AI reads what you meant, not just what you typed — tagging, prioritizing, and organizing everything automatically.',
  },
  {
    n: '03',
    title: 'Create + ship',
    desc: 'Turn any idea into a brief, a caption, or a full week of content — then post with total confidence.',
  },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    tagline: 'For getting started',
    features: ['Unlimited idea capture', '5 AI messages / day', 'Basic organization', 'Community support'],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29.99',
    period: '/mo',
    tagline: 'For creators who post consistently',
    features: ['Everything in Free', 'Unlimited AI messages', 'Clarity Score reports', 'Content Brief generator', 'Priority support'],
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Premium',
    price: '$59.99',
    period: '/mo',
    tagline: 'For creators scaling a team',
    features: ['Everything in Pro', 'Post Schedule builder', 'Video analysis', 'Early access to new tools', '1:1 onboarding call'],
    highlighted: false,
  },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const t = window.setTimeout(() => setLoaded(true), 60)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        body { background: #fafdfb; color: #0f1c17; }

        @keyframes auroraDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.08); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .aurora { position: absolute; border-radius: 9999px; filter: blur(90px); }
        .aurora-a {
          width: 620px; height: 620px; top: -220px; left: -140px;
          background: radial-gradient(circle, rgba(16,185,129,0.32), transparent 70%);
          animation: auroraDrift 22s ease-in-out infinite;
        }
        .aurora-b {
          width: 520px; height: 520px; top: -120px; right: -160px;
          background: radial-gradient(circle, rgba(5,150,105,0.22), transparent 70%);
          animation: auroraDrift 27s ease-in-out infinite reverse;
        }
        .aurora-c {
          width: 480px; height: 480px; bottom: -220px; left: 30%;
          background: radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%);
          animation: auroraDrift 30s ease-in-out infinite 2s;
        }

        .hero-fade {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-fade-in { opacity: 1; transform: translateY(0); }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal-in { opacity: 1; transform: translateY(0); }

        .feature-card, .pricing-card {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(16,185,129,0.35);
          box-shadow: 0 20px 45px -15px rgba(16,185,129,0.25);
        }
        .pricing-card:hover {
          transform: translateY(-4px);
        }

        .cta-primary { transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px rgba(16,185,129,0.55); filter: brightness(1.04); }
        .cta-ghost { transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease; }
        .cta-ghost:hover { background-color: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.4); transform: translateY(-2px); }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto !important; }
          .aurora { animation: none !important; }
          .hero-fade, .reveal { transition: none !important; opacity: 1 !important; transform: none !important; }
          .feature-card:hover, .pricing-card:hover, .cta-primary:hover, .cta-ghost:hover { transform: none !important; }
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#fafdfb] text-[#0f1c17]" style={{ fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", sans-serif' }}>

        {/* ── NAVBAR ── */}
        <header
          className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
          style={{
            background: scrolled ? 'rgba(250,253,251,0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(16,185,129,0.15)' : '1px solid transparent',
          }}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
            <Link href="/landing" className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: GREEN_GRADIENT }}>✦</span>
              Clarity
            </Link>

            <div className="hidden items-center gap-8 text-sm font-medium text-[#5b6b64] md:flex">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="transition-colors hover:text-[#0f1c17]">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/login" className="px-3 py-2 text-sm font-semibold text-[#5b6b64] transition-colors hover:text-[#0f1c17]">
                Login
              </Link>
              <Link
                href="/login"
                className="cta-primary rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm"
                style={{ backgroundImage: GREEN_GRADIENT }}
              >
                Get started
              </Link>
            </div>

            <button
              className="text-[#0f1c17] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </nav>

          {menuOpen && (
            <div className="border-t border-[rgba(16,185,129,0.15)] bg-[#fafdfb] px-6 py-5 md:hidden">
              <div className="flex flex-col gap-4 text-sm font-medium text-[#5b6b64]">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="transition-colors hover:text-[#0f1c17]">
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Link href="/login" className="text-center text-sm font-semibold text-[#5b6b64]">
                  Login
                </Link>
                <Link
                  href="/login"
                  className="rounded-full px-5 py-3 text-center text-sm font-bold text-white"
                  style={{ backgroundImage: GREEN_GRADIENT }}
                >
                  Get started
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-44">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="aurora aurora-a" />
            <div className="aurora aurora-b" />
            <div className="aurora aurora-c" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className={`hero-fade ${loaded ? 'hero-fade-in' : ''}`}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide"
                style={{ color: '#065f46', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                Your second brain for content
              </span>
            </div>

            <h1
              className={`hero-fade mt-7 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl ${loaded ? 'hero-fade-in' : ''}`}
              style={{ transitionDelay: '90ms' }}
            >
              Catch every idea before it&apos;s gone.
            </h1>

            <p
              className={`hero-fade mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#5b6b64] sm:text-lg ${loaded ? 'hero-fade-in' : ''}`}
              style={{ transitionDelay: '170ms' }}
            >
              Clarity captures every thought the moment it hits, sorts it automatically, and turns it into content briefs and posting plans — so nothing you think of ever gets lost again.
            </p>

            <div
              className={`hero-fade mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row ${loaded ? 'hero-fade-in' : ''}`}
              style={{ transitionDelay: '250ms' }}
            >
              <Link
                href="/login"
                className="cta-primary w-full rounded-full px-8 py-3.5 text-center text-base font-bold text-white shadow-md sm:w-auto"
                style={{ backgroundImage: GREEN_GRADIENT }}
              >
                Start for free →
              </Link>
              <a
                href="#how-it-works"
                className="cta-ghost w-full rounded-full border px-8 py-3.5 text-center text-base font-semibold text-[#0f1c17] sm:w-auto"
                style={{ borderColor: 'rgba(16,185,129,0.3)' }}
              >
                See how it works
              </a>
            </div>

            <p
              className={`hero-fade mt-5 text-xs font-medium text-[#5b6b64] ${loaded ? 'hero-fade-in' : ''}`}
              style={{ transitionDelay: '330ms' }}
            >
              Free forever · No credit card required
            </p>
          </div>
        </section>

        {/* ── MACBOOK SCROLL ── */}
        <section className="relative overflow-hidden">
          <MacbookScroll
            src="/dashboard-preview.png"
            title={
              <span>
                Your whole creative brain, <br /> in one place.
              </span>
            }
            showGradient
          />
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="scroll-mt-24 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Everything your ideas need</h2>
              <p className="mt-4 text-base text-[#5b6b64]">Three tools that take an idea from a fleeting thought to a finished post.</p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <div
                    className="feature-card h-full rounded-2xl border bg-white p-7"
                    style={{ borderColor: 'rgba(16,185,129,0.15)' }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#5b6b64]">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="scroll-mt-24 px-6 py-20 md:py-28" style={{ background: 'rgba(16,185,129,0.04)' }}>
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
              <p className="mt-4 text-base text-[#5b6b64]">From scattered thought to shipped content, in three steps.</p>
            </Reveal>

            <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 120}>
                  <div className="relative">
                    <div
                      className="text-5xl font-extrabold tracking-tighter sm:text-6xl"
                      style={{ backgroundImage: GREEN_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      {s.n}
                    </div>
                    <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5b6b64]">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="scroll-mt-24 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
              <p className="mt-4 text-base text-[#5b6b64]">Start free. Upgrade when Clarity earns it.</p>
            </Reveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 100}>
                  <div
                    className="pricing-card relative flex h-full flex-col rounded-2xl border bg-white p-8"
                    style={{
                      borderColor: plan.highlighted ? '#10b981' : 'rgba(16,185,129,0.15)',
                      boxShadow: plan.highlighted ? '0 20px 50px -20px rgba(16,185,129,0.4)' : undefined,
                    }}
                  >
                    {plan.badge && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide text-white"
                        style={{ backgroundImage: GREEN_GRADIENT }}
                      >
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-[#5b6b64]">{plan.tagline}</p>
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                      {plan.period && <span className="text-sm font-medium text-[#5b6b64]">{plan.period}</span>}
                    </div>
                    <ul className="mt-6 flex flex-1 flex-col gap-3">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-[#0f1c17]">
                          <span className="mt-0.5"><CheckIcon /></span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/pricing"
                      className={plan.highlighted ? 'cta-primary mt-8 rounded-full px-6 py-3 text-center text-sm font-bold text-white' : 'cta-ghost mt-8 rounded-full border px-6 py-3 text-center text-sm font-bold text-[#0f1c17]'}
                      style={plan.highlighted ? { backgroundImage: GREEN_GRADIENT } : { borderColor: 'rgba(16,185,129,0.3)' }}
                    >
                      {plan.name === 'Free' ? 'Get started' : `Choose ${plan.name}`}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="px-6 py-20 md:py-28">
          <Reveal className="mx-auto max-w-5xl">
            <div
              className="rounded-3xl border px-8 py-16 text-center sm:px-16"
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.16))',
                borderColor: 'rgba(16,185,129,0.2)',
              }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: '#065f46' }}>
                Ready to get clarity?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-[#5b6b64]">
                Join creators who never lose an idea again.
              </p>
              <Link
                href="/login"
                className="cta-primary mt-8 inline-block rounded-full px-9 py-3.5 text-base font-bold text-white shadow-md"
                style={{ backgroundImage: GREEN_GRADIENT }}
              >
                Get started →
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t px-6 py-12" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-1.5 text-lg font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: GREEN_GRADIENT }}>✦</span>
              Clarity
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[#5b6b64]">
              <Link href="/privacy" className="transition-colors hover:text-[#0f1c17]">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-[#0f1c17]">Terms</Link>
              <Link href="/contact" className="transition-colors hover:text-[#0f1c17]">Contact</Link>
              <Link href="/updates" className="transition-colors hover:text-[#0f1c17]">Updates</Link>
            </div>
            <p className="text-sm text-[#5b6b64]">© 2026 Clarity</p>
          </div>
        </footer>
      </div>
    </>
  )
}
