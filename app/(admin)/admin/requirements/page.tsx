"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import ActionMenu from "../../../components/ActionMenu";

type Requirement = {
  id: number;
  title: string;
  company_name?: string;
  company_id: number;
  status?: string;
  requirement_date?: string;
};

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .listRequirements({ q: searchTerm })
        .then(setRequirements)
        .catch(() => {
          setRequirements([]);
          setError("Failed to load requirements.");
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refresh = () => {
    setError(null);
    api
      .listRequirements({ q: searchTerm })
      .then(setRequirements)
      .catch(() => {
        setRequirements([]);
        setError("Failed to load requirements.");
      });
  };

  const handleAction = (action: string, id: number) => {
    if (action === "view") {
      router.push(`/admin/requirements/${id}`);
      return;
    }
    if (action === "assign") {
      router.push(`/admin/requirements/${id}/assign`);
      return;
    }
    if (action === "match") {
      router.push(`/admin/requirements/${id}/matches`);
      return;
    }
    if (action === "edit") {
      router.push(`/admin/requirements/${id}/edit`);
      return;
    }
    if (action === "delete") {
      router.push(`/admin/requirements/${id}/delete`);
    }
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Requirements</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Showing 1-10</div>
        </div>
        <div className="search">
          <input
            placeholder="Search requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={refresh}>Refresh</button>
          <Link className="btn" href="/admin/requirements/add">Add Requirement</Link>
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
        <div className="section-header">
          <div className="helper">Tip: search by title, company, city, etc.</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label className="helper">Rows:</label>
            <select className="table-select">
              <option>10</option>
              <option>20</option>
            </select>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Status</th>
              <th>Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => (
              <tr key={req.id}>
                <td>{req.title}</td>
                <td>{req.company_name ?? "-"}</td>
                <td>-</td>
                <td><span className="badge">{req.status ?? "PENDING"}</span></td>
                <td>{req.requirement_date ?? "-"}</td>
                <td>
                  <ActionMenu
                    actions={[
                      { label: "View Details", onClick: () => handleAction("view", req.id) },
                      { label: "Assign Recruiter", onClick: () => handleAction("assign", req.id) },
                      { label: "Match Candidates", onClick: () => handleAction("match", req.id) },
                      { label: "Edit Requirement", onClick: () => handleAction("edit", req.id) },
                      { label: "Delete", onClick: () => handleAction("delete", req.id), variant: "danger" }
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
