"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";

type RecruiterForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  password: string;
  confirm_password: string;
};

const emptyForm: RecruiterForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  is_active: true,
  password: "",
  confirm_password: ""
};

export default function EditRecruiterPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof RecruiterForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    api
      .getRecruiter(id)
      .then((recruiter) => {
        setForm({
          first_name: recruiter.first_name ?? "",
          last_name: recruiter.last_name ?? "",
          email: recruiter.email ?? "",
          phone: recruiter.phone ?? "",
          is_active: recruiter.is_active ?? true,
          password: "",
          confirm_password: ""
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load recruiter"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(params.id);
    if (!id) return;
    setError(null);
    if (form.password || form.confirm_password) {
      if (form.password !== form.confirm_password) {
        setError("Passwords do not match.");
        return;
      }
    }
    setSaving(true);
    try {
      await api.updateRecruiter(id, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        is_active: form.is_active,
        password: form.password ? form.password : undefined
      });
      router.push(`/admin/recruiters/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update recruiter");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Recruiters</div>
          <h2 style={{ margin: 0 }}>Edit Recruiter</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Update recruiter profile and access.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading recruiter...</div>
        ) : (
          <>
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
              <div className="field">
                <label>New Password</label>
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
            </div>
            {error ? <div className="field" style={{ color: "var(--danger)" }}>{error}</div> : null}
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
