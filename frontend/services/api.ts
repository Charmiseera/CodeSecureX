import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // 60s — LLM calls can be slow
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Language = "python" | "javascript" | "java" | "php";
export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface Vulnerability {
  type: string;
  severity: Severity;
  explanation: string;
  fix: string;
}

export interface ScanResponse {
  scan_id: string;         // MongoDB ObjectId
  vulnerabilities: Vulnerability[];
}

export interface ScanHistoryItem {
  scan_id: string;         // MongoDB ObjectId
  language: string;
  vulnerability_count: number;
  created_at: string;
}

export interface ReportResponse {
  report_id: string;       // MongoDB ObjectId
  scan_id: string;         // MongoDB ObjectId
  pdf_url: string;
  message?: string;
}

export interface AdminAnalytics {
  total_scans: number;
  total_users: number;
  active_users: number;
  top_vulnerabilities: { type: string; count: number }[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

export const scanCode = (code: string, language: Language) =>
  api.post<ScanResponse>("/scan/analyze", { code, language }).then((r) => r.data);

export const getScanHistory = (limit = 50) =>
  api.get<ScanHistoryItem[]>("/history", { params: { limit } }).then((r) => r.data);

export const generateReport = (scan_id: string) =>
  api.post<ReportResponse>("/report/generate", { scan_id }).then((r) => r.data);

export const downloadReportUrl = (report_id: string) =>
  `http://localhost:8000/api/report/${report_id}`;

export const fetchAnalytics = () =>
  api.get<AdminAnalytics>("/admin/analytics").then((r) => r.data);

export const fetchUsers = () =>
  api.get<{ id: string; email: string; is_active: boolean; created_at: string }[]>("/admin/users").then((r) => r.data);

export const suspendUser = (user_id: string) =>
  api.post("/admin/suspend", { user_id }).then((r) => r.data);

export default api;
