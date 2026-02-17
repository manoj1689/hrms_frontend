"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { api } from "../../../../../lib/api";

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

type CandidateForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  alt_phone: string;
  recruiter_id: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  gender: string;
  marital_status: string;
  interested_position: string;
  current_location: string;
  permanent_location: string;
  languages: string;
  qualification: string;
  specialization: string;
  branch: string;
  college: string;
  university: string;
  year_passed: string;
  current_employer: string;
  current_designation: string;
  employment_type: string;
  total_exp_years: string;
  total_exp_months: string;
  current_ctc: string;
  expected_ctc: string;
  notice_period: string;
  skills: string;
  certifications: string;
  resume_url: string;
  disabilities: string;
};

const emptyForm: CandidateForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  alt_phone: "",
  recruiter_id: "",
  dob_day: "",
  dob_month: "",
  dob_year: "",
  gender: "",
  marital_status: "",
  interested_position: "",
  current_location: "",
  permanent_location: "",
  languages: "",
  qualification: "",
  specialization: "",
  branch: "",
  college: "",
  university: "",
  year_passed: "",
  current_employer: "",
  current_designation: "",
  employment_type: "",
  total_exp_years: "",
  total_exp_months: "",
  current_ctc: "",
  expected_ctc: "",
  notice_period: "",
  skills: "",
  certifications: "",
  resume_url: "",
  disabilities: "No"
};

export default function RecruiterEditCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<CandidateForm>(emptyForm);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof CandidateForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  const dobDate =
    form.dob_year && form.dob_month && form.dob_day
      ? new Date(Number(form.dob_year), Number(form.dob_month) - 1, Number(form.dob_day))
      : null;

  const dobDisplay =
    dobDate
      ? `${form.dob_day.padStart(2, "0")}/${form.dob_month.padStart(2, "0")}/${form.dob_year}`
      : "";

  function handleDobChange(value: any) {
    const date = value as Date;
    update("dob_day", String(date.getDate()));
    update("dob_month", String(date.getMonth() + 1));
    update("dob_year", String(date.getFullYear()));
    setShowCalendar(false);
  }

  function splitList(value: string) {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  useEffect(() => {
    const id = Number(params.id);
    if (!id) return;
    setLoading(true);
    Promise.all([api.getCandidate(id), api.listRecruiters()])
      .then(([candidate, recs]) => {
        setRecruiters(recs);
        setForm({
          first_name: candidate.first_name ?? "",
          last_name: candidate.last_name ?? "",
          email: candidate.email ?? "",
          phone: candidate.phone ?? "",
          alt_phone: candidate.alt_phone ?? "",
          recruiter_id: candidate.recruiter_id?.toString() ?? "",
          dob_day: candidate.dob_day ?? "",
          dob_month: candidate.dob_month ?? "",
          dob_year: candidate.dob_year ?? "",
          gender: candidate.gender ?? "",
          marital_status: candidate.marital_status ?? "",
          interested_position: candidate.interested_position ?? "",
          current_location: candidate.current_location ?? "",
          permanent_location: candidate.permanent_location ?? "",
          languages: candidate.languages?.join(", ") ?? "",
          qualification: candidate.qualification ?? "",
          specialization: candidate.specialization ?? "",
          branch: candidate.branch ?? "",
          college: candidate.college ?? "",
          university: candidate.university ?? "",
          year_passed: candidate.year_passed ?? "",
          current_employer: candidate.current_employer ?? "",
          current_designation: candidate.current_designation ?? "",
          employment_type: candidate.employment_type ?? "",
          total_exp_years: candidate.total_exp_years?.toString() ?? "",
          total_exp_months: candidate.total_exp_months?.toString() ?? "",
          current_ctc: candidate.current_ctc ?? "",
          expected_ctc: candidate.expected_ctc ?? "",
          notice_period: candidate.notice_period ?? "",
          skills: candidate.skills?.join(", ") ?? "",
          certifications: candidate.certifications?.join(", ") ?? "",
          resume_url: candidate.resume_url ?? "",
          disabilities: candidate.disabilities ?? "No"
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load candidate"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = Number(params.id);
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await api.updateCandidate(id, {
        recruiter_id: form.recruiter_id ? Number(form.recruiter_id) : null,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        alt_phone: form.alt_phone,
        dob_day: form.dob_day,
        dob_month: form.dob_month,
        dob_year: form.dob_year,
        gender: form.gender,
        marital_status: form.marital_status,
        interested_position: form.interested_position,
        current_location: form.current_location,
        permanent_location: form.permanent_location,
        languages: form.languages ? splitList(form.languages) : [],
        qualification: form.qualification,
        specialization: form.specialization,
        branch: form.branch,
        college: form.college,
        university: form.university,
        year_passed: form.year_passed,
        current_employer: form.current_employer,
        current_designation: form.current_designation,
        employment_type: form.employment_type,
        total_exp_years: form.total_exp_years ? Number(form.total_exp_years) : null,
        total_exp_months: form.total_exp_months ? Number(form.total_exp_months) : null,
        current_ctc: form.current_ctc,
        expected_ctc: form.expected_ctc,
        notice_period: form.notice_period,
        skills: form.skills ? splitList(form.skills) : [],
        certifications: form.certifications ? splitList(form.certifications) : [],
        resume_url: form.resume_url,
        disabilities: form.disabilities
      });
      router.push(`/recruiter/candidates/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update candidate");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Candidates</div>
          <h2 style={{ margin: 0 }}>Edit Candidate</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Update candidate profile details.</div>
        </div>
        <button className="btn secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <form className="section" onSubmit={handleSubmit}>
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading candidate...</div>
        ) : (
          <>
            <h4>Basic Details</h4>
            <div className="form-grid three">
              <div className="field">
                <label>First Name</label>
                <input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
              </div>
              <div className="field">
                <label>Email</label>
                <input value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="field">
                <label>Alt Phone</label>
                <input value={form.alt_phone} onChange={(e) => update("alt_phone", e.target.value)} />
              </div>
              <div className="field">
                <label>Recruiter</label>
                <select value={form.recruiter_id} onChange={(e) => update("recruiter_id", e.target.value)}>
                  <option value="">Select recruiter</option>
                  {recruiters.map((recruiter) => {
                    const name = [recruiter.first_name, recruiter.last_name].filter(Boolean).join(" ").trim();
                    const label = name || recruiter.email || `Recruiter ${recruiter.id}`;
                    return (
                      <option key={recruiter.id} value={recruiter.id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="field" ref={calendarRef} style={{ position: "relative" }}>
                <label>Date of Birth</label>
                <input
                  value={dobDisplay}
                  readOnly
                  onClick={() => setShowCalendar((v) => !v)}
                  placeholder="Select date"
                  style={{ cursor: "pointer" }}
                />
                {showCalendar && (
                  <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 100, marginTop: 4 }}>
                    <Calendar
                      onChange={handleDobChange}
                      value={dobDate}
                      maxDate={new Date()}
                      defaultView="decade"
                    />
                  </div>
                )}
              </div>
              <div className="field">
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label>Marital Status</label>
                <select value={form.marital_status} onChange={(e) => update("marital_status", e.target.value)}>
                  <option value="">Select marital status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Position & Locations</h4>
            <div className="form-grid three">
              <div className="field">
                <label>Interested Position</label>
                <input value={form.interested_position} onChange={(e) => update("interested_position", e.target.value)} />
              </div>
              <div className="field">
                <label>Current Location</label>
                <input value={form.current_location} onChange={(e) => update("current_location", e.target.value)} />
              </div>
              <div className="field">
                <label>Permanent Location</label>
                <input value={form.permanent_location} onChange={(e) => update("permanent_location", e.target.value)} />
              </div>
              <div className="field full">
                <label>Languages (one per line)</label>
                <input value={form.languages} onChange={(e) => update("languages", e.target.value)} placeholder="Type and press Enter" />
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Education</h4>
            <div className="form-grid three">
              <div className="field">
                <label>Qualification</label>
                <input value={form.qualification} onChange={(e) => update("qualification", e.target.value)} />
              </div>
              <div className="field">
                <label>Specialization</label>
                <input value={form.specialization} onChange={(e) => update("specialization", e.target.value)} />
              </div>
              <div className="field">
                <label>Branch</label>
                <input value={form.branch} onChange={(e) => update("branch", e.target.value)} />
              </div>
              <div className="field">
                <label>College</label>
                <input value={form.college} onChange={(e) => update("college", e.target.value)} />
              </div>
              <div className="field">
                <label>University</label>
                <input value={form.university} onChange={(e) => update("university", e.target.value)} />
              </div>
              <div className="field">
                <label>Year Passed</label>
                <input value={form.year_passed} onChange={(e) => update("year_passed", e.target.value)} />
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Employment</h4>
            <div className="form-grid three">
              <div className="field">
                <label>Current Employer</label>
                <input value={form.current_employer} onChange={(e) => update("current_employer", e.target.value)} />
              </div>
              <div className="field">
                <label>Current Designation</label>
                <input value={form.current_designation} onChange={(e) => update("current_designation", e.target.value)} />
              </div>
              <div className="field">
                <label>Employment Type</label>
                <select value={form.employment_type} onChange={(e) => update("employment_type", e.target.value)}>
                  <option value="">Select employment type</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                </select>
              </div>
              <div className="field">
                <label>Total Exp (Years)</label>
                <input value={form.total_exp_years} onChange={(e) => update("total_exp_years", e.target.value)} />
              </div>
              <div className="field">
                <label>Total Exp (Months)</label>
                <input value={form.total_exp_months} onChange={(e) => update("total_exp_months", e.target.value)} />
              </div>
              <div className="field">
                <label>Current CTC</label>
                <input value={form.current_ctc} onChange={(e) => update("current_ctc", e.target.value)} />
              </div>
              <div className="field">
                <label>Expected CTC</label>
                <input value={form.expected_ctc} onChange={(e) => update("expected_ctc", e.target.value)} />
              </div>
              <div className="field full">
                <label>Notice Period</label>
                <input value={form.notice_period} onChange={(e) => update("notice_period", e.target.value)} />
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Skills & Certifications</h4>
            <div className="form-grid">
              <div className="field full">
                <label>Skills (one per line)</label>
                <input value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Type and press Enter" />
              </div>
              <div className="field full">
                <label>Certifications (one per line)</label>
                <input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="Type and press Enter" />
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Resume</h4>
            <div className="form-grid">
              <div className="field">
                <label>Resume Link (optional)</label>
                <input value={form.resume_url} onChange={(e) => update("resume_url", e.target.value)} />
              </div>
              <div className="field">
                <label>Upload Resume (PDF)</label>
                <input type="file" />
              </div>
            </div>

            <h4 style={{ marginTop: 24 }}>Disabilities</h4>
            <div className="form-grid">
              <div className="field">
                <label>Disabilities?</label>
                <select value={form.disabilities} onChange={(e) => update("disabilities", e.target.value)}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            {error ? <div className="field" style={{ color: "var(--danger)" }}>{error}</div> : null}
            <div className="form-actions">
              <button className="btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn secondary" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
