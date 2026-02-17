import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      {/* Header */}
      <header className="site-header">
        <div className="site-brand">Portal HR</div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <Link href="/login" className="btn">
          Login
        </Link>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-card">
          <p className="hero-eyebrow">AI-Powered Recruitment Platform</p>
          <h1>Hire Smarter, Faster with Portal HR</h1>
          <p className="hero-copy">
            Streamline your entire hiring pipeline — from AI resume parsing to
            candidate tracking — so your team can focus on finding the right
            talent.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="btn">
              Get Started Free
            </Link>
            <a href="#features" className="btn secondary">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted-bar">
        <p>Trusted by 500+ recruiting teams worldwide</p>
      </section>

      {/* Features */}
      <section className="feature-section" id="features">
        <h2 className="section-title">Everything you need to recruit better</h2>
        <p className="section-subtitle">
          Powerful tools that work together to streamline your hiring workflow
          from sourcing to onboarding.
        </p>
        <div className="feature-grid">
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 15l2 2 4-4" />
              </svg>
            }
            title="AI Resume Parsing"
            description="Upload a PDF and AI automatically extracts candidate details, skills, and experience to create a complete profile in seconds."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            }
            title="Bulk Upload"
            description="Process hundreds of resumes at once with real-time progress tracking, pause/resume controls, and duplicate detection."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <path d="M11 8v6" />
                <path d="M8 11h6" />
              </svg>
            }
            title="Smart Candidate Search"
            description="AI-powered vector search finds the best matching candidates for any job requirement using semantic understanding."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            }
            title="Requirement Management"
            description="Track open positions, assign recruiters, and manage pipeline stages from sourced to joined — all in one place."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
              </svg>
            }
            title="Interview Scheduling"
            description="Schedule interviews, track statuses, and coordinate across modes — online, face-to-face, or telephonic."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Multi-Tenant & Role-Based"
            description="Super Admin, Admin, and Recruiter roles with complete tenant-level data isolation and access control."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how-it-works">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtitle">
          Get started in minutes. Three simple steps to transform your
          recruitment.
        </p>
        <div className="steps-grid">
          <StepCard
            number="1"
            title="Upload Resumes"
            description="Drag and drop PDF resumes — one at a time or hundreds via bulk upload."
          />
          <StepCard
            number="2"
            title="AI Extracts Data"
            description="Our AI reads each resume, extracts skills, experience, education, and creates structured profiles automatically."
          />
          <StepCard
            number="3"
            title="Match & Hire"
            description="Match candidates to open requirements, schedule interviews, and move through your pipeline to hire."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">10x</span>
          <span className="stat-label">Faster resume processing</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">90%</span>
          <span className="stat-label">Data extraction accuracy</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">50%</span>
          <span className="stat-label">Reduction in time-to-hire</span>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section" id="pricing">
        <h2 className="section-title">Simple, transparent pricing</h2>
        <p className="section-subtitle">
          Start free and scale as your team grows. No hidden fees.
        </p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-tier">Starter</div>
            <div className="pricing-price">
              Free<span>/forever</span>
            </div>
            <p className="pricing-desc">Perfect for trying out Portal HR</p>
            <ul className="pricing-features">
              <li>1 Recruiter</li>
              <li>100 Candidates</li>
              <li>Basic resume parsing</li>
              <li>Email support</li>
            </ul>
            <Link href="/login" className="btn secondary" style={{ width: "100%" }}>
              Get Started
            </Link>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-badge">Most Popular</div>
            <div className="pricing-tier">Growth</div>
            <div className="pricing-price">
              $49<span>/month</span>
            </div>
            <p className="pricing-desc">For growing recruiting teams</p>
            <ul className="pricing-features">
              <li>10 Recruiters</li>
              <li>Unlimited Candidates</li>
              <li>AI resume parsing</li>
              <li>Bulk upload</li>
              <li>Smart candidate search</li>
              <li>Priority support</li>
            </ul>
            <Link href="/login" className="btn" style={{ width: "100%" }}>
              Start Free Trial
            </Link>
          </div>
          <div className="pricing-card">
            <div className="pricing-tier">Enterprise</div>
            <div className="pricing-price">
              Custom<span></span>
            </div>
            <p className="pricing-desc">For large teams and agencies</p>
            <ul className="pricing-features">
              <li>Unlimited Recruiters</li>
              <li>Unlimited Candidates</li>
              <li>All Growth features</li>
              <li>Custom integrations</li>
              <li>SSO & advanced security</li>
              <li>Dedicated account manager</li>
            </ul>
            <Link href="/login" className="btn secondary" style={{ width: "100%" }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to transform your recruitment?</h2>
        <p>
          Join hundreds of teams already using Portal HR to hire smarter and
          faster.
        </p>
        <Link href="/login" className="btn cta-btn">
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Portal HR</h3>
            <p>AI-powered recruitment management for modern teams.</p>
          </div>
          <div className="footer-links">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Portal HR. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
