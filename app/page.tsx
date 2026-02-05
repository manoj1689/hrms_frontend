import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="site-brand">HRMS Platform</div>
        <Link href="/login" className="btn">
          Login
        </Link>
      </header>

      <section className="hero">
        <div className="hero-card">
          <p className="hero-eyebrow">Talent operations, streamlined</p>
          <h1>Modern recruitment management, built for momentum.</h1>
          <p className="hero-copy">
            Streamline hiring with a unified workspace for candidates, interview scheduling,
            and team collaboration. Move faster without losing visibility.
          </p>
          <div className="hero-actions">
            <Link href="/login" className="btn">
              Get Started
            </Link>
            <button className="btn secondary">Explore Product</button>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-grid">
          <FeatureCard
            title="Command Center"
            description="Monitor the full funnel with live metrics and quick actions from one dashboard."
          />
          <FeatureCard
            title="Candidate Tracking"
            description="Track every candidate touchpoint and keep context in a shared timeline."
          />
          <FeatureCard
            title="Interview Ops"
            description="Coordinate interview panels, schedules, and feedback in minutes."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
