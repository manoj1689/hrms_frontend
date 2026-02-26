"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import ActionMenu from "../../../components/ActionMenu";

type Candidate = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  interested_position?: string;
  recruiter_id?: number;
  recruiter_name?: string;
  current_location?: string;
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .listCandidates({ q: searchTerm })
        .then((items) => setCandidates(items as Candidate[]))
        .catch(() => {
          setCandidates([]);
          setError("Failed to load candidates.");
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refresh = () => {
    setError(null);
    api
      .listCandidates({ q: searchTerm })
      .then((items) => setCandidates(items as Candidate[]))
      .catch(() => {
        setCandidates([]);
        setError("Failed to load candidates.");
      });
  };

  const handleAction = (action: string, id: number) => {
    if (action === "view") {
      router.push(`/admin/candidates/${id}`);
      return;
    }
    if (action === "edit") {
      router.push(`/admin/candidates/${id}/edit`);
      return;
    }
    if (action === "delete") {
      router.push(`/admin/candidates/${id}/delete`);
    }
  };

  const exportToCsv = () => {
    if (!candidates.length) return;
    const headers = [
      "ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Interested Position",
      "Recruiter",
      "Location"
    ];
    const rows = candidates.map((candidate) => [
      String(candidate.id),
      candidate.first_name ?? "",
      candidate.last_name ?? "",
      candidate.email ?? "",
      candidate.phone ?? "",
      candidate.interested_position ?? "",
      candidate.recruiter_name ?? "",
      candidate.current_location ?? ""
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
    link.download = `candidates-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Candidates</h2>
        </div>
        <div className="search">
          <input
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={refresh}>Refresh</button>
          <button className="btn secondary" onClick={exportToCsv}>
            Export to Excel
          </button>
          <Link className="btn" href="/admin/candidates/add">Add Candidate</Link>
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
              <th>Candidate</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Interested Position</th>
              <th>Status</th>
              <th>Recruiter</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id}>
                <td>
                  {`${c.first_name ?? ""} ${c.last_name ?? ""}`.trim()}
                  <span className="subtext">{c.current_location ?? "Bangalore"}</span>
                </td>
                <td>{c.email ?? "-"}</td>
                <td>{c.phone ?? "-"}</td>
                <td>{c.interested_position ?? "-"}</td>
                <td><span className="badge">PENDING</span></td>
                <td>{c.recruiter_name ?? "-"}</td>
                <td>
                  <ActionMenu
                    actions={[
                      { label: "View Details", onClick: () => handleAction("view", c.id) },
                      { label: "Edit Candidate", onClick: () => handleAction("edit", c.id) },
                      { label: "Delete", onClick: () => handleAction("delete", c.id), variant: "danger" }
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
