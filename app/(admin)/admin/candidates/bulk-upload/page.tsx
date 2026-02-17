"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api } from "../../../../lib/api";

type JobStatus = {
  id: number;
  status: string;
  total_files: number;
  processed: number;
  failed_count: number;
  file_names: string[];
  results: {
    file_name: string;
    status: string;
    candidate_name?: string;
    email?: string;
    error?: string;
    warnings?: string[];
    is_new?: boolean;
    token_usage?: { total_cost_usd: number };
  }[];
  total_cost_usd: string;
  created_at: string;
};

function Spinner({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `2.5px solid #e5e7eb`,
        borderTopColor: "var(--primary, #10b981)",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
        verticalAlign: "middle",
      }}
    />
  );
}

export default function BulkUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<number | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore job_id from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bulk_upload_job_id");
    if (saved) setJobId(Number(saved));
  }, []);

  // Poll for job status
  useEffect(() => {
    if (!jobId) return;

    const poll = () => {
      api
        .getBulkJobStatus(jobId)
        .then((data) => {
          setJob(data);
          if (data.status === "completed" || data.status === "failed") {
            if (pollRef.current) clearInterval(pollRef.current);
            localStorage.removeItem("bulk_upload_job_id");
          }
        })
        .catch(() => {
          setJobId(null);
          localStorage.removeItem("bulk_upload_job_id");
          if (pollRef.current) clearInterval(pollRef.current);
        });
    };

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter((f) =>
      f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const res = await api.bulkUploadResumes(files);
      setJobId(res.job_id);
      localStorage.setItem("bulk_upload_job_id", String(res.job_id));
      setFiles([]);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePause = async () => {
    if (!jobId) return;
    try {
      await api.pauseBulkJob(jobId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleResume = async () => {
    if (!jobId) return;
    try {
      await api.resumeBulkJob(jobId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const startNew = () => {
    setJobId(null);
    setJob(null);
    setFiles([]);
    setError(null);
    localStorage.removeItem("bulk_upload_job_id");
  };

  const progressPct = job ? Math.round((job.processed / job.total_files) * 100) : 0;

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            <Link href="/admin/candidates" style={{ color: "var(--muted)" }}>
              Candidates
            </Link>{" "}
            / Bulk Upload
          </div>
          <h2 style={{ margin: 0 }}>Bulk Resume Upload</h2>
        </div>
        {job && (job.status === "completed" || job.status === "failed") && (
          <button className="btn" onClick={startNew}>
            New Bulk Upload
          </button>
        )}
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button className="btn secondary" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Zone — show when no active job */}
        {!jobId && (
          <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? "var(--primary)" : "#d1d5db"}`,
                borderRadius: 16,
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: isDragging ? "var(--primary-light, #f0fdf4)" : "#fafafa",
                transition: "all 0.2s",
                marginBottom: 20,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <div style={{ fontSize: 40, marginBottom: 8 }}>+</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                Drop PDF resumes here or click to browse
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Supports multiple PDF files
              </div>
            </div>

            {files.length > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {files.length} file{files.length > 1 ? "s" : ""} selected
                  </span>
                  <button
                    className="btn"
                    onClick={startUpload}
                    disabled={uploading}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {uploading && <Spinner size={16} />}
                    {uploading ? "Uploading..." : "Start Processing"}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {files.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 12px",
                        background: "#f9fafb",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      <span>{f.name}</span>
                      <button
                        onClick={() => removeFile(i)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Job Progress */}
        {job && (
          <div>
            {/* Progress bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {job.processed} / {job.total_files} processed
                {job.failed_count > 0 && (
                  <span style={{ color: "var(--danger)", marginLeft: 8 }}>
                    ({job.failed_count} failed)
                  </span>
                )}
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {job.status === "processing" && <Spinner size={16} />}
                <span className="badge">{job.status.toUpperCase()}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  Cost: ${job.total_cost_usd}
                </span>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: 10,
                background: "#e5e7eb",
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  background:
                    job.status === "failed"
                      ? "var(--danger)"
                      : job.status === "paused"
                        ? "#f59e0b"
                        : "var(--primary)",
                  transition: "width 0.3s ease",
                  borderRadius: 6,
                }}
              />
            </div>

            {/* Pause / Resume buttons */}
            {job.status === "processing" && (
              <button
                className="btn secondary"
                onClick={handlePause}
                style={{ marginBottom: 16 }}
              >
                Pause
              </button>
            )}
            {job.status === "paused" && (
              <button
                className="btn"
                onClick={handleResume}
                style={{ marginBottom: 16 }}
              >
                Resume
              </button>
            )}

            {/* Results table */}
            {job.results && job.results.length > 0 && (
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File</th>
                    <th>Status</th>
                    <th>Candidate</th>
                    <th>Email</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {job.results.map((r, i) => (
                    <React.Fragment key={i}>
                      <tr>
                        <td>{i + 1}</td>
                        <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.file_name}
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              background:
                                r.status === "success"
                                  ? r.is_new === false
                                    ? "#fef3c7"
                                    : "var(--primary-light, #d1fae5)"
                                  : "var(--danger-light, #fee2e2)",
                              color:
                                r.status === "success"
                                  ? r.is_new === false
                                    ? "#92400e"
                                    : "var(--primary)"
                                  : "var(--danger)",
                            }}
                          >
                            {r.status === "success" && r.is_new === false
                              ? "DUPLICATE"
                              : r.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{r.candidate_name || "-"}</td>
                        <td>{r.email || "-"}</td>
                        <td>
                          {r.token_usage
                            ? `$${r.token_usage.total_cost_usd}`
                            : "-"}
                        </td>
                      </tr>
                      {/* Error row */}
                      {r.error && (
                        <tr key={`${i}-err`}>
                          <td colSpan={6} style={{ padding: "4px 12px", background: "#fee2e2", color: "var(--danger)", fontSize: 12, borderTop: "none" }}>
                            Error: {r.error}
                          </td>
                        </tr>
                      )}
                      {/* Warnings row */}
                      {r.warnings && r.warnings.length > 0 && (
                        <tr key={`${i}-warn`}>
                          <td colSpan={6} style={{ padding: "4px 12px", background: "#fef3c7", color: "#92400e", fontSize: 12, borderTop: "none" }}>
                            {r.warnings.join(" | ")}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pending files */}
            {job.processed < job.total_files && job.file_names && (
              <div style={{ marginTop: 16, color: "var(--muted)", fontSize: 13 }}>
                <strong>Pending:</strong>{" "}
                {job.file_names
                  .slice(job.processed)
                  .join(", ")}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
