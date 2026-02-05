"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import * as Dialog from "@radix-ui/react-dialog";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("hrms_token", res.access_token);

      // Role-based redirect
      if (res.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const fillCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg)" }}>
      <div
        className="form-grid"
        style={{
          maxWidth: 900,
          width: "100%",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "start"
        }}
      >
        <div style={{ paddingTop: 40 }}>
          <div style={{ marginBottom: 32 }}>
            <span className="badge" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>Portal HR</span>
            <h1 style={{ marginTop: 16, fontSize: 36 }}>Welcome back!</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1.6 }}>
              Sign in to manage your recruitment pipeline, track candidates, and schedule interviews.
            </p>
          </div>

          <div className="card" style={{ background: "var(--surface-muted)", border: "none" }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Demo Credentials</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                type="button"
                className="btn secondary"
                style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => fillCredentials("admin@portalhr.com", "admin123")}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Org Admin</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>admin@portalhr.com</div>
                </div>
                <span className="badge">Auto-fill</span>
              </button>

              <button
                type="button"
                className="btn secondary"
                style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => fillCredentials("recruiter@portalhr.com", "recruiter123")}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Recruiter</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>recruiter@portalhr.com</div>
                </div>
                <span className="badge">Auto-fill</span>
              </button>

              <button
                type="button"
                className="btn secondary"
                style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => fillCredentials("super@portalhr.com", "super123")}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>Super Admin</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>super@portalhr.com</div>
                </div>
                <span className="badge">Auto-fill</span>
              </button>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card"
          style={{ padding: 40, boxShadow: "var(--shadow-lg)" }}
        >
          <h2 style={{ marginTop: 0, fontSize: 24 }}>Sign in</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
            Enter your email and password to access your account.
          </p>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="field" style={{ marginTop: 16 }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Password</span>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button type="button" className="link-button">Forgot password?</button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay" />
                  <Dialog.Content className="dialog-content">
                    <Dialog.Title className="dialog-title">Reset your password</Dialog.Title>
                    <Dialog.Description className="dialog-description">
                      We will email a secure reset link to the address on your account.
                    </Dialog.Description>
                    <div className="dialog-actions">
                      <Dialog.Close asChild>
                        <button type="button" className="btn secondary">Close</button>
                      </Dialog.Close>
                      <button type="button" className="btn">Send reset link</button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <div style={{
              color: "var(--danger)",
              background: "var(--danger-light)",
              padding: "10px",
              borderRadius: "var(--radius)",
              marginTop: 16,
              fontSize: 13
            }}>
              {error}
            </div>
          ) : null}

          <div className="form-actions" style={{ marginTop: 24 }}>
            <button className="btn" style={{ width: "100%", padding: 12 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
