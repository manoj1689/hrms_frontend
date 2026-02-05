"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../../lib/api";

type Candidate = {
  id: number;
  recruiter_id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  alt_phone?: string | null;
  dob_day?: string | null;
  dob_month?: string | null;
  dob_year?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  interested_position?: string | null;
  current_location?: string | null;
  permanent_location?: string | null;
  languages?: string[] | null;
  qualification?: string | null;
  specialization?: string | null;
  branch?: string | null;
  college?: string | null;
  university?: string | null;
  year_passed?: string | null;
  current_employer?: string | null;
  current_designation?: string | null;
  employment_type?: string | null;
  total_exp_years?: number | null;
  total_exp_months?: number | null;
  current_ctc?: string | null;
  expected_ctc?: string | null;
  notice_period?: string | null;
  skills?: string[] | null;
  certifications?: string[] | null;
  resume_url?: string | null;
  disabilities?: string | null;
};

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

function recruiterLabel(recruiter?: Recruiter | null) {
  if (!recruiter) return "-";
  const name = [recruiter.first_name, recruiter.last_name].filter(Boolean).join(" ").trim();
  return name || recruiter.email || `Recruiter ${recruiter.id}`;
}

export default function CandidateDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([api.getCandidate(id), api.listRecruiters()])
      .then(([cand, recs]) => {
        setCandidate(cand);
        setRecruiters(recs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load candidate"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const recruiterMap = useMemo(() => {
    const map: Record<number, Recruiter> = {};
    recruiters.forEach((r) => {
      map[r.id] = r;
    });
    return map;
  }, [recruiters]);

  const dob = candidate
    ? [candidate.dob_day, candidate.dob_month, candidate.dob_year].filter(Boolean).join("-")
    : "";

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Candidates</div>
          <h2 style={{ margin: 0 }}>Candidate Details</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Full candidate profile.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn secondary" onClick={() => router.back()}>
            Back
          </button>
          {candidate ? (
            <button className="btn" onClick={() => router.push(`/admin/candidates/${candidate.id}/edit`)}>
              Edit Candidate
            </button>
          ) : null}
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading candidate...</div>
        ) : error ? (
          <div style={{ color: "var(--danger)" }}>{error}</div>
        ) : candidate ? (
          <div className="form-grid">
            <div className="field">
              <label>Name</label>
              <div>{`${candidate.first_name ?? ""} ${candidate.last_name ?? ""}`.trim() || "-"}</div>
            </div>
            <div className="field">
              <label>Email</label>
              <div>{candidate.email ?? "-"}</div>
            </div>
            <div className="field">
              <label>Phone</label>
              <div>{candidate.phone ?? "-"}</div>
            </div>
            <div className="field">
              <label>Alt Phone</label>
              <div>{candidate.alt_phone ?? "-"}</div>
            </div>
            <div className="field">
              <label>Recruiter</label>
              <div>{recruiterLabel(candidate.recruiter_id ? recruiterMap[candidate.recruiter_id] : null)}</div>
            </div>
            <div className="field">
              <label>Interested Position</label>
              <div>{candidate.interested_position ?? "-"}</div>
            </div>
            <div className="field">
              <label>Current Location</label>
              <div>{candidate.current_location ?? "-"}</div>
            </div>
            <div className="field">
              <label>Permanent Location</label>
              <div>{candidate.permanent_location ?? "-"}</div>
            </div>
            <div className="field">
              <label>DOB</label>
              <div>{dob || "-"}</div>
            </div>
            <div className="field">
              <label>Gender</label>
              <div>{candidate.gender ?? "-"}</div>
            </div>
            <div className="field">
              <label>Marital Status</label>
              <div>{candidate.marital_status ?? "-"}</div>
            </div>
            <div className="field">
              <label>Qualification</label>
              <div>{candidate.qualification ?? "-"}</div>
            </div>
            <div className="field">
              <label>Specialization</label>
              <div>{candidate.specialization ?? "-"}</div>
            </div>
            <div className="field">
              <label>Branch</label>
              <div>{candidate.branch ?? "-"}</div>
            </div>
            <div className="field">
              <label>College</label>
              <div>{candidate.college ?? "-"}</div>
            </div>
            <div className="field">
              <label>University</label>
              <div>{candidate.university ?? "-"}</div>
            </div>
            <div className="field">
              <label>Year Passed</label>
              <div>{candidate.year_passed ?? "-"}</div>
            </div>
            <div className="field">
              <label>Employment Type</label>
              <div>{candidate.employment_type ?? "-"}</div>
            </div>
            <div className="field">
              <label>Current Employer</label>
              <div>{candidate.current_employer ?? "-"}</div>
            </div>
            <div className="field">
              <label>Current Designation</label>
              <div>{candidate.current_designation ?? "-"}</div>
            </div>
            <div className="field">
              <label>Total Experience</label>
              <div>
                {candidate.total_exp_years ?? "-"} yrs {candidate.total_exp_months ?? "-"} mos
              </div>
            </div>
            <div className="field">
              <label>Current CTC</label>
              <div>{candidate.current_ctc ?? "-"}</div>
            </div>
            <div className="field">
              <label>Expected CTC</label>
              <div>{candidate.expected_ctc ?? "-"}</div>
            </div>
            <div className="field">
              <label>Notice Period</label>
              <div>{candidate.notice_period ?? "-"}</div>
            </div>
            <div className="field">
              <label>Disabilities</label>
              <div>{candidate.disabilities ?? "-"}</div>
            </div>
            <div className="field full">
              <label>Languages</label>
              <div>{candidate.languages?.length ? candidate.languages.join(", ") : "-"}</div>
            </div>
            <div className="field full">
              <label>Skills</label>
              <div>{candidate.skills?.length ? candidate.skills.join(", ") : "-"}</div>
            </div>
            <div className="field full">
              <label>Certifications</label>
              <div>{candidate.certifications?.length ? candidate.certifications.join(", ") : "-"}</div>
            </div>
            <div className="field full">
              <label>Resume Link</label>
              <div>{candidate.resume_url ?? "-"}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Candidate not found.</div>
        )}
      </div>
    </div>
  );
}
