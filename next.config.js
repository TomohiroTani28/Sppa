// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || "http://localhost:8081/v1/graphql",
    NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT || "ws://localhost:8081/v1/graphql",
    SUPABASE_URL: process.env.SUPABASE_URL || "http://localhost:54321",
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  webpack(config, { dev, isServer }) {
    config.resolve.modules.push(__dirname + "/src");

    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.log("✅ NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("✅ SUPABASE_URL (server):", process.env.SUPABASE_URL);
      console.log("✅ SUPABASE_ANON_KEY (server):", process.env.SUPABASE_ANON_KEY ? "✔ Loaded" : "❌ Not Loaded");
    }

    return config;
  },

  productionBrowserSourceMaps: false,
  distDir: '.next',
  cleanDistDir: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;