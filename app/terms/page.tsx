'use client'

export default function Terms() {
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

        .terms-card {
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

        .terms-card h1 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .terms-card .subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          font-weight: 500;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .terms-card h2 {
          font-size: 22px;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .terms-card h3 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: rgba(255,255,255,0.95);
        }

        .terms-card p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-bottom: 1rem;
        }

        .terms-card ul {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .terms-card ul li {
          margin-bottom: 0.6rem;
        }

        .terms-card ol {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.8);
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .terms-card ol li {
          margin-bottom: 0.6rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        .pricing-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .pricing-card h4 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .pricing-card .price {
          font-size: 24px;
          font-weight: 800;
          color: #a78bfa;
          margin-bottom: 1rem;
        }

        .pricing-card ul {
          font-size: 13px;
          margin-left: 0;
          margin-bottom: 0;
        }

        .pricing-card ul li {
          list-style: none;
          margin-bottom: 0.4rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .pricing-card ul li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #6ee7b7;
          font-weight: bold;
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

        .highlight {
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
        <div className="terms-card">
          <span
            className="back-link"
            onClick={() => window.location.href = '/landing'}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
            ← Back to home
          </span>

          <h1>Terms of Service</h1>
          <div className="subtitle">Last updated June 08, 2026</div>

          {/* Agreement to Terms */}
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legal agreement between you and Clarity ("Company," "we," "us," or "our"). 
            By accessing or using Clarity, you agree to be bound by these Terms. If you do not agree to any part of these Terms, 
            you may not use our services.
          </p>

          {/* Our Services */}
          <h2>2. Our Services</h2>
          <p>
            Clarity is an AI-powered content organization tool designed to help you organize, manage, and discover content efficiently. 
            Our services include content categorization, intelligent search, and personalized recommendations powered by advanced AI technology.
          </p>

          {/* Intellectual Property Rights */}
          <h2>3. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, Clarity owns the intellectual property rights for all material on the service. All intellectual 
            property rights are reserved. You may access this from Clarity for personal use subject to restrictions set in these terms 
            and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Clarity without proper attribution</li>
            <li>Sell, rent, or sub-license material from the service</li>
            <li>Reproduce, duplicate, or copy material for commercial purposes</li>
            <li>Redistribute content from Clarity unless content is specifically made for redistribution</li>
          </ul>

          {/* User Representations */}
          <h2>4. User Representations</h2>
          <p>By using Clarity, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age</li>
            <li>You are not a bot, spider, or other automated mechanism</li>
            <li>All information you provide is accurate, complete, and truthful</li>
            <li>Your use of Clarity complies with all applicable laws and regulations</li>
            <li>You will not use Clarity for any unlawful or fraudulent purpose</li>
          </ul>

          {/* Prohibited Activities */}
          <h2>5. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Access or use Clarity for any unlawful purpose or to solicit others to do the same</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon or violate our intellectual property rights or the rights of others</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Attempt to gain unauthorized access to Clarity's systems or networks</li>
            <li>Interfere with or disrupt the integrity of Clarity's services</li>
            <li>Use Clarity to transmit viruses, malware, or any code of a destructive nature</li>
            <li>Reverse engineer, decompile, or attempt to derive the source code of Clarity</li>
            <li>Remove any proprietary notices or labels from Clarity</li>
            <li>Engage in any form of automated data collection without permission</li>
          </ul>

          {/* Subscriptions */}
          <h2>6. Subscriptions and Pricing</h2>
          <p>Clarity offers the following subscription plans:</p>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <h4>Free</h4>
              <div className="price">$0/month</div>
              <ul>
                <li>Basic content organization</li>
                <li>Limited AI features</li>
                <li>Up to 100 items</li>
                <li>Community support</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h4>Pro</h4>
              <div className="price">$29.99/month</div>
              <ul>
                <li>Advanced AI features</li>
                <li>Unlimited items</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
              </ul>
            </div>
            <div className="pricing-card">
              <h4>Premium</h4>
              <div className="price">$59.99/month</div>
              <ul>
                <li>All Pro features</li>
                <li>Custom integrations</li>
                <li>Dedicated support</li>
                <li>API access</li>
              </ul>
            </div>
          </div>

          <h3>Subscription Terms</h3>
          <ul>
            <li>Subscriptions are billed monthly and renew automatically each month</li>
            <li>You may cancel your subscription at any time without penalty</li>
            <li>Refunds are not available for digital services</li>
            <li>Price changes will be communicated 30 days in advance</li>
            <li>If you cancel, your access ends at the end of your current billing cycle</li>
          </ul>

          {/* Services Management */}
          <h2>7. Services Management</h2>
          <p>
            We reserve the right to refuse service, terminate accounts, or modify content without liability if we believe content 
            violates these Terms or any applicable law. We may also pursue legal remedies for such violations.
          </p>

          {/* Term and Termination */}
          <h2>8. Term and Termination</h2>
          <p>
            These Terms are effective as of the date you first access Clarity and will remain in effect until terminated. Either 
            party may terminate this agreement at any time. Upon termination, your right to use the service will immediately cease.
          </p>
          <p>
            We may terminate or suspend your account and deny access to the service without notice if you violate these Terms or 
            for any other reason at our sole discretion.
          </p>

          {/* Governing Law */}
          <h2>9. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the State of California, United States, 
            and you irrevocably submit to the exclusive jurisdiction of the courts located in that location.
          </p>

          {/* Dispute Resolution */}
          <h2>10. Dispute Resolution</h2>
          <p>
            If a dispute arises between us, the parties agree to attempt informal negotiation for a period of thirty (30) days. 
            If the dispute is not resolved through informal negotiation, either party may initiate binding arbitration.
          </p>
          <p>
            Arbitration shall be conducted in Los Angeles, California, in accordance with the rules of the American Arbitration 
            Association. Each party shall bear its own arbitration costs.
          </p>

          {/* Limitation of Liability */}
          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Clarity shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages, including but not limited to lost profits, lost revenue, or lost data, even if advised of the 
            possibility of such damages.
          </p>
          <p>
            Our total liability for any claim arising out of or relating to these Terms or your use of Clarity shall not exceed 
            the amount you paid to Clarity in the six (6) months preceding the claim.
          </p>

          {/* Indemnification */}
          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Clarity and its officers, directors, employees, and agents from any claims, 
            damages, losses, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of the service, 
            your violation of these Terms, or your infringement of any intellectual property or other right.
          </p>

          {/* User Data */}
          <h2>13. User Data</h2>
          <p>
            You retain all rights to any data you upload or create within Clarity. By using our service, you grant us
            a limited license to use your data solely as necessary to provide the service to you. We do not use your content
            to train AI models. We will handle your data in accordance with our Privacy Policy.
          </p>
          <p>
            You are responsible for maintaining backups of your data. Clarity is not responsible for loss of data due to service 
            interruptions, technical failures, or account deletion.
          </p>

          {/* Contact Information */}
          <h2>14. Contact Us</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> <span className="contact-email">othmanamir131@gmail.com</span></p>
            <p><strong>Company:</strong> Clarity</p>
            <p><strong>Address:</strong> 20306 New Rochelle St, Walnut, CA 91789</p>
          </div>

          {/* Modifications */}
          <h2>15. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be communicated to you via email or by 
            posting a notice on our service. Your continued use of Clarity after such modifications constitutes your acceptance 
            of the updated Terms.
          </p>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              By using Clarity, you agree to these Terms of Service. If you have any questions, please contact us at the address above.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
