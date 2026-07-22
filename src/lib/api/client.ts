import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { parseApiError } from "@/lib/api/errors";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/api/token";
import type { SessionResponse } from "@/lib/api/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const AUTH_PATHS_NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/password/forgot",
  "/auth/password/reset",
  "/auth/2fa/challenge/",
];

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_PATHS_NO_REFRESH.some((path) => url.includes(path));
}

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<SessionResponse | null> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

export async function refreshSession(): Promise<SessionResponse | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = apiClient
    .post<SessionResponse>("/auth/refresh")
    .then((response) => {
      const session = response.data;
      setAccessToken(session.access_token, session.access_token_expires_at);
      return session;
    })
    .catch(() => {
      clearAccessToken();
      onSessionExpired?.();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    if (
      !config ||
      error.response?.status !== 401 ||
      config._retry ||
      shouldSkipRefresh(config.url)
    ) {
      return Promise.reject(parseApiError(error));
    }

    config._retry = true;
    const session = await refreshSession();
    if (!session) {
      return Promise.reject(parseApiError(error));
    }

    config.headers.Authorization = `Bearer ${session.access_token}`;
    return apiClient.request(config);
  },
);

export function applySession(session: SessionResponse): void {
  setAccessToken(session.access_token, session.access_token_expires_at);
}

export function clearSession(): void {
  clearAccessToken();
}
