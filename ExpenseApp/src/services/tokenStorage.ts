/**
 * tokenStorage.ts
 * ───────────────
 * Secure persistence layer for JWT access & refresh tokens.
 *
 * Uses expo-secure-store on iOS/Android (hardware-backed keychain/keystore).
 * Falls back to a simple in-memory store on web (tokens are never written to
 * localStorage for security reasons).
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
} as const;

// ─── In-memory fallback (web) ───────────────────────────────────────────────
const memStore: Record<string, string> = {};

async function save(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    memStore[key] = value;
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function load(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return memStore[key] ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function remove(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    delete memStore[key];
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Persist both tokens after a successful login / signup / refresh. */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await save(KEYS.ACCESS_TOKEN, accessToken);
  await save(KEYS.REFRESH_TOKEN, refreshToken);
}

/** Load the stored access token (null if not present). */
export async function getAccessToken(): Promise<string | null> {
  return load(KEYS.ACCESS_TOKEN);
}

/** Load the stored refresh token (null if not present). */
export async function getRefreshToken(): Promise<string | null> {
  return load(KEYS.REFRESH_TOKEN);
}

/** Delete both tokens on logout. */
export async function clearTokens(): Promise<void> {
  await remove(KEYS.ACCESS_TOKEN);
  await remove(KEYS.REFRESH_TOKEN);
}
