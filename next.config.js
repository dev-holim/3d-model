/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir는 Next.js 13.4+ 에서 기본값이 되었으므로 제거
  
  // 도커 빌드 최적화
  output: 'standalone',
  
  // 이미지 최적화 설정
  images: {
    unoptimized: true
  },
  
  // 빌드 최적화
  swcMinify: true,
  
  // TypeScript 타입 검사 건너뛰기 (도커 빌드 시)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint 건너뛰기 (도커 빌드 시)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 실험적 기능
  experimental: {
    // 필요한 실험적 기능이 있다면 여기에 추가
  }
}

module.exports = nextConfig 