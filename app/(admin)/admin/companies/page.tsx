"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

type Company = {
  id: number;
  name: string;
  city?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  phone?: string;
  email?: string;
  website?: string;
};

import ActionMenu from "../../../components/ActionMenu";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .listCompanies({ q: searchTerm })
        .then(setCompanies)
        .catch(() => setCompanies([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const refresh = () => {
    setLoading(true);
    setError(null);
    api
      .listCompanies({ q: searchTerm })
      .then(setCompanies)
      .finally(() => setLoading(false));
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) {
      const message = err.message?.trim();
      if (!message) return "Failed to delete company.";
      try {
        const parsed = JSON.parse(message) as { detail?: string };
        if (parsed?.detail) return parsed.detail;
      } catch {
        // Ignore JSON parse errors and fall back to raw message.
      }
      return message;
    }
    return "Failed to delete company.";
  };

  const handleAction = async (action: string, id: number) => {
    if (action === "view") {
      router.push(`/admin/companies/${id}`);
      return;
    }
    if (action === "edit") {
      router.push(`/admin/companies/${id}/edit`);
      return;
    }
    if (action === "delete") {
      const ok = window.confirm("Delete this company? This action cannot be undone.");
      if (!ok) return;
      setError(null);
      try {
        await api.deleteCompany(id);
        refresh();
      } catch (err) {
        const message = getErrorMessage(err);
        if (message.toLowerCase().includes("requirement")) {
          setError("This company has requirements and cannot be deleted. Delete or reassign those requirements first.");
        } else {
          setError(message);
        }
      }
    }
  };

  const copyText = async (value: string, label: string) => {
    if (!value) {
      window.alert(`${label} not available for this company.`);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.alert("Copy failed. Please try again.");
    }
  };

  const openWebsite = (url?: string) => {
    if (!url) {
      window.alert("Website not available for this company.");
      return;
    }
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    window.open(normalized, "_blank", "noopener,noreferrer");
  };

  const exportToCsv = () => {
    if (!companies.length) return;
    const headers = [
      "ID",
      "Company",
      "City",
      "Contact First Name",
      "Contact Last Name",
      "Phone",
      "Email",
      "Website"
    ];
    const rows = companies.map((company) => [
      String(company.id),
      company.name ?? "",
      company.city ?? "",
      company.contact_first_name ?? "",
      company.contact_last_name ?? "",
      company.phone ?? "",
      company.email ?? "",
      company.website ?? ""
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
    link.download = `companies-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Companies</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Manage company profiles and contacts.</div>
        </div>
        <div className="search">
          <input
            placeholder="Search company, city, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={exportToCsv}>
            Export to Excel
          </button>
          <Link className="btn" href="/admin/companies/add">Add Company</Link>
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
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {loading ? "Updating..." : `Page 1 of 1 - Total ${companies.length}`}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label className="helper">Rows:</label>
            <select className="table-select">
              <option>10</option>
              <option>20</option>
            </select>
            <button className="btn secondary">Previous</button>
            <button className="btn">Next</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Website</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  {company.name}
                  <span className="subtext">{company.website ?? "-"}</span>
                </td>
                <td>
                  {company.city ?? "-"}
                  <span className="subtext">PIN: -</span>
                </td>
                <td>
                  {`${company.contact_first_name ?? ""} ${company.contact_last_name ?? ""}`.trim() || "-"}
                </td>
                <td>{company.phone ?? "-"}</td>
                <td>{company.email ?? "-"}</td>
                <td>{company.website ?? "-"}</td>
                <td>
                  <ActionMenu
                    actions={[
                      {
                        label: "View Details",
                        onClick: () => handleAction("view", company.id),
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        )
                      },
                      {
                        label: "Edit Company",
                        onClick: () => handleAction("edit", company.id),
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M4 20h4l10-10-4-4L4 16v4z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M14 6l4 4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        )
                      },
                      {
                        label: "Copy Email",
                        onClick: () => copyText(company.email ?? "", "Email"),
                        separator: true,
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M4 6h16v12H4z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M4 7l8 6 8-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        )
                      },
                      {
                        label: "Copy Phone",
                        onClick: () => copyText(company.phone ?? "", "Phone"),
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M7 3h4l2 5-2 2c1 3 3 5 6 6l2-2 5 2v4c-9 1-17-7-17-17z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )
                      },
                      {
                        label: "Open Website",
                        onClick: () => openWebsite(company.website),
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M14 3h7v7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                            <path
                              d="M10 14L21 3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                            <path
                              d="M5 7v12h12"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        )
                      },
                      {
                        label: "Delete",
                        onClick: () => handleAction("delete", company.id),
                        variant: "danger",
                        separator: true,
                        icon: (
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M4 7h16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M9 7V4h6v3"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M7 7l1 13h8l1-13"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        )
                      }
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
