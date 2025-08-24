/** @type {import('next').NextConfig} */
const nextConfig = {
  // 不要设置 output: 'export'，在 Vercel 上使用默认行为（SSR/Edge）
  // output: 'export',
  reactStrictMode: true,
};

export default nextConfig;