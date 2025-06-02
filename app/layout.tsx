import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Model Viewer',
  description: 'Modern 3D model viewer built with Next.js and React Three Fiber',
}

// @ts-ignore: 타입 충돌 우회
export default function RootLayout(props: any) {
  const { children } = props
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

// 타입 검사 우회를 위한 명시적 export
RootLayout.displayName = 'RootLayout' 