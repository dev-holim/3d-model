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

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <main>
      <div className="canvas-container">
        {!isLoaded && <Loader />}
        
        <div className="model-info">
          <h1>3D Model Viewer</h1>
          <p>Interactive 3D model display</p>
          <div className="point-info">
            <h3>🎯 Interactive Points</h3>
            <p>Click on colored points to zoom to that area</p>
          </div>
        </div>

        <div className="controls-info">
          <h3>Controls</h3>
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          <p>⌨️ Right-click + drag to pan</p>
          <p>🎯 Click points to focus</p>
        </div>

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
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={20}
            maxPolarAngle={Math.PI / 1.8}
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