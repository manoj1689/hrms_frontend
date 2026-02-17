const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hrms_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

const buildQuery = (params?: Record<string, string | undefined>) => {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, value]) => value && value.trim());
  if (!entries.length) return "";
  const query = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`)
    .join("&");
  return `?${query}`;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  adminMetrics: () => request("/metrics/admin"),
  recruiterMetrics: () => request("/metrics/recruiter"),
  listCompanies: (params?: Record<string, string>) =>
    request<{ id: number; name: string }[]>(`/companies${buildQuery(params)}`),
  getCompany: (id: number) => request(`/companies/${id}`),
  createCompany: (payload: unknown) =>
    request("/companies", { method: "POST", body: JSON.stringify(payload) }),
  updateCompany: (id: number, payload: unknown) =>
    request(`/companies/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCompany: (id: number) => request(`/companies/${id}`, { method: "DELETE" }),
  listRequirements: (params?: Record<string, string>) =>
    request<{ id: number; title: string; company_id: number; status?: string; requirement_date?: string }[]>(`/requirements${buildQuery(params)}`),
  getRequirement: (id: number) => request(`/requirements/${id}`),
  createRequirement: (payload: unknown) =>
    request("/requirements", { method: "POST", body: JSON.stringify(payload) }),
  updateRequirement: (id: number, payload: unknown) =>
    request(`/requirements/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteRequirement: (id: number) => request(`/requirements/${id}`, { method: "DELETE" }),
  listRecruiters: (params?: Record<string, string>) =>
    request(`/recruiters${buildQuery(params)}`),
  getRecruiter: (id: number) => request(`/recruiters/${id}`),
  createRecruiter: (payload: unknown) =>
    request("/recruiters", { method: "POST", body: JSON.stringify(payload) }),
  updateRecruiter: (id: number, payload: unknown) =>
    request(`/recruiters/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteRecruiter: (id: number) => request(`/recruiters/${id}`, { method: "DELETE" }),
  listCandidates: (params?: Record<string, string>) =>
    request(`/candidates${buildQuery(params)}`),
  getCandidate: (id: number) => request(`/candidates/${id}`),
  createCandidate: (payload: unknown) =>
    request("/candidates", { method: "POST", body: JSON.stringify(payload) }),
  updateCandidate: (id: number, payload: unknown) =>
    request(`/candidates/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCandidate: (id: number) => request(`/candidates/${id}`, { method: "DELETE" }),
  uploadResumeAI: async (file: File) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/ai-tools/upload-resume`, {
      method: "POST",
      headers,
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return res.json();
  },
  getMatchedCandidates: (requirementId: number, params?: { skip?: number; limit?: number }) => {
    const query = buildQuery({
      skip: params?.skip?.toString(),
      limit: params?.limit?.toString()
    });
    return request(`/ai-tools/match/${requirementId}${query}`);
  },
  listInterviews: (status?: string) =>
    request(`/interviews${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  createInterview: (payload: unknown) =>
    request("/interviews", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hrms_token");
      window.location.href = "/login";
    }
  },
  getMe: () => request("/users/me"),
  updateMe: (payload: unknown) =>
    request("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
  changePassword: (payload: unknown) =>
    request("/users/me/password", { method: "PUT", body: JSON.stringify(payload) }),

  // Bulk upload
  bulkUploadResumes: async (files: File[]) => {
    const token = getToken();
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/ai-tools/bulk-upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json();
  },
  listBulkJobs: () => request<{ id: number; status: string; total_files: number; processed: number; failed_count: number; total_cost_usd: string; created_at: string }[]>("/ai-tools/bulk-upload"),
  getBulkJobStatus: (jobId: number) => request<{
    id: number; status: string; total_files: number; processed: number;
    failed_count: number; file_names: string[]; results: any[];
    total_cost_usd: string; created_at: string;
  }>(`/ai-tools/bulk-upload/${jobId}`),
  pauseBulkJob: (jobId: number) =>
    request(`/ai-tools/bulk-upload/${jobId}/pause`, { method: "PATCH" }),
  resumeBulkJob: (jobId: number) =>
    request(`/ai-tools/bulk-upload/${jobId}/resume`, { method: "PATCH" }),
};
