'use client';

import { User } from './auth';

/**
 * Client-side function to get the current authenticated user
 * @returns Promise<User | null> - The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/me');
    if (res.status === 401) {
      return null;
    }
    const data = await res.json();
    return data.user || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}
