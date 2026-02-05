"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

type User = {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role?: string | null;
  is_active?: boolean | null;
};

function titleCase(value?: string | null) {
  if (!value) return "-";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMe()
      .then(setUser)
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const name = user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() : "";

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Profile</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>View your account details.</div>
        </div>
      </div>

      <div className="section" style={{ maxWidth: 720 }}>
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading profile...</div>
        ) : error ? (
          <div style={{ color: "var(--danger)" }}>{error}</div>
        ) : user ? (
          <>
            <div className="section-header">
              <div>
                <div style={{ fontWeight: 600 }}>{name || user.email}</div>
                <div className="helper">{user.email}</div>
              </div>
              <button className="btn secondary" onClick={() => router.push("/admin/profile/edit")}>
                Edit Profile
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <span className="badge">Status: {user.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div className="form-grid">
              <div className="field">
                <label>Role</label>
                <div>{titleCase(user.role)}</div>
              </div>
              <div className="field">
                <label>Phone Number</label>
                <div>{user.phone ?? "-"}</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="helper">Password</div>
              <div className="topbar-row" style={{ justifyContent: "space-between" }}>
                <span className="helper">Update your account password.</span>
                <button className="btn secondary" onClick={() => router.push("/admin/profile/password")}>
                  Change Password
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Profile not found.</div>
        )}
      </div>
    </div>
  );
}
