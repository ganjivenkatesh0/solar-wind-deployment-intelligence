const API_BASE_URL =
  import.meta.env["VITE_API_BASE_URL"]?.replace(/\/$/, "") ||
  "http://localhost:8000";

const CLIENT_ID_STORAGE_KEY = "solar-wind-client-id";

function getClientId(): string {
  if (typeof window === "undefined") {
    return "anonymous";
  }

  const existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, generated);

  return generated;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Client-ID": getClientId(),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await response.json();

      if (typeof body?.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body?.detail)) {
        message = body.detail
          .map((item: { msg?: string }) => item?.msg)
          .filter(Boolean)
          .join(", ");
      } else if (typeof body?.message === "string") {
        message = body.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
