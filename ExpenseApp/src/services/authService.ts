/**
 * authService.ts
 * ──────────────
 * All HTTP calls to the AuthService Spring Boot backend.
 *
 * AuthService runs on port 9898.
 * Public endpoints (no JWT required):
 *   POST /auth/v1/login
 *   POST /auth/v1/signup
 *   POST /auth/v1/refreshToken
 *
 * Every other request must carry:
 *   Authorization: Bearer <accessToken>
 */

// ─── Base URL ──────────────────────────────────────────────────────────────
// AuthService runs in Docker on a VM at 192.168.1.13:9898
// Phone, PC and VM must all be on the same network (192.168.1.x).
export const AUTH_BASE_URL = 'http://192.168.1.13:9898';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface LoginRequest {
  /** Matches AuthRequestDTO.userName */
  userName: string;
  password: string;
}

export interface SignupRequest {
  /** Matches UserInfoDto (snake_case via Jackson SnakeCaseStrategy) */
  user_name: string;
  password: string;
  first_name: string;
  last_name: string;
  /** Stored as Long in the backend — send a numeric value */
  phone_number: string | number;
  email: string;
}

export interface JwtResponse {
  /** Short-lived access token (JWT) */
  accessToken: string;
  /** Long-lived refresh token (opaque UUID stored in DB) */
  token: string;
}

export interface AuthError {
  message: string;
  status: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }
  const body = await res.text();
  throw { message: body || `HTTP ${res.status}`, status: res.status } as AuthError;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err: unknown) {
    clearTimeout(id);
    const errorObj = err as { name?: string; message?: string };
    if (errorObj?.name === 'AbortError') {
      throw { message: `Connection timed out. Cannot reach auth server at ${AUTH_BASE_URL}`, status: 0 } as AuthError;
    }
    throw { message: errorObj?.message || 'Network request failed. Make sure your phone and VM are on the same Wi-Fi.', status: 0 } as AuthError;
  }
}

// ─── Auth API ──────────────────────────────────────────────────────────────

/**
 * POST /auth/v1/login
 * Authenticates an existing user and returns JWT + refresh token.
 */
export async function loginUser(req: LoginRequest): Promise<JwtResponse> {
  const res = await fetchWithTimeout(`${AUTH_BASE_URL}/auth/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }, 10000);
  return handleResponse<JwtResponse>(res);
}

/**
 * POST /auth/v1/signup
 * Registers a new user and returns JWT + refresh token on success.
 * Throws AuthError with status 400 if the username already exists.
 */
export async function signupUser(req: SignupRequest): Promise<JwtResponse> {
  const res = await fetchWithTimeout(`${AUTH_BASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  }, 10000);
  return handleResponse<JwtResponse>(res);
}

/**
 * POST /auth/v1/refreshToken
 * Exchanges a refresh token for a new access token.
 * Note: backend field name is capitalised "Token".
 */
export async function refreshAccessToken(refreshToken: string): Promise<JwtResponse> {
  const res = await fetchWithTimeout(`${AUTH_BASE_URL}/auth/v1/refreshToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Token: refreshToken }),
  }, 8000);
  return handleResponse<JwtResponse>(res);
}

/**
 * GET /ping (protected)
 * Lightweight liveness check — requires a valid Bearer token.
 * Returns true if the token is still valid, false otherwise.
 */
export async function pingProtected(accessToken: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${AUTH_BASE_URL}/ping`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }, 3500);
    return res.ok;
  } catch {
    return false;
  }
}

