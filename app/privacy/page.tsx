'use client'

export default function Privacy() {
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

        .privacy-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 900px;
          animation: fadeUp 0.6s ease forwards;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
          color: white;
        }

        .privacy-card h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .privacy-card .subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .privacy-card h2 {
          font-size: 22px;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .privacy-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: rgba(255,255,255,0.95);
        }

        .privacy-card p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-bottom: 1rem;
        }

        .privacy-card ul {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .privacy-card ul li {
          margin-bottom: 0.6rem;
        }

        .privacy-card ol {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .privacy-card ol li {
          margin-bottom: 0.6rem;
        }

        .toc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .toc-item {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          padding: 0.75rem;
          background: rgba(255,255,255,0.04);
          border-left: 2px solid rgba(167,139,250,0.4);
          border-radius: 6px;
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

        .contact-info {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .contact-info p {
          margin-bottom: 0.75rem;
        }

        .contact-email {
          color: #a78bfa;
          font-weight: 600;
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
        <div className="privacy-card">
          <span
            className="back-link"
            onClick={() => window.location.href = '/landing'}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            ← Back to home
          </span>

          <h1>Privacy Policy</h1>
          <div className="subtitle">Last updated June 08, 2026</div>

          {/* Summary */}
          <h2>Summary of Key Points</h2>
          <p>
            This privacy policy explains how Clarity collects, uses, discloses, and otherwise processes your personal information 
            in connection with our services. Please read this notice carefully to understand our privacy practices.
          </p>

          {/* Table of Contents */}
          <h2>Table of Contents</h2>
          <div className="toc-grid">
            <div className="toc-item">1. What Information Do We Collect</div>
            <div className="toc-item">2. How Do We Process Your Information</div>
            <div className="toc-item">3. What Legal Bases Do We Rely On</div>
            <div className="toc-item">4. When and With Whom Do We Share Your Personal Information</div>
            <div className="toc-item">5. Do We Offer AI-Based Products</div>
            <div className="toc-item">6. Is Your Information Transferred Internationally</div>
            <div className="toc-item">7. How Long Do We Keep Your Information</div>
            <div className="toc-item">8. How Do We Keep Your Information Safe</div>
            <div className="toc-item">9. What Are Your Privacy Rights</div>
            <div className="toc-item">10. Controls for Do-Not-Track Features</div>
            <div className="toc-item">11. US Residents Specific Privacy Rights</div>
            <div className="toc-item">12. Do We Make Updates to This Notice</div>
            <div className="toc-item">13. Contact Us</div>
            <div className="toc-item">14. How to Review, Update, or Delete Your Information</div>
          </div>

          {/* Section 1 */}
          <h2>1. What Information Do We Collect</h2>
          <p>
            We collect personal information that you provide directly to us, such as when you create an account, use our services, 
            or communicate with us. This may include:
          </p>
          <ul>
            <li>Account information (email address, password)</li>
            <li>Profile information (name, preferences)</li>
            <li>Content you create or upload</li>
            <li>Communication data (messages, feedback)</li>
            <li>Usage data and analytics</li>
            <li>Device information (IP address, browser type)</li>
          </ul>

          {/* Section 2 */}
          <h2>2. How Do We Process Your Information</h2>
          <p>
            We process your personal information for several purposes:
          </p>
          <ul>
            <li>To provide and improve our services</li>
            <li>To manage your account and user experience</li>
            <li>To process transactions and send related information</li>
            <li>To send promotional communications (with your consent)</li>
            <li>To comply with legal obligations</li>
            <li>To detect, prevent, and address fraud or security issues</li>
          </ul>

          {/* Section 3 */}
          <h2>3. What Legal Bases Do We Rely On</h2>
          <p>
            We process your information based on several legal bases:
          </p>
          <ul>
            <li>Your explicit consent</li>
            <li>Performance of a contract with you</li>
            <li>Compliance with legal obligations</li>
            <li>Protection of vital interests</li>
            <li>Our legitimate business interests</li>
            <li>Fulfillment of public tasks</li>
          </ul>

          {/* Section 4 */}
          <h2>4. When and With Whom Do We Share Your Personal Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>Service providers who assist us in operating our website and conducting our business</li>
            <li>Business partners with your consent</li>
            <li>Law enforcement when required by law</li>
            <li>Other parties to protect our rights and safety</li>
          </ul>
          <p>
            We do not sell your personal information to third parties.
          </p>

          {/* Section 5 */}
          <h2>5. Do We Offer AI-Based Products</h2>
          <p>
            Yes, Clarity uses AI technology to provide enhanced features and personalization. Our AI services are powered by 
            Anthropic's technology. When you use AI-based features, your input may be processed by our AI systems to generate 
            responses and insights. We ensure that this processing is done securely and in accordance with our privacy commitments.
          </p>
          <p>
            Please note that any sensitive personal information should not be included in AI prompts, as this data may be processed 
            to improve our services.
          </p>

          {/* Section 6 */}
          <h2>6. Is Your Information Transferred Internationally</h2>
          <p>
            Your information may be transferred to, stored in, and processed in countries other than your country of residence. 
            These countries may have data protection laws that differ from your home country. When we transfer information internationally, 
            we implement appropriate safeguards to protect your data.
          </p>

          {/* Section 7 */}
          <h2>7. How Long Do We Keep Your Information</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined 
            in this policy. You can request deletion of your account and associated data at any time through our contact page.
          </p>

          {/* Section 8 */}
          <h2>8. How Do We Keep Your Information Safe</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure, 
            and we cannot guarantee absolute security.
          </p>

          {/* Section 9 */}
          <h2>9. What Are Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul>
            <li>Right to access your information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to request deletion of your information</li>
            <li>Right to restrict processing of your information</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
            <li>Right to object to processing</li>
          </ul>

          {/* Section 10 */}
          <h2>10. Controls for Do-Not-Track Features</h2>
          <p>
            Most web browsers include a Do-Not-Track feature. Our website currently does not respond to Do-Not-Track signals. 
            You can typically enable Do-Not-Track through your browser settings.
          </p>

          {/* Section 11 */}
          <h2>11. US Residents Specific Privacy Rights</h2>
          <p>
            If you are a US resident, you may have additional rights under state privacy laws, including:
          </p>
          <ul>
            <li>Right to know what personal information is collected, used, and shared</li>
            <li>Right to delete personal information collected from you</li>
            <li>Right to correct inaccurate personal information</li>
            <li>Right to opt-out of the sale or sharing of personal information</li>
            <li>Right to opt-out of targeted advertising and profiling</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information below.
          </p>

          {/* Section 12 */}
          <h2>12. Do We Make Updates to This Notice</h2>
          <p>
            Yes, we may update this privacy policy from time to time to reflect changes in our practices, technology, legal requirements, 
            and other factors. We will notify you of any material changes by updating the "Last updated" date of this policy. Your continued 
            use of our services following such modifications constitutes your acceptance of the updated policy.
          </p>

          {/* Section 13 */}
          <h2>13. Contact Us</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> <span className="contact-email">othmanamir131@gmail.com</span></p>
            <p><strong>Company:</strong> Clarity</p>
            <p><strong>Address:</strong> 20306 New Rochelle St, Walnut, CA 91789</p>
          </div>

          {/* Section 14 */}
          <h2>14. How to Review, Update, or Delete Your Information</h2>
          <p>
            If you would like to review, update, or delete your personal information, please visit our contact page at:
          </p>
          <p style={{ color: '#a78bfa', fontWeight: '600' }}>
            clarity-five-bice.vercel.app/contact
          </p>
          <p>
            Alternatively, you can contact us directly using the information provided above. We will respond to your request 
            within a reasonable timeframe as required by applicable law.
          </p>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              Thank you for trusting Clarity with your information. We are committed to protecting your privacy.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
