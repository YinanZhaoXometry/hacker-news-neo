/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [{ source: '/home', destination: '/', permanent: true }];
  },
};

export default nextConfig;
