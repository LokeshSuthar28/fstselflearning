/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow the frontend (port 3001) to call backend API routes
  async headers() {
    const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, Cookie, x-mock-role, x-user-role, x-user-id",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
