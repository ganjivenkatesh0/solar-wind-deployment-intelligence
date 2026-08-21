const configuredApiBaseUrl = import.meta.env["VITE_API_BASE_URL"]?.replace(/\/$/, "");
const browserUsesRemoteOrigin =
  typeof window !== "undefined" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredUrlIsLocalhost = Boolean(
  configuredApiBaseUrl &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredApiBaseUrl),
);
const API_BASE_URL =
  configuredApiBaseUrl && !(browserUsesRemoteOrigin && configuredUrlIsLocalhost)
    ? configuredApiBaseUrl
    : "/api";

const API_TIMEOUT_MS = 120_000;

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

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      signal: options.signal ?? controller.signal,
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
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The analysis service took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiDownload(path: string): Promise<Blob> {
  const { blob } = await apiDownloadFile(path);
  return blob;
}

export async function apiDownloadFile(
  path: string,
  fallbackFilename = "download",
): Promise<{ blob: Blob; filename: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      credentials: "include",
      headers: { "X-Client-ID": getClientId() },
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = await response.json();
        if (typeof body?.detail === "string") message = body.detail;
      } catch {
        // Keep the default error message.
      }
      throw new Error(message);
    }

    const disposition = response.headers.get("Content-Disposition");
    const encodedFilename = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const filename =
      (encodedFilename
        ? decodeURIComponent(encodedFilename)
        : disposition?.match(/filename="?([^";]+)"?/i)?.[1]) || fallbackFilename;

    return { blob: await response.blob(), filename };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The report download took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function saveBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
