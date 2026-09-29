/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  /**
   * Proxy rewrites: any request to /api/* on the frontend dev server
   * is transparently forwarded to the backend on port 3000.
   * This avoids CORS issues in development and keeps a single origin
   * for the browser.
   */
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    return [
      // Proxy all API calls to backend
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

