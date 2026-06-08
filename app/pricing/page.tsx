'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      description: 'Perfect to get started',
      features: ['Dashboard', 'AI Brain Dump', 'Ideas saving'],
      buttonText: 'Get started',
      buttonAction: 'free',
      featured: false,
    },
    {
      name: 'Pro',
      price: '$29.99',
      period: '/mo',
      description: 'For serious creators',
      features: [
        'Everything in Free',
        'Clarity Score',
        'Content Tools',
        'Spreadsheet Generator',
        'Content Brief',
        'Post Schedule',
      ],
      buttonText: 'Upgrade to Pro',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      featured: true,
    },
    {
      name: 'Premium',
      price: '$59.99',
      period: '/mo',
      description: 'For power users',
      features: [
        'Everything in Pro',
        'Video Analysis',
        'Priority AI',
        'Early access to new features',
      ],
      buttonText: 'Upgrade to Premium',
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
      featured: false,
    },
  ]

  const handleCheckout = async (priceId: string | undefined, name: string) => {
    if (!priceId) return

    setLoading(name)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(null)
    }
  }

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
        }

        @keyframes blob {
          0%,100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 70%; }
          50%      { border-radius: 40% 60% 30% 70% / 60% 40% 70% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .pricing-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          position: relative;
          z-index: 1;
        }

        .pricing-container {
          max-width: 1100px;
          width: 100%;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeUp 0.6s ease forwards;
        }

        .back-link {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .back-link:hover {
          color: rgba(255,255,255,0.6);
        }

        .pricing-title {
          font-size: 52px;
          font-weight: 800;
          color: white;
          letter-spacing: -2.5px;
          line-height: 1.1;
          margin-bottom: 1rem;
        }

        .pricing-title em {
          font-style: italic;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .pricing-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 3rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .pricing-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 2.5rem;
          color: white;
          animation: fadeUp 0.6s ease forwards;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }

        .pricing-card.featured {
          border-color: rgba(167,139,250,0.4);
          box-shadow: 0 24px 64px rgba(124,58,237,0.2);
          background: rgba(255,255,255,0.08);
        }

        .pricing-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #a78bfa, #34d399);
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 16px;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(124,58,237,0.4);
        }

        .plan-name {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 8px;
          margin-top: 0.5rem;
        }

        .plan-price {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 4px;
          background: linear-gradient(135deg, #a78bfa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .plan-period {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .plan-description {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 1.75rem;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 2rem;
        }

        .plan-features li {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .plan-features li:before {
          content: '✓';
          color: #6ee7b7;
          font-weight: bold;
          font-size: 16px;
        }

        .plan-button {
          width: 100%;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
        }

        .plan-button.primary {
          background: linear-gradient(135deg, #7c3aed, #0d9488);
          color: white;
        }

        .plan-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }

        .plan-button.secondary {
          background: rgba(255,255,255,0.08);
          color: white;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .plan-button.secondary:hover:not(:disabled) {
          background: rgba(255,255,255,0.12);
          border-color: rgba(167,139,250,0.4);
        }

        .plan-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      <div className="pricing-wrap">
        <div className="pricing-container">
          <div className="pricing-header">
            <span
              className="back-link"
              onClick={() => window.location.href = '/'}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              ← Back to dashboard
            </span>
            <h1 className="pricing-title">
              Simple, <em>transparent</em> pricing
            </h1>
            <p className="pricing-subtitle">Choose the plan that works for you. Upgrade anytime.</p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="pricing-badge">⭐ MOST POPULAR</div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price}</div>
                <div className="plan-period">{plan.period}</div>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
                <button
                  className={`plan-button ${plan.buttonAction === 'free' ? 'secondary' : 'primary'}`}
                  onClick={() => {
                    if (plan.buttonAction === 'free') {
                      window.location.href = '/login'
                    } else if (plan.priceId) {
                      handleCheckout(plan.priceId, plan.name)
                    }
                  }}
                  disabled={loading === plan.name}>
                  {loading === plan.name ? 'Loading...' : plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
