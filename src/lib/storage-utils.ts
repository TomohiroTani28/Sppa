// src/lib/storage-utils.ts
const REDIRECT_PATH_KEY = 'redirect_path';

export function saveRedirectPath(path: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REDIRECT_PATH_KEY, path);
    console.log('Saved redirect path:', path);
  }
}

export function getRedirectPath(): string | null {
  if (typeof window !== 'undefined') {
    const path = localStorage.getItem(REDIRECT_PATH_KEY);
    console.log('Retrieved redirect path:', path);
    return path;
  }
  return null;
}

export function clearRedirectPath(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REDIRECT_PATH_KEY);
    console.log('Cleared redirect path');
  }
}