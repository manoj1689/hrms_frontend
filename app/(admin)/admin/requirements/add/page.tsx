"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

type Company = {
  id: number;
  name?: string;
  city?: string;
};

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export default function AddRequirementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    skills: "",
    min_exp: "",
    max_exp: "",
    positions: "",
    filled: "0",
    requirement_date: "",
    validity_days: "",
    priority: "Normal",
    status: "Pending",
    recruiter_id: ""
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function splitList(value: string) {
    return value
      .split(/[,\\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  useEffect(() => {
    api.listCompanies().then(setCompanies).catch(() => setCompanies([]));
    api.listRecruiters().then(setRecruiters).catch(() => setRecruiters([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!form.company_id) {
      setSubmitError("Please select a company.");
      return;
    }
    await api.createRequirement({
      tenant_id: 1,
      company_id: Number(form.company_id),
      title: form.title,
      description: form.description,
      skills: form.skills ? splitList(form.skills) : [],
      min_exp: form.min_exp ? Number(form.min_exp) : null,
      max_exp: form.max_exp ? Number(form.max_exp) : null,
      positions: form.positions ? Number(form.positions) : null,
      filled: form.filled ? Number(form.filled) : 0,
      requirement_date: form.requirement_date,
      validity_days: form.validity_days ? Number(form.validity_days) : null,
      priority: form.priority.toLowerCase(),
      status: form.status.toLowerCase(),
      recruiter_id: form.recruiter_id ? Number(form.recruiter_id) : null
    });
    router.push("/admin/requirements");
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Add Requirement</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Create a new requirement for a company.</div>
        </div>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        <div className="section-header">
          <div className="section-title">Basic Details</div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Company</label>
            <select value={form.company_id} onChange={(e) => update("company_id", e.target.value)}>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name ?? `Company ${company.id}`}{company.city ? ` - ${company.city}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Requirement title" />
          </div>
          <div className="field full">
            <label>Description</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <button type="button" className="btn secondary">B</button>
              <button type="button" className="btn secondary">I</button>
              <button type="button" className="btn secondary">U</button>
              <button type="button" className="btn secondary">List</button>
              <button type="button" className="btn secondary">Link</button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={6}
              placeholder="Describe the requirement"
            />
          </div>
        </div>

        <div className="section-header" style={{ marginTop: 20 }}>
          <div className="section-title">Skills</div>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>Skills</label>
            <input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Type and press Enter" />
          </div>
        </div>

        <div className="section-header" style={{ marginTop: 20 }}>
          <div className="section-title">Experience</div>
        </div>
        <div className="form-grid three">
          <div className="field">
            <label>Min Experience (years)</label>
            <input value={form.min_exp} onChange={(e) => update("min_exp", e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label>Max Experience (years)</label>
            <input value={form.max_exp} onChange={(e) => update("max_exp", e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label>Positions</label>
            <input value={form.positions} onChange={(e) => update("positions", e.target.value)} placeholder="0" />
          </div>
          <div className="field">
            <label>Filled</label>
            <input value={form.filled} onChange={(e) => update("filled", e.target.value)} placeholder="0" />
          </div>
        </div>

        <div className="section-header" style={{ marginTop: 20 }}>
          <div className="section-title">Timeline</div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Requirement Date</label>
            <input value={form.requirement_date} onChange={(e) => update("requirement_date", e.target.value)} placeholder="dd-mm-yyyy" />
          </div>
          <div className="field">
            <label>Validity (days)</label>
            <input value={form.validity_days} onChange={(e) => update("validity_days", e.target.value)} placeholder="45" />
          </div>
        </div>

        <div className="section-header" style={{ marginTop: 20 }}>
          <div className="section-title">Status</div>
        </div>
        <div className="form-grid three">
          <div className="field">
            <label>Priority</label>
            <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
              <option>Normal</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option>Pending</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
              <option>Closed</option>
            </select>
          </div>
          <div className="field">
            <label>Recruiter</label>
            <select value={form.recruiter_id} onChange={(e) => update("recruiter_id", e.target.value)}>
              <option value="">Select recruiter</option>
              {recruiters.map((recruiter) => {
                const name = [recruiter.first_name, recruiter.last_name].filter(Boolean).join(" ").trim();
                const label = name || recruiter.email || `Recruiter ${recruiter.id}`;
                return (
                  <option key={recruiter.id} value={recruiter.id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {submitError ? <div className="field" style={{ color: "var(--danger)" }}>{submitError}</div> : null}
        <div className="form-actions">
          <button className="btn">Create Requirement</button>
          <button type="button" className="btn secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
