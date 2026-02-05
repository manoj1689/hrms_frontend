"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

type Company = {
  id: number;
  name: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  email?: string;
  phone?: string;
};

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    api
      .getCompany(id)
      .then(setCompany)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load company"))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Companies</div>
          <h2 style={{ margin: 0 }}>Company Details</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Overview of company profile and contacts.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={() => router.back()}>
            Back
          </button>
          {company ? (
            <button className="btn" onClick={() => router.push(`/admin/companies/${company.id}/edit`)}>
              Edit Company
            </button>
          ) : null}
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading company...</div>
        ) : error ? (
          <div style={{ color: "var(--danger)" }}>{error}</div>
        ) : company ? (
          <div className="form-grid">
            <div className="field">
              <label>Company Name</label>
              <div>{company.name}</div>
            </div>
            <div className="field">
              <label>Website</label>
              <div>{company.website ?? "-"}</div>
            </div>
            <div className="field full">
              <label>Address</label>
              <div>{company.address ?? "-"}</div>
            </div>
            <div className="field">
              <label>City</label>
              <div>{company.city ?? "-"}</div>
            </div>
            <div className="field">
              <label>State</label>
              <div>{company.state ?? "-"}</div>
            </div>
            <div className="field">
              <label>Pincode</label>
              <div>{company.pincode ?? "-"}</div>
            </div>
            <div className="field">
              <label>Contact First Name</label>
              <div>{company.contact_first_name ?? "-"}</div>
            </div>
            <div className="field">
              <label>Contact Last Name</label>
              <div>{company.contact_last_name ?? "-"}</div>
            </div>
            <div className="field">
              <label>Email</label>
              <div>{company.email ?? "-"}</div>
            </div>
            <div className="field">
              <label>Phone</label>
              <div>{company.phone ?? "-"}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Company not found.</div>
        )}
      </div>
    </div>
  );
}
