/** @type {import('next').NextConfig} */
const nextConfig = {reactStrictMode: true,
  experimental: {
  },
  // DON'T add css-loader or style-loader manually
  webpack: (config) => {
    // you can modify config, but don't add CSS loaders here unless necessary
    return config;
  },};

export default nextConfig;
