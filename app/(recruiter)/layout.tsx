"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  {
    href: "/recruiter/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    )
  },
  {
    href: "/recruiter/requirements",
    label: "Requirements",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M8 11h8M8 15h5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  },
  {
    href: "/recruiter/candidates",
    label: "Candidates",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0zM3 20a6 6 0 0 1 12 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M16.5 13.5l2 2 4-4"
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
    href: "/recruiter/interviews",
    label: "Interviews",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 4v3M17 4v3M4 10h16M5 7h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M8 14h4" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  },
  {
    href: "/recruiter/profile",
    label: "Profile",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 20a6 6 0 0 1 12 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8.5 8.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    )
  }
];

import { api } from "../lib/api";

export default function RecruiterLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    api.logout();
  };

  return (
    <div
      className={`page ${isCollapsed ? "sidebar-collapsed" : ""}`}
      style={{ gridTemplateColumns: isCollapsed ? "88px 1fr" : "270px 1fr" }}
    >
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="avatar">H</div>
            <div className="sidebar-text">
              <div className="brand">HR Recruiter</div>
              <div className="sidebar-meta">Portal Dashboard</div>
            </div>
          </div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? ">" : "<"}
          </button>
          <button
            onClick={handleLogout}
            className="btn secondary block"
          >
            <span className="logout-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M15 12H3m0 0l3-3m-3 3l3 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="logout-label">Logout</span>
          </button>
        </div>
      </aside>
      <div className="main">{children}</div>
    </div>
  );
}
