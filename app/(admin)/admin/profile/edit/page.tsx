"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

const emptyForm: ProfileForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: ""
};

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof ProfileForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    api
      .getMe()
      .then((user) => {
        setForm({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? ""
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateMe({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone
      });
      router.push("/admin/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Profile</div>
          <h2 style={{ margin: 0 }}>Edit Profile</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Update your account details.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" style={{ maxWidth: 720 }} onSubmit={handleSubmit}>
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading profile...</div>
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
