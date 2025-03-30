// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 環境変数を明示的に設定
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
    NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT: process.env.HASURA_GRAPHQL_WS_ENDPOINT,
    NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
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

    // 開発環境で環境変数のログ出力を追加
    if (process.env.NODE_ENV === "development") {
      console.log("✅ NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✔ Loaded" : "❌ Not Loaded");
      console.log("✅ NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT);
      console.log("✅ NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT:", process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT);
      console.log("✅ NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET:", process.env.HASURA_GRAPHQL_ADMIN_SECRET ? "✔ Loaded" : "❌ Not Loaded");
    }

    return config;
  },
};

module.exports = nextConfig;
