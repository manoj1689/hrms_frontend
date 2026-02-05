"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
};

export default function DeleteRecruiterPage() {
  const params = useParams();
  const router = useRouter();
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .getRecruiter(id)
      .then(setRecruiter)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recruiter"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!recruiter) return;
    setSaving(true);
    setError(null);
    try {
      await api.deleteRecruiter(recruiter.id);
      router.push("/admin/recruiters");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete recruiter";
      if (typeof message === "string" && message.toLowerCase().includes("requirement")) {
        setError("This recruiter has assigned requirements and cannot be deleted. Reassign those requirements first.");
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  }

  const name = recruiter ? `${recruiter.first_name ?? ""} ${recruiter.last_name ?? ""}`.trim() : "";

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Recruiters</div>
          <h2 style={{ margin: 0 }}>Delete Recruiter</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading recruiter...</div>
        ) : recruiter ? (
          <>
            <div className="form-grid">
              <div className="field">
                <label>Recruiter</label>
                <div>{name || recruiter.email}</div>
              </div>
              <div className="field">
                <label>Email</label>
                <div>{recruiter.email}</div>
              </div>
            </div>
            {error ? <div style={{ color: "var(--danger)", marginTop: 16 }}>{error}</div> : null}
            <div className="form-actions">
              <button className="btn" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting..." : "Delete Recruiter"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Recruiter not found.</div>
        )}
      </div>
    </div>
  );
}
