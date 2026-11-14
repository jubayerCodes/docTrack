import { IApiResponse } from '../types';
import { createClient } from './supabase/client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClientError extends Error {
  public statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
  }
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (typeof window === 'undefined') return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)sb-access-token=([^;]*)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return null;
}

async function getAccessToken(): Promise<string | null> {
  // 1. Fast synchronous lookup from cookie
  const cookieToken = getTokenFromCookie();
  if (cookieToken) return cookieToken;

  // 2. Fallback to Supabase session retrieval
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    }
  } catch {
    // ignore
  }

  return null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<IApiResponse<T>> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Bearer token for cross-domain REST API requests
  if (!headers.has('Authorization')) {
    const token = await getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // transmits HTTP-only cookies if available
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname !== '/login' &&
      window.location.pathname !== '/register'
    ) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.auth.signOut();
        }
      } catch {
        // ignore
      }
      window.location.href = '/login';
    }
    throw new ApiClientError(data.message || `Request failed with status ${response.status}`, response.status);
  }

  return data as IApiResponse<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
