"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import ActionMenu from "../../../components/ActionMenu";

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
};

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .listRecruiters({ q: searchTerm })
        .then(setRecruiters)
        .catch(() => {
          setRecruiters([]);
          setError("Failed to load recruiters.");
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refresh = () => {
    setError(null);
    api
      .listRecruiters({ q: searchTerm })
      .then(setRecruiters)
      .catch(() => {
        setRecruiters([]);
        setError("Failed to load recruiters.");
      });
  };

  const handleAction = (action: string, id: number) => {
    if (action === "view") {
      router.push(`/admin/recruiters/${id}`);
      return;
    }
    if (action === "edit") {
      router.push(`/admin/recruiters/${id}/edit`);
      return;
    }
    if (action === "delete") {
      router.push(`/admin/recruiters/${id}/delete`);
    }
  };

  const exportToCsv = () => {
    if (!recruiters.length) return;
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Role", "Status"];
    const rows = recruiters.map((recruiter) => [
      String(recruiter.id),
      recruiter.first_name ?? "",
      recruiter.last_name ?? "",
      recruiter.email ?? "",
      recruiter.phone ?? "",
      recruiter.role ?? "HR Recruiter",
      recruiter.is_active ? "ACTIVE" : "INACTIVE"
    ]);

    const escapeCell = (value: string) => {
      const needsQuotes = /[",\n]/.test(value);
      const escaped = value.replace(/"/g, "\"\"");
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recruiters-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Recruiters</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Manage recruiter accounts and access.</div>
        </div>
        <div className="search">
          <input
            placeholder="Search recruiters (name, email, phone)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={refresh}>Refresh</button>
          <button className="btn secondary" onClick={exportToCsv}>
            Export to Excel
          </button>
          <Link className="btn" href="/admin/recruiters/add">Add Recruiter</Link>
        </div>
      </div>

      <div className="section">
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--danger)",
              background: "var(--danger-light)",
              color: "var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <span>{error}</span>
            <button className="btn secondary" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Recruiter</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r.id}>
                <td>{`${r.first_name ?? ""} ${r.last_name ?? ""}`.trim() || r.email}</td>
                <td>{r.email}</td>
                <td>{r.phone ?? "-"}</td>
                <td><span className="badge">{r.role ?? "HR Recruiter"}</span></td>
                <td><span className="badge">{r.is_active ? "ACTIVE" : "INACTIVE"}</span></td>
                <td>
                  <ActionMenu
                    actions={[
                      { label: "View Details", onClick: () => handleAction("view", r.id) },
                      { label: "Edit Recruiter", onClick: () => handleAction("edit", r.id) },
                      { label: "Delete", onClick: () => handleAction("delete", r.id), variant: "danger" }
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
