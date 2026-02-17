"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  {
    href: "/admin/dashboard",
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
    href: "/admin/companies",
    label: "Companies",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 20V6a2 2 0 0 1 2-2h6v16H4zM14 20V9h4a2 2 0 0 1 2 2v9h-6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M7 8h2M7 11h2M7 14h2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  },
  {
    href: "/admin/requirements",
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
    href: "/admin/recruiters",
    label: "Recruiters",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0zM3 19a5 5 0 0 1 10 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M14 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0zM12 19a5 5 0 0 1 9 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    )
  },
  {
    href: "/admin/candidates",
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
    href: "/admin/candidates/bulk-upload",
    label: "Bulk Upload",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 16V4m0 0l-4 4m4-4l4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    )
  },
  {
    href: "/admin/profile",
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

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    api.logout();
  };

  return (
    <>
      <div
        className={`page ${isCollapsed ? "sidebar-collapsed" : ""}`}
        style={{ gridTemplateColumns: isCollapsed ? "88px 1fr" : "270px 1fr" }}
      >
        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="avatar">A</div>
              <div className="sidebar-text">
                <div className="brand">Admin Portal</div>
                <div className="sidebar-meta">Portal Dashboard</div>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              className="mobile-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <nav className="nav">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "active" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
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
        <div className="main">
          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {children}
        </div>
      </div>

      <style jsx global>{`
        /* Default: Hide mobile elements */
        .mobile-close {
          display: none;
        }

        .mobile-menu-button {
          display: none;
        }

        .mobile-backdrop {
          display: none;
        }

        /* Mobile/Tablet: < 1025px */
        @media (max-width: 1024px) {
          /* Page layout */
          .page {
            grid-template-columns: 1fr !important;
          }

          /* Sidebar: Hidden by default, slides in from left */
          .sidebar {
            position: fixed !important;
            top: 0;
            left: -280px;
            bottom: 0;
            width: 270px;
            height: 100vh !important;
            z-index: 1000;
            transition: transform 0.3s ease;
            box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            overflow-x: hidden !important;
            flex-direction: column !important;
            align-items: stretch !important;
            padding: 28px 22px !important;
            gap: 24px !important;
          }

          .sidebar.mobile-open {
            transform: translateX(280px);
          }

          /* Backdrop */
          .mobile-backdrop {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          /* Navigation */
          .nav {
            flex-direction: column !important;
            flex-wrap: nowrap !important;
            gap: 6px !important;
          }

          /* Sidebar header: Row layout with close button */
          .sidebar .sidebar-header {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 20px !important;
            border-radius: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            gap: 14px !important;
          }

          /* Sidebar footer */
          .sidebar .sidebar-footer {
            margin-top: auto !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }

          /* Mobile close button */
          .mobile-close {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            padding: 0;
            margin: 0;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 6px;
            color: #fff;
            cursor: pointer;
            flex-shrink: 0;
          }

          .mobile-close:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .mobile-close svg {
            width: 20px;
            height: 20px;
          }

          /* Hamburger button */
          .mobile-menu-button {
            display: flex !important;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 997;
            width: 44px;
            height: 44px;
            padding: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .mobile-menu-button:active {
            transform: scale(0.95);
          }

          .mobile-menu-button svg {
            width: 24px;
            height: 24px;
            stroke: #0f172a;
          }

          /* Hide desktop sidebar toggle */
          .sidebar-toggle {
            display: none !important;
          }

          /* Main content */
          .main {
            width: 100%;
            min-height: 100vh;
          }

          /* Adjust topbar for hamburger */
          .topbar {
            padding-left: 70px !important;
          }
        }

        /* Desktop: >= 1025px */
        @media (min-width: 1025px) {
          .mobile-close {
            display: none !important;
          }

          .mobile-menu-button {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
