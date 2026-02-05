"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";

type Metrics = {
  total_candidates: number;
  pending_candidates: number;
  interviews: number;
  rejected_last_30: number;
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    api.adminMetrics().then(setMetrics).catch(() => setMetrics(null));
  }, []);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-row">
          <div className="topbar-title">
            <h2 style={{ margin: 0, fontSize: "28px" }}>👋 Welcome back, Admin</h2>
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
              Here's what's happening in your workspace today.
            </div>
          </div>
        </div>
        <div className="search">
          <input placeholder="Search candidates, jobs, or companies..." />
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="label">Total Candidates</div>
            <div className="icon-box">👥</div>
          </div>
          <div className="value">{metrics?.total_candidates ?? 0}</div>
          <div style={{ fontSize: 12, color: "var(--success-text)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>+12%</span> from last month
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="label">Pending Action</div>
            <div className="icon-box">⚡</div>
          </div>
          <div className="value">{metrics?.pending_candidates ?? 0}</div>
          <div style={{ fontSize: 12, color: "var(--warning-text)", marginTop: 8 }}>
            Requires attention
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="label">Interviews Scheduled</div>
            <div className="icon-box">📅</div>
          </div>
          <div className="value">{metrics?.interviews ?? 0}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            Upcoming this week
          </div>
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div className="label">Closure Rate</div>
            <div className="icon-box">🎯</div>
          </div>
          <div className="value">85%</div>
          <div style={{ fontSize: 12, color: "var(--success-text)", marginTop: 8 }}>
            Top tier performance
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Overview of the latest recruitment actions
            </div>
          </div>
          <div>
            <button className="btn secondary" style={{ fontSize: 13, padding: "8px 16px" }}>Download Report</button>
          </div>
        </div>
        <div style={{ padding: 40, display: "grid", placeItems: "center", minHeight: 200, color: "var(--text-muted)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div>Activity charts and data visualization would appear here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
