// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || "http://localhost:8081/v1/graphql",
    NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT || "ws://localhost:8081/v1/graphql",
    SUPABASE_URL: process.env.SUPABASE_URL || "http://localhost:3000",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  },

  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || "http://localhost:8081/v1/graphql",
      },
    ];
  },

  images: {
    domains: ["localhost", "supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },

  experimental: {
    serverActions: {},
  },

  webpack(config) {
    config.resolve.modules.push(__dirname + "/src");

    if (process.env.NODE_ENV === "development") {
      console.log("✅ NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("✅ SUPABASE_URL (server):", process.env.SUPABASE_URL);
      console.log("✅ SUPABASE_ANON_KEY (server):", process.env.SUPABASE_ANON_KEY ? "✔ Loaded" : "❌ Not Loaded");
    }

    return config;
  },
};

module.exports = nextConfig;