"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type Requirement = {
  id: number;
  company_id: number;
  title: string;
  description?: string | null;
  skills?: string[] | null;
  min_exp?: number | null;
  max_exp?: number | null;
  positions?: number | null;
  filled?: number | null;
  requirement_date?: string | null;
  validity_days?: number | null;
  status?: string | null;
  priority?: string | null;
  recruiter_id?: number | null;
};

type Company = {
  id: number;
  name?: string;
};

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export default function AssignRecruiterPage() {
  const params = useParams();
  const router = useRouter();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([
      api.getRequirement(id),
      api.listCompanies(),
      api.listRecruiters()
    ])
      .then(([req, comps, recs]) => {
        setRequirement(req);
        setCompanies(comps);
        setRecruiters(recs);
        setSelectedRecruiter(req.recruiter_id?.toString() ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load requirement"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const companyName = useMemo(() => {
    if (!requirement) return "-";
    const match = companies.find((c) => c.id === requirement.company_id);
    return match?.name ?? `Company ${requirement.company_id}`;
  }, [companies, requirement]);

  const recruiterOptions = useMemo(() => {
    return recruiters.map((recruiter) => {
      const name = [recruiter.first_name, recruiter.last_name].filter(Boolean).join(" ").trim();
      const label = name || recruiter.email || `Recruiter ${recruiter.id}`;
      return { id: recruiter.id, label };
    });
  }, [recruiters]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!requirement) return;
    setSaving(true);
    setError(null);
    try {
      await api.updateRequirement(requirement.id, {
        company_id: requirement.company_id,
        title: requirement.title,
        description: requirement.description ?? "",
        skills: requirement.skills ?? [],
        min_exp: requirement.min_exp ?? null,
        max_exp: requirement.max_exp ?? null,
        positions: requirement.positions ?? null,
        filled: requirement.filled ?? 0,
        requirement_date: requirement.requirement_date ?? "",
        validity_days: requirement.validity_days ?? null,
        priority: requirement.priority ? requirement.priority.toString().toLowerCase() : "normal",
        status: requirement.status ? requirement.status.toString().toLowerCase() : "pending",
        recruiter_id: selectedRecruiter ? Number(selectedRecruiter) : null
      });
      router.push(`/admin/requirements/${requirement.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign recruiter");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Requirements</div>
          <h2 style={{ margin: 0 }}>Assign Recruiter</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Select a recruiter for this requirement.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" onSubmit={handleSubmit}>
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
              <div className="field full">
                <label>Recruiter</label>
                <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)}>
                  <option value="">Unassigned</option>
                  {recruiterOptions.map((recruiter) => (
                    <option key={recruiter.id} value={recruiter.id}>
                      {recruiter.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error ? <div className="field" style={{ color: "var(--danger)" }}>{error}</div> : null}
            <div className="form-actions">
              <button className="btn" disabled={saving}>
                {saving ? "Assigning..." : "Save Assignment"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Requirement not found.</div>
        )}
      </form>
    </div>
  );
}
