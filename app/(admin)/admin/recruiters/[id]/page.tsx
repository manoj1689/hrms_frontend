"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
};

export default function RecruiterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    api
      .getRecruiter(id)
      .then(setRecruiter)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recruiter"))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Recruiters</div>
          <h2 style={{ margin: 0 }}>Recruiter Details</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Profile and access status.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={() => router.back()}>
            Back
          </button>
          {recruiter ? (
            <button className="btn" onClick={() => router.push(`/admin/recruiters/${recruiter.id}/edit`)}>
              Edit Recruiter
            </button>
          ) : null}
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading recruiter...</div>
        ) : error ? (
          <div style={{ color: "var(--danger)" }}>{error}</div>
        ) : recruiter ? (
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <div>{`${recruiter.first_name ?? ""} ${recruiter.last_name ?? ""}`.trim() || recruiter.email}</div>
            </div>
            <div className="field">
              <label>Email</label>
              <div>{recruiter.email}</div>
            </div>
            <div className="field">
              <label>Phone</label>
              <div>{recruiter.phone ?? "-"}</div>
            </div>
            <div className="field">
              <label>Role</label>
              <div>{recruiter.role ?? "HR Recruiter"}</div>
            </div>
            <div className="field">
              <label>Status</label>
              <div>{recruiter.is_active ? "Active" : "Inactive"}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Recruiter not found.</div>
        )}
      </div>
    </div>
  );
}
