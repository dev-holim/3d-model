'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface Point {
  id: string
  position: [number, number, number]
  label: string
  color?: string
  lookAt: [number, number, number]
  cameraDistance: number
}

interface InteractivePointsProps {
  points: Point[]
  onPointClick: (point: Point) => void
}

export default ({points, onPointClick}: InteractivePointsProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const pointRefs = useRef<{ [key: string]: THREE.Mesh }>({})

  useFrame(() => {
    // Animate points on hover
    Object.entries(pointRefs.current).forEach(([id, mesh]) => {
      if (mesh) {
        const isHovered = hoveredPoint === id
        const targetScale = isHovered ? 1.3 : 1
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
      }
    })
  })

  return (
    <>
      {points.map((point) => (
        <group key={point.id} position={point.position}>
          {/* Interactive sphere */}
          <Sphere
            ref={(ref) => {
              if (ref) pointRefs.current[point.id] = ref
            }}
            args={[0.02, 16, 16]}
            onClick={(e) => {
              console.log('Sphere clicked:', point.id)
              e.stopPropagation()
              onPointClick(point)
            }}
            onPointerEnter={(e) => {
              e.stopPropagation()
              setHoveredPoint(point.id)
              document.body.style.cursor = 'pointer'
            }}
            onPointerLeave={(e) => {
              e.stopPropagation()
              setHoveredPoint(null)
              document.body.style.cursor = 'auto'
            }}
          >
            <meshStandardMaterial
              color={point.color || '#f37321'}
              emissive={point.color || '#f37321'}
              emissiveIntensity={hoveredPoint === point.id ? 1.5 : 0.2}
              transparent
              opacity={0.9}
            />
          </Sphere>

          {/* <Text
            position={[0, 0.3, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {point.label}
          </Text> */}

          {/* <Ring point={point} isHovered={hoveredPoint === point.id} /> */}
        </group>
      ))}
    </>
  )
}

function Ring({ point, isHovered }: { point: Point; isHovered: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime
      const scale = isHovered ? 1.5 + Math.sin(clock.elapsedTime * 3) * 0.2 : 1
      ringRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.15, 0.2, 32]} />
      <meshBasicMaterial
        color={point.color || '#ff6b6b'}
        transparent
        opacity={isHovered ? 0.6 : 0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
