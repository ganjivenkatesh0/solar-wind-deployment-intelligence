import { apiRequest } from "./client";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

export type AuthSession = {
  user: AuthUser;
  message: string;
};

export function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  organization?: string;
  phone?: string;
}): Promise<AuthSession> {
  return apiRequest<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }): Promise<AuthSession> {
  return apiRequest<AuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutUser(): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export function updateCurrentUser(payload: {
  name?: string;
  organization?: string;
  phone?: string;
}): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function isAuthError(error: unknown): boolean {
  return error instanceof Error && /401|Authentication required|Invalid email or password/i.test(error.message);
}
