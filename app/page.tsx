'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PresentationControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Model from '@/components/Model'

function Loader() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading 3D Model...</p>
    </div>
  )
}

function PositionGuideUI() {
  return (
    <div className="position-guide" style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#4a90e2' }}>📐 포인트 위치 가이드</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>🎯 좌표계:</strong><br/>
        <span style={{ color: '#ff6b6b' }}>• X축 (빨강)</span> - 좌우<br/>
        <span style={{ color: '#4ecdc4' }}>• Y축 (초록)</span> - 상하<br/>
        <span style={{ color: '#45b7d1' }}>• Z축 (파랑)</span> - 전후
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>⌨️ 단축키:</strong><br/>
        • <code>G</code> - 가이드 토글
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>🖱️ 사용법:</strong><br/>
        • 포인트 클릭 시 콘솔에 좌표 출력<br/>
        • 노란 구체가 마우스 위치 표시<br/>
        • 격자를 참고해서 위치 조정
      </div>
      
      <div style={{ fontSize: '12px', color: '#888' }}>
        개발자 도구(F12) {'->'} Console에서<br/>
        정확한 좌표 값을 확인하세요
      </div>
    </div>
  )
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <main>
      <div className="canvas-container">
        {!isLoaded && <Loader />}
        
        {/* 위치 가이드 UI */}
        {/* <PositionGuideUI /> */}
        
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Environment lighting for realistic reflections */}
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            enablePan={true} // 우클릭 + 드래그로 카메라 이동 허용
            enableZoom={true} // 스크롤휠로 줌인/줌아웃 허용
            enableRotate={true} // 좌클릭 + 드래그로 회전 허용
            enableDamping={true} // 관성 효과 활성화 (부드러운 정지)
            dampingFactor={0.4} // 관성 강도 (낮을수록 더 부드럽게)
            minDistance={1} // 최소 줌인 거리
            maxDistance={10} // 최대 줌아웃 거리
            maxPolarAngle={Math.PI / 1.8} //  수직 회전 제한 (약 100도, 바닥 뚫고 못들어가게) 기본 1.8
            
            // 마우스 민감도 설정
            rotateSpeed={1.0}        // 회전 속도 (기본값: 1.0)
            panSpeed={1.0}           // 팬 속도 (기본값: 1.0) 
            zoomSpeed={1.0}          // 줌 속도 (기본값: 1.0)
            
            makeDefault
          />

          {/* Ground shadow */}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />

          {/* 3D Model */}
          <Suspense fallback={null}>
            <Model onLoad={() => setIsLoaded(true)} />
          </Suspense>
        </Canvas>
      </div>
    </main>
  )
} 