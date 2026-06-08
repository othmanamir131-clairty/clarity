'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate sending the message
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    }, 1000)
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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .contact-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 600px;
          animation: fadeUp 0.6s ease forwards;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
          color: white;
        }

        .contact-card h1 {
          font-size: 44px;
          font-weight: 800;
          margin-bottom: 10px;
          letter-spacing: -1px;
          color: white;
        }

        .contact-card .subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 3px rgba(167,139,250,0.15);
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: #2e1065;
          color: white;
        }

        .form-textarea {
          resize: vertical;
          min-height: 140px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #0d9488);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .success-message {
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.4);
          border-radius: 12px;
          padding: 14px 16px;
          color: #6ee7b7;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2rem;
          animation: slideDown 0.4s ease forwards;
        }

        .contact-info {
          margin-top: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .contact-info-heading {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
        }

        .contact-info-item {
          margin-bottom: 1.25rem;
        }

        .contact-info-label {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.25rem;
        }

        .contact-info-value {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .contact-info-email {
          color: #a78bfa;
          font-weight: 600;
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

        .footer-section {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .footer-link {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
        }

        .footer-link:hover {
          color: rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'rgba(124,58,237,0.35)', filter: 'blur(100px)', animation: 'blob 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(13,148,136,0.3)', filter: 'blur(90px)', animation: 'blob 14s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,7,100,0.4)', filter: 'blur(80px)', animation: 'blob 20s ease-in-out infinite 3s' }} />
      </div>

      {/* Page */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 1, paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="contact-card">
          <span
            className="back-link"
            onClick={() => window.location.href = '/landing'}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            ← Back to home
          </span>

          <h1>Get in touch</h1>
          <p className="subtitle">We'd love to hear from you</p>

          {submitted && (
            <div className="success-message">
              ✓ Thanks! We'll get back to you at <strong>othmanamir131@gmail.com</strong>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}>
                <option>General Inquiry</option>
                <option>Bug Report</option>
                <option>Billing Question</option>
                <option>Feature Request</option>
                <option>Privacy Request</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                className="form-textarea"
                placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}>
              {loading ? 'Sending...' : 'Send message'}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-info-heading">Other ways to reach us</div>
            
            <div className="contact-info-item">
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">
                <span className="contact-info-email">othmanamir131@gmail.com</span>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-label">Response Time</div>
              <div className="contact-info-value">Usually within 24 hours</div>
            </div>
          </div>

          <div className="footer-section">
            <span
              className="footer-link"
              onClick={() => window.location.href = '/privacy'}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              Privacy
            </span>
            <span style={{ margin: '0 1rem', color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span
              className="footer-link"
              onClick={() => window.location.href = '/terms'}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              Terms
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
