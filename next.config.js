// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 環境変数を明示的に設定（サーバー側用も含む！）
  env: {
    // クライアント用
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT,
    NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET,

    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
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
