'use client'

import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#faf8f4', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '220px', backgroundColor: '#f5f0e8', borderRight: '1px solid #d6cfc0', padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#2d5a27', marginBottom: '1.5rem', paddingLeft: '8px' }}>✦ Clarity</div>
        
        <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Main</p>
        <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#d4e8c2', color: '#2d5a27', fontWeight: '500', fontSize: '14px', cursor: 'pointer' }}>📊 Dashboard</div>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>💡 My ideas</div>

        <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Outputs</p>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📋 Spreadsheets</div>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📅 Content calendar</div>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>📄 Action plans</div>

        <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Premium</p>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#7a5c10', fontSize: '14px', cursor: 'pointer', backgroundColor: '#fdf6e3' }}>🎬 Video analysis</div>

        <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>Account</p>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>💳 Billing</div>
        <div style={{ padding: '8px 10px', borderRadius: '8px', color: '#4a4a4a', fontSize: '14px', cursor: 'pointer' }}>⚙️ Settings</div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #d6cfc0', paddingTop: '12px' }}>
          <span style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', fontSize: '10px', padding: '3px 8px', borderRadius: '20px' }}>Pro plan</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#c2dba8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#2d5a27' }}>JD</div>
            <div>
              <div style={{ fontSize: '12px', color: '#333' }}>John D.</div>
              <div style={{ fontSize: '11px', color: '#888' }}>john@email.com</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a' }}>Good morning, <span style={{ color: '#2d5a27' }}>John</span> 👋</div>
          <div style={{ fontSize: '12px', color: '#888', backgroundColor: '#ede9de', padding: '5px 12px', borderRadius: '20px' }}>Thursday, June 4 2026</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Ideas saved', value: '24', sub: 'View in my ideas' },
            { label: 'Outputs created', value: '8', sub: 'View all outputs' },
            { label: 'Tasks this month', value: '12', sub: 'completed' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a1a' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#2d5a27', marginTop: '2px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1.25rem', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d5a27' }}></div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>What's on your mind?</div>
          </div>

          <div style={{ minHeight: '200px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.length === 0 && (
              <div style={{ color: '#aaa', fontSize: '14px', padding: '1rem 0' }}>Start by dumping your ideas, tasks, or goals below...</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', backgroundColor: msg.role === 'user' ? '#2d5a27' : '#f5f0e8', color: msg.role === 'user' ? '#d4e8c2' : '#333', lineHeight: '1.6' }}>
                  {msg.role === 'ai' ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '14px', backgroundColor: '#f5f0e8', color: '#888' }}>Thinking...</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f5f0e8', border: '1px solid #d6cfc0', borderRadius: '8px', padding: '8px 12px' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Dump your ideas, tasks, or goals here... (Shift+Enter for new line)"
              rows={2}
              style={{ flex: 1, fontSize: '14px', border: 'none', background: 'transparent', outline: 'none', color: '#333', resize: 'none', fontFamily: 'sans-serif' }}
            />
            <button onClick={sendMessage} style={{ backgroundColor: '#2d5a27', color: '#d4e8c2', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-end' }}>
              {loading ? '...' : "Let's go ↑"}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {['📋 Make a plan', '📅 Content calendar', '📊 Spreadsheet', '🎬 Analyze a video'].map((chip) => (
              <div key={chip} onClick={() => setInput(chip.split(' ').slice(1).join(' '))} style={{ backgroundColor: chip.includes('🎬') ? '#fdf6e3' : '#ede9de', border: `1px solid ${chip.includes('🎬') ? '#c2a84a' : '#d6cfc0'}`, borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: chip.includes('🎬') ? '#7a5c10' : '#555', cursor: 'pointer' }}>{chip}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>💡 Recent ideas</div>
              <div style={{ fontSize: '12px', color: '#2d5a27', cursor: 'pointer' }}>See all →</div>
            </div>
            {[
              { text: 'Post 3x a week, focus on behind the scenes', tag: 'Content' },
              { text: 'Collab with another creator in same niche', tag: 'Growth' },
              { text: 'Launch a monthly Q&A series', tag: 'Content' },
            ].map((idea) => (
              <div key={idea.text} style={{ padding: '8px 0', borderBottom: '1px solid #ede9de' }}>
                <div style={{ fontSize: '12px', color: '#333', marginBottom: '4px' }}>{idea.text}</div>
                <span style={{ fontSize: '10px', color: '#2d5a27', backgroundColor: '#eaf3de', padding: '2px 8px', borderRadius: '20px' }}>{idea.tag}</span>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d6cfc0', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a' }}>📄 Recent outputs</div>
              <div style={{ fontSize: '12px', color: '#2d5a27', cursor: 'pointer' }}>See all →</div>
            </div>
            {[
              { name: 'June content calendar', date: '2 days ago', type: 'Calendar' },
              { name: 'Weekly task plan', date: '4 days ago', type: 'Spreadsheet' },
              { name: 'Q3 growth action plan', date: '1 week ago', type: 'Action plan' },
            ].map((output) => (
              <div key={output.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #ede9de' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#333' }}>{output.name}</div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>{output.date}</div>
                </div>
                <span style={{ fontSize: '10px', color: '#3b6d11', backgroundColor: '#eaf3de', padding: '2px 8px', borderRadius: '20px' }}>{output.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}