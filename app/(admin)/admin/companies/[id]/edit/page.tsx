"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type CompanyForm = {
  name: string;
  website: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  phone: string;
};

const emptyForm: CompanyForm = {
  name: "",
  website: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  contact_first_name: "",
  contact_last_name: "",
  email: "",
  phone: ""
};

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<CompanyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    api
      .getCompany(id)
      .then((company) => {
        setForm({
          name: company.name ?? "",
          website: company.website ?? "",
          address: company.address ?? "",
          city: company.city ?? "",
          state: company.state ?? "",
          pincode: company.pincode ?? "",
          contact_first_name: company.contact_first_name ?? "",
          contact_last_name: company.contact_last_name ?? "",
          email: company.email ?? "",
          phone: company.phone ?? ""
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load company"))
      .finally(() => setLoading(false));
  }, [params.id]);

  function update(field: keyof CompanyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(params.id);
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await api.updateCompany(id, form);
      router.push(`/admin/companies/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update company");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Companies</div>
          <h2 style={{ margin: 0 }}>Edit Company</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Update company profile details.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading company...</div>
        ) : (
          <>
            <div className="form-grid">
              <div className="field">
                <label>Company Name</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Company name" />
              </div>
              <div className="field">
                <label>Website</label>
                <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" />
              </div>
              <div className="field full">
                <label>Address</label>
                <input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Address" />
              </div>
              <div className="field">
                <label>City</label>
                <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" />
              </div>
              <div className="field">
                <label>State</label>
                <input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="State" />
              </div>
              <div className="field">
                <label>Pincode</label>
                <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="Pincode" />
              </div>
              <div className="field">
                <label>Contact First Name</label>
                <input
                  value={form.contact_first_name}
                  onChange={(e) => update("contact_first_name", e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="field">
                <label>Contact Last Name</label>
                <input
                  value={form.contact_last_name}
                  onChange={(e) => update("contact_last_name", e.target.value)}
                  placeholder="Last name"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@company.com" />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone" />
              </div>
            </div>
            {error ? (
              <div style={{ color: "var(--danger)", marginTop: 12 }}>{error}</div>
            ) : null}
            <div className="form-actions">
              <button className="btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
