'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Report() {
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<any[]>([])
  const [report, setReport] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/landing'
      else {
        setUser(data.user)
        supabase.from('ideas').select('*').then(({ data: ideasData }) => {
          if (ideasData) setIdeas(ideasData)
        })
      }
    })
  }, [])

  const generateReport = async () => {
    setLoading(true)
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideas }),
    })
    const data = await res.json()
    setScore(data.score)
    setReport(data.report)
    setGenerated(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf8f4', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27' }}>✦ Clarity</div>
          <div onClick={() => window.location.href = '/'} style={{ fontSize: '13px', color: '#888', cursor: 'pointer' }}>← Back to dashboard</div>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '13px', color: '#2d5a27', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Weekly Report</div>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>Your Clarity Score</div>
          <div style={{ fontSize: '15px', color: '#888', marginBottom: '1.5rem' }}>Based on your {ideas.length} saved ideas — here's how your week looks.</div>
          
          {!generated && !loading && (
            <button onClick={generateReport} style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '15px', cursor: 'pointer', fontWeight: '500' }}>
              Generate my Clarity Score ✨
            </button>
          )}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '15px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid #d6cfc0', borderTop: '2px solid #2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              Analyzing your ideas...
            </div>
          )}

          {generated && score !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: score >= 70 ? '#eaf3de' : score >= 40 ? '#fdf6e3' : '#fff5f5', border: `3px solid ${score >= 70 ? '#2d5a27' : score >= 40 ? '#c2a84a' : '#e53e3e'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: score >= 70 ? '#2d5a27' : score >= 40 ? '#c2a84a' : '#e53e3e' }}>{score}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>/ 100</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>
                  {score >= 70 ? '🔥 On fire!' : score >= 40 ? '💡 Getting there' : '🌱 Just starting'}
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  {score >= 70 ? 'You\'re crushing it this week' : score >= 40 ? 'Good momentum, keep going' : 'Every idea counts — keep dumping!'}
                </div>
              </div>
            </div>
          )}
        </div>

        {generated && report && (
          <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '1rem' }}>📋 Your personal report</div>
            <div style={{ fontSize: '14px', color: '#444', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/• /g, '• ') }} />
            <button onClick={generateReport} style={{ marginTop: '1.5rem', backgroundColor: 'transparent', border: '1px solid #d6cfc0', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#888' }}>
              Regenerate report
            </button>
          </div>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}