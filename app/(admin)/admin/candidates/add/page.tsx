"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../../../lib/api";

type Recruiter = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export default function AddCandidatePage() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine redirect path based on current route (admin vs recruiter)
  const isAdmin = pathname?.startsWith("/admin");
  const candidatesListPath = isAdmin ? "/admin/candidates" : "/recruiter/candidates";

  const [form, setForm] = useState({
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
  });
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    api.listRecruiters().then(setRecruiters).catch(() => setRecruiters([]));
  }, []);

  function splitList(value: string) {
    return value
      .split(/[,\\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleAIUpload() {
    if (!selectedFile) {
      setUploadError("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await api.uploadResumeAI(selectedFile);

      if (response.status === "success") {
        // Redirect to candidates list on success (admin or recruiter based on current path)
        router.push(candidatesListPath);
      } else {
        setUploadError(response.message || "Upload failed");
      }
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setUploadError("Only PDF files are supported");
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.createCandidate({
      tenant_id: 1,
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
    // Redirect to candidates list (admin or recruiter based on current path)
    router.push(candidatesListPath);
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-title">
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Home</div>
          <h2 style={{ margin: 0 }}>Add Candidate</h2>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Complete candidate profile and upload resume (PDF).</div>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => setShowAIDialog(true)}
          style={{
            marginLeft: "auto",
            background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(13, 148, 136, 0.4)",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(13, 148, 136, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.4)";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 23L9.41 13.59L1 11L9.41 8.41L12 0Z" opacity="0.9" />
            <path d="M19 3L20.5 7.5L25 9L20.5 10.5L19 15L17.5 10.5L13 9L17.5 7.5L19 3Z" opacity="0.7" />
            <path d="M5 13L6 16L9 17L6 18L5 21L4 18L1 17L4 16L5 13Z" opacity="0.7" />
          </svg>
          Create by AI
        </button>
      </div>

      <form className="section" onSubmit={handleSubmit}>
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
          <div className="field">
            <label>DOB Date</label>
            <input value={form.dob_day} onChange={(e) => update("dob_day", e.target.value)} placeholder="DD" />
          </div>
          <div className="field">
            <label>DOB Month</label>
            <input value={form.dob_month} onChange={(e) => update("dob_month", e.target.value)} placeholder="MM" />
          </div>
          <div className="field">
            <label>DOB Year</label>
            <input value={form.dob_year} onChange={(e) => update("dob_year", e.target.value)} placeholder="YYYY" />
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

        <div className="form-actions">
          <button className="btn">Add Candidate</button>
        </div>
      </form>

      {/* AI Upload Dialog */}
      {showAIDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => !isUploading && setShowAIDialog(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Create Candidate with AI</h3>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
              Upload a resume PDF and AI will automatically extract all candidate information
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500
                }}
              >
                Select Resume (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid var(--border)",
                  borderRadius: "4px"
                }}
              />
              {selectedFile && (
                <div style={{ marginTop: "8px", fontSize: "14px", color: "var(--muted)" }}>
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>

            {uploadError && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fee",
                  color: "#c00",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  fontSize: "14px"
                }}
              >
                {uploadError}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn"
                onClick={() => setShowAIDialog(false)}
                disabled={isUploading}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text)",
                  border: "1px solid var(--border)"
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleAIUpload}
                disabled={isUploading || !selectedFile}
                style={{
                  opacity: isUploading || !selectedFile ? 0.6 : 1
                }}
              >
                {isUploading ? "Uploading..." : "Upload & Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
