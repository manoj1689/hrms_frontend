"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.current_password || !form.new_password) {
      setError("Please fill all fields.");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await api.changePassword({
        current_password: form.current_password,
        new_password: form.new_password
      });
      router.push("/admin/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Profile</div>
          <h2 style={{ margin: 0 }}>Change Password</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Update your account password.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" style={{ maxWidth: 720 }} onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Current Password</label>
            <input
              type="password"
              value={form.current_password}
              onChange={(e) => update("current_password", e.target.value)}
            />
          </div>
          <div className="field">
            <label>New Password</label>
            <input type="password" value={form.new_password} onChange={(e) => update("new_password", e.target.value)} />
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
            {saving ? "Saving..." : "Update Password"}
          </button>
          <button type="button" className="btn secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
