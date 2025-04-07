// src/app/_not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

// Optional: Explicitly disable client-side rendering (not needed, but for clarity)
export const dynamic = "force-static";