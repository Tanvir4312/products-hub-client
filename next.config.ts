



import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // reactCompiler: true,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },

  async rewrites() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

    return [
      {
        source: "/api/auth/:path*",
        destination: `${BACKEND_API}/api/auth/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  }



  // async rewrites() {
  //   const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${BACKEND_API}/api/:path*`,
  //     },
  //   ]
  // },


};

export default nextConfig;
