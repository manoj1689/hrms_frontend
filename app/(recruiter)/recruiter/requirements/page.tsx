"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

type Requirement = {
  id: number;
  title: string;
  company_id: number;
  status?: string;
  requirement_date?: string;
};

type Company = {
  id: number;
  name: string;
};

export default function RecruiterRequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      api.listRequirements({ q: searchTerm }).then(setRequirements).catch(() => setRequirements([]));
    }, 300);
    return () => clearTimeout(timer);
    api.listCompanies().then(setCompanies).catch(() => setCompanies([]));
  }, [searchTerm]);

  const companyMap = useMemo(() => {
    const map: Record<number, string> = {};
    companies.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [companies]);

  const refresh = () => {
    api.listRequirements({ q: searchTerm }).then(setRequirements).catch(() => setRequirements([]));
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Requirements</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Showing 1-2 of 2</div>
        </div>
        <div className="search">
          <input
            placeholder="Search requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn secondary" onClick={refresh}>Refresh</button>
      </div>

      <div className="section">
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
                <td>{companyMap[req.company_id] ?? req.company_id}</td>
                <td>-</td>
                <td><span className="badge">{req.status ?? "PENDING"}</span></td>
                <td>{req.requirement_date ?? "-"}</td>
                <td>
                  <button className="btn secondary" onClick={() => router.push(`/recruiter/requirements/${req.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="section-header" style={{ marginTop: 12 }}>
          <div className="helper">Page 1</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn secondary">Prev</button>
            <button className="btn secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
