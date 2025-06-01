import { useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraTarget {
  position: THREE.Vector3
  lookAt: THREE.Vector3
  zoom?: number
}

export function useCameraAnimation() {
  const { camera, controls } = useThree()
  const isAnimating = useRef(false)
  const animationProgress = useRef(0)
  const startPos = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  const animationId = useRef<number | null>(null)

  const animateToPoint = useCallback((
    targetPosition: THREE.Vector3, 
    lookAtPoint: THREE.Vector3,
    distance: number = 3,
    duration: number = 1500
  ) => {
    if (!controls || !('target' in controls)) {
      console.log('No controls available')
      return
    }

    console.log('Starting animation to:', targetPosition, 'looking at:', lookAtPoint)

    // Cancel any existing animation
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
    }

    // Store start values
    startPos.current.copy(camera.position)
    startTarget.current.copy((controls as any).target)

    // Calculate end values - position camera at distance from lookAt point towards targetPosition
    const direction = new THREE.Vector3()
      .subVectors(targetPosition, lookAtPoint)
      .normalize()
      .multiplyScalar(distance)

    endPos.current.copy(lookAtPoint).add(direction)
    endTarget.current.copy(lookAtPoint)

    // Start animation
    isAnimating.current = true
    animationProgress.current = 0

    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      animationProgress.current = eased

      // Interpolate camera position
      const currentPos = new THREE.Vector3().lerpVectors(
        startPos.current,
        endPos.current,
        eased
      )
      camera.position.copy(currentPos)

      // Interpolate target
      const currentTarget = new THREE.Vector3().lerpVectors(
        startTarget.current,
        endTarget.current,
        eased
      )
      ;(controls as any).target.copy(currentTarget)

      // Update controls
      if ('update' in controls) {
        ;(controls as any).update()
      }

      if (progress < 1) {
        animationId.current = requestAnimationFrame(animate)
      } else {
        isAnimating.current = false
        animationProgress.current = 1
        animationId.current = null
        console.log('Animation completed')
      }
    }

    animationId.current = requestAnimationFrame(animate)
  }, [camera, controls])

  // Clean up animation on unmount
  const stopAnimation = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current)
      animationId.current = null
    }
    isAnimating.current = false
  }, [])

  return { animateToPoint, stopAnimation, isAnimating: isAnimating.current }
} 