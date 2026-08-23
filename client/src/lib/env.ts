const configuredApiUrl = import.meta.env.VITE_API_URL || "/api/v1";
const apiUrlWithoutTrailingSlash = configuredApiUrl.replace(/\/+$/, "");

// Deployed environments have historically provided only the API host. Keep
// requests on the versioned FastAPI routes whether the URL is a host or path.
const apiUrl = apiUrlWithoutTrailingSlash.endsWith("/api/v1")
  ? apiUrlWithoutTrailingSlash
  : `${apiUrlWithoutTrailingSlash}/api/v1`;

export const env = {
  API_URL: apiUrl,
};
