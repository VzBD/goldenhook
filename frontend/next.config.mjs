import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM: emulate __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  output: 'standalone',
  webpack: (config) => {
    // Явный alias для '@/...' -> 'src'
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  // Укажем базовый URL для корректных canonical/OG ссылок, если задан в env
  // В рантайме на сервере Next доступен process.env
  // Клиентские места используют metadataBase из layout.tsx
};

export default nextConfig;
