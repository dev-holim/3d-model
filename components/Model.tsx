'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import InteractivePoints from './InteractivePoints'
import { useCameraAnimation } from '@/hooks/useCameraAnimation'

interface ModelProps {
  onLoad?: () => void
}

// 모델의 특정 부분들을 나타내는 포인트들 정의
const modelPoints = [
  {
    id: 'front',
    position: [0, 1, 2] as [number, number, number],
    label: '전면부',
    color: '#ff6b6b'
  },
  {
    id: 'back',
    position: [0, 1, -2] as [number, number, number],
    label: '후면부',
    color: '#4ecdc4'
  },
  {
    id: 'top',
    position: [0, 3, 0] as [number, number, number],
    label: '상단부',
    color: '#45b7d1'
  },
  {
    id: 'left',
    position: [-2, 1, 0] as [number, number, number],
    label: '좌측면',
    color: '#96ceb4'
  },
  {
    id: 'right',
    position: [2, 1, 0] as [number, number, number],
    label: '우측면',
    color: '#feca57'
  },
  {
    id: 'center',
    position: [0, 0, 0] as [number, number, number],
    label: '중앙부',
    color: '#ff9ff3'
  }
]

export default function Model({ onLoad }: ModelProps) {
  const { scene, animations } = useGLTF('/models/SP-S600.glb')
  const modelRef = useRef<THREE.Group>(null)
  const { animateToPoint } = useCameraAnimation()

  useEffect(() => {
    if (scene && onLoad) {
      // Calculate bounding box and center the model
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Center the model
      scene.position.copy(center).multiplyScalar(-1)

      // Scale the model if it's too large or too small
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 5) {
        const scale = 5 / maxDim
        scene.scale.setScalar(scale)
      } else if (maxDim < 1) {
        const scale = 2 / maxDim
        scene.scale.setScalar(scale)
      }

      onLoad()
    }
  }, [scene, onLoad])

  // Optional: Add a subtle rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  // 포인트 클릭 핸들러
  const handlePointClick = (point: any) => {
    console.log('Point clicked:', point.id, point.label)
    
    const targetPosition = new THREE.Vector3(...point.position)
    const lookAtPoint = new THREE.Vector3(0, 0, 0) // 모델 중심점
    
    console.log('Animating to position:', targetPosition)
    console.log('Looking at:', lookAtPoint)
    
    animateToPoint(targetPosition, lookAtPoint, 2.5, 1500)
  }

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
      <InteractivePoints 
        points={modelPoints} 
        onPointClick={handlePointClick}
      />
    </group>
  )
}

// Preload the model for better performance
useGLTF.preload('/models/SP-S600.glb') 