"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "../../../lib/api";

type Interview = {
  id: number;
  candidate_id: number;
  requirement_id?: number;
  scheduled_at?: string;
  mode?: string;
};

function RecruiterInterviewsPageContent() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filter, setFilter] = useState("all");
  const [candidates, setCandidates] = useState<{ id: number; name: string }[]>([]);
  const [requirements, setRequirements] = useState<{ id: number; title: string }[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMode, setSelectedMode] = useState("Telephonic");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = filter === "all" ? undefined : filter;
    api.listInterviews(status).then(setInterviews).catch(() => setInterviews([]));
  }, [filter]);

  useEffect(() => {
    api.listCandidates()
      .then((items) => {
        setCandidates(
          items.map((c: { id: number; first_name?: string; last_name?: string; email?: string }) => ({
            id: c.id,
            name: `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || c.email || `Candidate ${c.id}`
          }))
        );
      })
      .catch(() => setCandidates([]));
    api.listRequirements()
      .then((items) => {
        setRequirements(
          items.map((r: { id: number; title?: string }) => ({
            id: r.id,
            title: r.title ?? `Requirement ${r.id}`
          }))
        );
      })
      .catch(() => setRequirements([]));
  }, []);

  useEffect(() => {
    const candidateId = searchParams.get("candidate_id");
    if (candidateId) setSelectedCandidate(candidateId);
  }, [searchParams]);

  const candidateMap = useMemo(() => {
    const map: Record<number, string> = {};
    candidates.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [candidates]);

  const requirementMap = useMemo(() => {
    const map: Record<number, string> = {};
    requirements.forEach((r) => {
      map[r.id] = r.title;
    });
    return map;
  }, [requirements]);

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  async function handleSchedule() {
    if (!selectedCandidate || !selectedRequirement || !selectedDate || !selectedTime || !selectedMode) {
      setError("Please select candidate, requirement, date, time, and mode.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createInterview({
        tenant_id: 1,
        candidate_id: Number(selectedCandidate),
        requirement_id: Number(selectedRequirement),
        scheduled_at: `${selectedDate} ${selectedTime}`,
        mode: selectedMode,
        status: "scheduled"
      });
      const status = filter === "all" ? undefined : filter;
      api.listInterviews(status).then(setInterviews).catch(() => setInterviews([]));
      setSelectedTime("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule interview");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Interviews</h2>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <strong>Schedule an Interview</strong>
            <div className="helper">Align candidates with requirements and pick a time slot.</div>
          </div>
          <button className="btn" onClick={handleSchedule} disabled={saving}>
            {saving ? "Scheduling..." : "Schedule Interview"}
          </button>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Candidate</label>
            <select
              value={selectedCandidate}
              onChange={(e) => {
                setSelectedCandidate(e.target.value);
                setError(null);
              }}
            >
              <option value="">Select candidate</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Requirement</label>
            <select
              value={selectedRequirement}
              onChange={(e) => {
                setSelectedRequirement(e.target.value);
                setError(null);
              }}
            >
              <option value="">Select requirement</option>
              {requirements.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                setError(null);
              }}
            >
              <option>Telephonic</option>
              <option>Online</option>
              <option>Face to Face</option>
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="field">
            <label>Time</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={selectedTime === time ? "btn" : "btn secondary"}
                  onClick={() => {
                    setSelectedTime(time);
                    setError(null);
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
        {error ? <div className="helper" style={{ marginTop: 10, color: "var(--danger)" }}>{error}</div> : null}
        <div className="helper" style={{ marginTop: 10 }}>Status: Scheduled</div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <strong>Upcoming Interviews</strong>
            <div className="helper">Keep an eye on scheduled sessions and updates.</div>
          </div>
          <div>
            <select className="table-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        {interviews.length === 0 ? (
          <div className="helper">No interviews scheduled yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Requirement</th>
                <th>Scheduled At</th>
                <th>Mode</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={i.id}>
                  <td>{candidateMap[i.candidate_id] ?? i.candidate_id}</td>
                  <td>{i.requirement_id ? (requirementMap[i.requirement_id] ?? i.requirement_id) : "-"}</td>
                  <td>{i.scheduled_at ?? "-"}</td>
                  <td>{i.mode ?? "-"}</td>
                  <td><button className="btn secondary">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function RecruiterInterviewsPage() {
  return (
    <Suspense fallback={<div className="section">Loading interviews...</div>}>
      <RecruiterInterviewsPageContent />
    </Suspense>
  );
}
