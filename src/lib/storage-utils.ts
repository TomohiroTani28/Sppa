// src/app/lib/storage-utils.ts
const REDIRECT_PATH_KEY = "redirectPath";

export const saveRedirectPath = (path: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REDIRECT_PATH_KEY, path);
  }
};

export const getRedirectPath = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REDIRECT_PATH_KEY);
  }
  return null;
};

export const clearRedirectPath = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REDIRECT_PATH_KEY);
  }
};