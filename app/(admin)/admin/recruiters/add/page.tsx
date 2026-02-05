"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

export default function AddRecruiterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    is_active: true
  });
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    await api.createRecruiter({
      tenant_id: 1,
      role: "recruiter",
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      is_active: form.is_active
    });
    router.push("/admin/recruiters");
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Add Recruiter</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Create a new recruiter account.</div>
        </div>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>First Name</label>
            <input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirm_password}
              onChange={(e) => update("confirm_password", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.is_active ? "active" : "inactive"}
              onChange={(e) => update("is_active", e.target.value === "active")}
            >
              <option value="active">Active (can login)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        {error ? <div className="field" style={{ color: "var(--danger)" }}>{error}</div> : null}
        <div className="form-actions">
          <button className="btn">Create Recruiter</button>
          <button type="button" className="btn secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
