"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

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
  city?: string;
};

export default function RecruiterRequirementDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
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

  const companyMap = useMemo(() => {
    const map: Record<number, string> = {};
    companies.forEach((c) => {
      map[c.id] = c.name ?? `Company ${c.id}`;
    });
    return map;
  }, [companies]);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Requirements</div>
          <h2 style={{ margin: 0 }}>Requirement Details</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Review the requirement details.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading requirement...</div>
        ) : error ? (
          <div style={{ color: "var(--danger)" }}>{error}</div>
        ) : requirement ? (
          <div className="form-grid">
            <div className="field">
              <label>Title</label>
              <div>{requirement.title}</div>
            </div>
            <div className="field">
              <label>Company</label>
              <div>{companyMap[requirement.company_id] ?? requirement.company_id}</div>
            </div>
            <div className="field">
              <label>Status</label>
              <div><span className="badge">{requirement.status ?? "PENDING"}</span></div>
            </div>
            <div className="field">
              <label>Priority</label>
              <div>{requirement.priority ?? "-"}</div>
            </div>
            <div className="field">
              <label>Requirement Date</label>
              <div>{requirement.requirement_date ?? "-"}</div>
            </div>
            <div className="field">
              <label>Validity (days)</label>
              <div>{requirement.validity_days ?? "-"}</div>
            </div>
            <div className="field">
              <label>Min Experience</label>
              <div>{requirement.min_exp ?? "-"}</div>
            </div>
            <div className="field">
              <label>Max Experience</label>
              <div>{requirement.max_exp ?? "-"}</div>
            </div>
            <div className="field">
              <label>Positions</label>
              <div>{requirement.positions ?? "-"}</div>
            </div>
            <div className="field">
              <label>Filled</label>
              <div>{requirement.filled ?? "-"}</div>
            </div>
            <div className="field full">
              <label>Description</label>
              <div>{requirement.description ?? "-"}</div>
            </div>
            <div className="field full">
              <label>Skills</label>
              <div>{requirement.skills?.length ? requirement.skills.join(", ") : "-"}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Requirement not found.</div>
        )}
      </div>
    </div>
  );
}
