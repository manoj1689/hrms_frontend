"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

type Candidate = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  interested_position?: string;
};

import ActionMenu from "../../../components/ActionMenu";

export default function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.listCandidates().then((items) => setCandidates(items as Candidate[])).catch(() => setCandidates([]));
  }, []);

  const handleAction = (action: string, id: number) => {
    if (action === "schedule") {
      router.push(`/recruiter/interviews?candidate_id=${id}`);
      return;
    }
    if (action === "view") {
      router.push(`/recruiter/candidates/${id}`);
      return;
    }
    if (action === "edit") {
      router.push(`/recruiter/candidates/${id}/edit`);
      return;
    }
    if (action === "delete") {
      router.push(`/recruiter/candidates/${id}/delete`);
    }
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Candidates</h2>
        </div>
        <div className="search">
          <input placeholder="Search by name, email or phone" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn secondary" href="/recruiter/candidates/bulk-upload">Bulk Upload</Link>
          <Link className="btn" href="/recruiter/candidates/add">Add Candidate</Link>
        </div>
      </div>

      <div className="section">
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
                  <span className="subtext">Bangalore</span>
                </td>
                <td>{c.email ?? "-"}</td>
                <td>{c.phone ?? "-"}</td>
                <td>{c.interested_position ?? "-"}</td>
                <td><span className="badge">PENDING</span></td>
                <td>-</td>
                <td>
                  <ActionMenu
                    actions={[
                      { label: "Schedule Interview", onClick: () => handleAction("schedule", c.id) },
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
