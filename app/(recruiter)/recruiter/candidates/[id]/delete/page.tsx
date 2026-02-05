"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type Candidate = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

export default function RecruiterDeleteCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .getCandidate(id)
      .then(setCandidate)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load candidate"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!candidate) return;
    setSaving(true);
    setError(null);
    try {
      await api.deleteCandidate(candidate.id);
      router.push("/recruiter/candidates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete candidate");
    } finally {
      setSaving(false);
    }
  }

  const name = candidate ? `${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() : "";

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Candidates</div>
          <h2 style={{ margin: 0 }}>Delete Candidate</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading candidate...</div>
        ) : candidate ? (
          <>
            <div className="form-grid">
              <div className="field">
                <label>Candidate</label>
                <div>{name || candidate.email || "-"}</div>
              </div>
              <div className="field">
                <label>Email</label>
                <div>{candidate.email ?? "-"}</div>
              </div>
            </div>
            {error ? <div style={{ color: "var(--danger)", marginTop: 16 }}>{error}</div> : null}
            <div className="form-actions">
              <button className="btn" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting..." : "Delete Candidate"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Candidate not found.</div>
        )}
      </div>
    </div>
  );
}
