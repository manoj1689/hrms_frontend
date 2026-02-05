"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../../lib/api";
import Link from "next/link";

type MatchedCandidate = {
  resume_id?: string;
  candidate_id: string;
  filename: string;
  name: string;
  email: string;
  overall_score: number;
  category?: string;
  semantic_similarity?: number;
  breakdown?: {
    skills?: {
      score: number;
      max: number;
      weight: string;
    };
    experience?: {
      score: number;
      max: number;
      weight: string;
    };
    location?: {
      score: number;
      max: number;
      weight: string;
    };
    semantic_similarity?: {
      score: number;
      max: number;
      weight: string;
    };
  };
};

type MatchResponse = {
  results: MatchedCandidate[];
  summary: {
    total_matches: number;
    unique_candidates: number;
    score_threshold: number;
  };
  pagination: {
    skip: number;
    limit: number;
    total: number;
  };
};

export default function MatchedCandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const requirementId = Number(params.id);

  const [matches, setMatches] = useState<MatchedCandidate[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [pagination, setPagination] = useState({ skip: 0, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requirementId) return;

    setLoading(true);
    setError(null);

    api
      .getMatchedCandidates(requirementId, { skip: pagination.skip, limit: pagination.limit })
      .then((response: any) => {
        const data = response as MatchResponse;
        setMatches(data.results || []);
        setSummary(data.summary);
        setPagination(data.pagination);
      })
      .catch((err) => {
        setError(err.message || "Failed to load matched candidates");
        setMatches([]);
      })
      .finally(() => setLoading(false));
  }, [requirementId, pagination.skip, pagination.limit]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "#10b981"; // green
    if (score >= 50) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const formatScore = (score: number) => {
    return `${score.toFixed(1)}%`;
  };

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            <Link href="/admin/requirements">Requirements</Link> / Matched Candidates
          </div>
          <h2 style={{ margin: 0 }}>Matched Candidates</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            AI-powered candidate matching for requirement #{requirementId}
          </div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="section">
        {loading && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            Loading matched candidates...
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid var(--danger)",
              background: "var(--danger-light)",
              color: "var(--danger)",
              marginBottom: 16
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && summary && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
              padding: 16,
              background: "var(--bg-secondary)",
              borderRadius: 12
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                Total Matches
              </div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.total_matches || 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                Unique Candidates
              </div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{summary.unique_candidates || 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                Score Threshold
              </div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>
                {summary.score_threshold ? formatScore(summary.score_threshold) : "N/A"}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
            No matched candidates found for this requirement.
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <>
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Match Score</th>
                    <th>Skills</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Semantic</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((candidate, index) => (
                    <tr key={`${candidate.candidate_id}-${index}`}>
                      <td>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: index < 3 ? getScoreColor(candidate.overall_score) : "var(--border)",
                            color: index < 3 ? "white" : "var(--text)",
                            fontWeight: 600,
                            fontSize: 14
                          }}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{candidate.name || "-"}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          ID: {candidate.candidate_id}
                        </div>
                      </td>
                      <td>{candidate.email || "-"}</td>
                      <td>
                        <div
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: getScoreColor(candidate.overall_score) + "20",
                            color: getScoreColor(candidate.overall_score),
                            fontWeight: 600,
                            fontSize: 14
                          }}
                        >
                          {formatScore(candidate.overall_score)}
                        </div>
                      </td>
                      <td>
                        {candidate.breakdown?.skills?.score !== undefined ? (
                          <span style={{ fontSize: 14, color: "var(--muted)" }}>
                            {formatScore(candidate.breakdown.skills.score)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {candidate.breakdown?.experience?.score !== undefined ? (
                          <span style={{ fontSize: 14, color: "var(--muted)" }}>
                            {formatScore(candidate.breakdown.experience.score)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {candidate.breakdown?.location?.score !== undefined ? (
                          <span style={{ fontSize: 14, color: "var(--muted)" }}>
                            {formatScore(candidate.breakdown.location.score)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {candidate.breakdown?.semantic_similarity?.score !== undefined ? (
                          <span style={{ fontSize: 14, color: "var(--muted)" }}>
                            {formatScore(candidate.breakdown.semantic_similarity.score)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/admin/candidates/${candidate.candidate_id}`}
                          className="btn secondary"
                          style={{ fontSize: 12, padding: "6px 12px", whiteSpace: "nowrap" }}
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.total > pagination.limit && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  padding: 16,
                  background: "var(--bg-secondary)",
                  borderRadius: 12
                }}
              >
                <div style={{ fontSize: 14, color: "var(--muted)" }}>
                  Showing {pagination.skip + 1} to {Math.min(pagination.skip + pagination.limit, pagination.total)} of{" "}
                  {pagination.total} results
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn secondary"
                    disabled={pagination.skip === 0}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }))
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="btn secondary"
                    disabled={pagination.skip + pagination.limit >= pagination.total}
                    onClick={() => setPagination((prev) => ({ ...prev, skip: prev.skip + prev.limit }))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
