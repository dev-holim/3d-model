import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '3D Model Viewer',
  description: 'Modern 3D model viewer built with Next.js and React Three Fiber',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 