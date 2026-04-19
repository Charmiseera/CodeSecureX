const DEFAULT_API_URL = "https://codesecurex.onrender.com/api";

export function getApiUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;
  const baseUrl = rawUrl.replace(/\/+$/, "");

  return baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
}
