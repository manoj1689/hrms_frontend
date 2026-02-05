"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

type Metrics = {
  requirements_assigned: number;
  candidates_hired: number;
  offers_made: number;
  candidates_rejected: number;
};

export default function RecruiterDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    api.recruiterMetrics().then(setMetrics).catch(() => setMetrics(null));
  }, []);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-row">
          <button className="icon-button" aria-label="Toggle menu">Menu</button>
          <div className="topbar-title">
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
            <h2 style={{ margin: 0 }}>HR Recruiter Panel</h2>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Manage your workspace</div>
          </div>
        </div>
        <div className="badge">SD</div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="topbar-row" style={{ justifyContent: "space-between" }}>
            <div className="label">Requirements Assigned</div>
            <span className="chip">Total</span>
          </div>
          <div className="value">{metrics?.requirements_assigned ?? "-"}</div>
        </div>
        <div className="card">
          <div className="topbar-row" style={{ justifyContent: "space-between" }}>
            <div className="label">Candidates Hired</div>
            <span className="chip">Total</span>
          </div>
          <div className="value">{metrics?.candidates_hired ?? "-"}</div>
        </div>
        <div className="card">
          <div className="topbar-row" style={{ justifyContent: "space-between" }}>
            <div className="label">Offers Made</div>
            <span className="chip">Total</span>
          </div>
          <div className="value">{metrics?.offers_made ?? "-"}</div>
        </div>
        <div className="card">
          <div className="topbar-row" style={{ justifyContent: "space-between" }}>
            <div className="label">Candidates Rejected</div>
            <span className="chip">Total</span>
          </div>
          <div className="value">{metrics?.candidates_rejected ?? "-"}</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <strong>Recruited Candidates</strong>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Last 30 days activity</div>
          </div>
        </div>
        <div style={{ height: 240, border: "1px dashed var(--border)", borderRadius: 12 }} />
      </div>
    </div>
  );
}
