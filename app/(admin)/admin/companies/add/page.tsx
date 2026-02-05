"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

export default function AddCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
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
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.createCompany({ ...form, tenant_id: 1 });
    router.push("/admin/companies");
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Add Company</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Create a new company profile.</div>
        </div>
      </div>

      <form className="section" onSubmit={handleSubmit}>
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
        <div className="form-actions">
          <button className="btn">Create Company</button>
          <button type="button" className="btn secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
