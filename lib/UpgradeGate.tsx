'use client'

export default function UpgradeGate({
  title,
  message,
  planLabel,
}: {
  title: string
  message: string
  planLabel: string
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.82)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: 'rgba(15,23,42,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2.25rem',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 32px 90px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ fontSize: '14px', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px' }}>
          Locked feature
        </div>
        <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '14px', lineHeight: 1.1 }}>
          {title}
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', marginBottom: '24px', lineHeight: 1.7 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => { window.location.href = '/' }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '999px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '15px',
              fontWeight: 600,
              padding: '14px 24px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← Back to dashboard
          </button>
          <button
            onClick={() => { window.location.href = '/pricing' }}
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #34d399)',
              border: 'none',
              borderRadius: '999px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 700,
              padding: '14px 28px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Upgrade to {planLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
