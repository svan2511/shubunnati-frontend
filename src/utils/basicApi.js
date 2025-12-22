let isLoggingOut = false;

export async function apiFetch(url, options = {}) {
  // 🚫 Block all requests once logout starts
  if (isLoggingOut) {
    return Promise.reject(new Error("Logout in progress"));
  }

  const token = sessionStorage.getItem("auth_token");
  const tokenVersion = sessionStorage.getItem("token_version");

  const config = {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tokenVersion ? { "X-Token-Version": tokenVersion } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: "manual",
  };

  const res = await fetch(url, config);

  // 🔐 AUTH-LEVEL FAILURE (HANDLE ONCE)
  if (res.status === 401 && !isLoggingOut) {
    isLoggingOut = true;

    console.log("Global 401 detected. Logging out…");

    sessionStorage.setItem(
      "auth_error_message",
      "Your session has expired. Please login again."
    );

    // 🔥 Clear everything exactly once
    sessionStorage.clear();

    // 🔥 Hard redirect (kills pending JS)
    window.location.href = "/login?reason=session_expired";

    throw new Error("Unauthorized");
  }

  // 🚫 Forbidden (no logout)
  if (res.status === 403) {
    throw new Error("Forbidden");
  }

  // ✅ No content
  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}
