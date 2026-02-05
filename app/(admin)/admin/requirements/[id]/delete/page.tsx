"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type Requirement = {
  id: number;
  company_id: number;
  title: string;
};

type Company = {
  id: number;
  name?: string;
};

export default function DeleteRequirementPage() {
  const params = useParams();
  const router = useRouter();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([api.getRequirement(id), api.listCompanies()])
      .then(([req, comps]) => {
        setRequirement(req);
        setCompanies(comps);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load requirement"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const companyName = useMemo(() => {
    if (!requirement) return "-";
    const match = companies.find((c) => c.id === requirement.company_id);
    return match?.name ?? `Company ${requirement.company_id}`;
  }, [companies, requirement]);

  async function handleDelete() {
    if (!requirement) return;
    setSaving(true);
    setError(null);
    try {
      await api.deleteRequirement(requirement.id);
      router.push("/admin/requirements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete requirement");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Requirements</div>
          <h2 style={{ margin: 0 }}>Delete Requirement</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>This action cannot be undone.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading requirement...</div>
        ) : requirement ? (
          <>
            <div className="form-grid">
              <div className="field">
                <label>Requirement</label>
                <div>{requirement.title}</div>
              </div>
              <div className="field">
                <label>Company</label>
                <div>{companyName}</div>
              </div>
            </div>
            {error ? <div style={{ color: "var(--danger)", marginTop: 16 }}>{error}</div> : null}
            <div className="form-actions">
              <button className="btn" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting..." : "Delete Requirement"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Requirement not found.</div>
        )}
      </div>
    </div>
  );
}
