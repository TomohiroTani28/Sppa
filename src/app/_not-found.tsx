// src/app/_not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}

// Explicitly force static generation (optional, as it’s the default for server components)
export const dynamic = "force-static";