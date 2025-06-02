'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import InteractivePoints from './InteractivePoints'
import { useCameraAnimation } from '@/hooks/useCameraAnimation'

interface ModelProps {
  onLoad?: () => void
}

// 좌표 가이드 컴포넌트
function CoordinateGuides() {
  return (
    <group>
      {/* X축 (빨강) */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 3, 0xff0000]} />
      {/* Y축 (초록) */}
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 3, 0x00ff00]} />
      {/* Z축 (파랑) */}
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x0000ff]} />
      
      {/* 격자 */}
      <gridHelper args={[10, 10, 0x888888, 0x444444]} position={[0, -2, 0]} />
      <gridHelper args={[10, 10, 0x888888, 0x444444]} position={[0, 0, -2]} rotation={[Math.PI/2, 0, 0]} />
      <gridHelper args={[10, 10, 0x888888, 0x444444]} position={[-2, 0, 0]} rotation={[0, 0, Math.PI/2]} />
      
      {/* 좌표 표시 텍스트 */}
      <mesh position={[3.2, 0, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial color="red" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial color="green" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 3.2]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial color="blue" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// 마우스 위치 추적 컴포넌트
function MousePositionTracker() {
  const { camera, raycaster, pointer } = useThree()
  const [position, setPosition] = useState<THREE.Vector3 | null>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    // 마우스 레이캐스팅으로 3D 공간의 위치 계산
    raycaster.setFromCamera(pointer, camera)
    
    // 임시 평면과의 교차점 계산 (Y=0 평면)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (intersectPoint) {
      setPosition(intersectPoint)
      if (sphereRef.current) {
        sphereRef.current.position.copy(intersectPoint)
        sphereRef.current.visible = true
      }
    }
  })

  return (
    <>
      {/* 마우스 위치 표시 구체 */}
      <mesh ref={sphereRef} visible={false}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="yellow" transparent opacity={0.7} />
      </mesh>
      
      {/* 위치 정보 UI */}
      {position && (
        <group position={[4, 3, 0]}>
          <mesh>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial color="black" transparent opacity={0.8} />
          </mesh>
        </group>
      )}
    </>
  )
}

// 모델의 특정 부분들을 나타내는 포인트들 정의
const modelPoints = [
  {
    id: 'front',
    position: [0, 0, 0.926] as [number, number, number],
    label: '전면부',
    lookAt: [0, 0, 0] as [number, number, number], // 전면부 중심을 바라봄
    cameraDistance: 2.5
  },
  {
    id: 'back',
    position: [0, 0, -1.1] as [number, number, number],
    label: '후면부',
    lookAt: [0, 0, 0] as [number, number, number], // 후면부 중심을 바라봄
    cameraDistance: 2.5
  },
  {
    id: 'top',
    position: [0.37, 0.61, 0.212] as [number, number, number],
    label: '좌측 모서리',
    lookAt: [0, 0.8, -0.7] as [number, number, number], // 모서리 부분을 집중해서 바라봄
    cameraDistance: 2
  },
  {
    id: 'left',
    position: [0.2, 0, 0.4] as [number, number, number],
    label: '의자',
    lookAt: [-0.1, -0.4, 0.2] as [number, number, number], // 의자 좌석 부분을 바라봄
    cameraDistance: 2
  },
  {
    id: 'right',
    position: [0.37, -0.31, -0.43] as [number, number, number],
    label: '좌측 뒷바퀴',
    lookAt: [0, 0, 0] as [number, number, number], // 바퀴 자체를 집중해서 바라봄
    cameraDistance: 1.2
  },
  {
    id: 'center',
    position: [0, 0, 0] as [number, number, number],
    label: '중앙부',
    lookAt: [0, -2, 0] as [number, number, number], // 전체 모델 개요
    cameraDistance: 4
  }
]

export default function Model({ onLoad }: ModelProps) {
  const { scene, animations } = useGLTF('/models/SP-S600.glb')
  const modelRef = useRef<THREE.Group>(null)
  const { animateToPoint } = useCameraAnimation()
  const [showGuides, setShowGuides] = useState(false)

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

  // Optional: 카메라 움직이는 것처럼 보이는 애니메이션
  // useFrame((state) => {
  //   if (modelRef.current) {
  //     modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
  //   }
  // })

  // 포인트 클릭 핸들러
  const handlePointClick = (point: any) => {
    console.log('Point clicked:', point.id, point.label)
    console.log('Point position:', point.position)
    
    const targetPosition = new THREE.Vector3(...point.position)
    const lookAtPoint = new THREE.Vector3(...point.lookAt)
    
    console.log('Animating to position:', targetPosition)
    console.log('Looking at:', lookAtPoint)
    
    animateToPoint(targetPosition, lookAtPoint, point.cameraDistance, 1500)
  }

  // 키보드로 가이드 토글
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'g' || event.key === 'G') {
        setShowGuides(prev => !prev)
        console.log('Guides toggled:', !showGuides)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showGuides])

  return (
    <group ref={modelRef}>
      <primitive object={scene} />
      
      {/* 좌표 가이드 (G키로 토글 가능) */}
      {showGuides && <CoordinateGuides />}
      
      {/* 마우스 위치 추적 */}
      {showGuides && <MousePositionTracker />}
      
      <InteractivePoints 
        points={modelPoints} 
        onPointClick={handlePointClick}
      />
      
      {/* 현재 포인트 위치 정보를 콘솔에 출력 */}
      {showGuides && (
        <group>
          {modelPoints.map((point, index) => (
            <group key={point.id} position={point.position}>
              {/* 위치 표시용 작은 텍스트 */}
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="white" />
              </mesh>
            </group>
          ))}
        </group>
      )}
    </group>
  )
}

// Preload the model for better performance
useGLTF.preload('/models/SP-S600.glb') 