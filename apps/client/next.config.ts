import type { NextConfig } from "next";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        port:'',
        hostname: 'api.file.itbuild.it22.dev',
        pathname: '/**',
      },
      {
        protocol: 'http',
        port:'8787',
        hostname: 'localhost',
        pathname: '/**',
      }
    ],
  }
};

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}

export default nextConfig;
