import { useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Convert lat/lon to 3D vector on sphere surface
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function Earth({ autoRotate, children }) {
  const groupRef = useRef()
  const texture = useLoader(THREE.TextureLoader, '/earth.jpg')

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.0005
    }
  })

  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace
  }

  return (
    <group ref={groupRef}>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial map={texture} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial
          color="#5dadec"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Markers are children - they rotate with the Earth */}
      {children}
    </group>
  )
}

// Location marker with sci-fi beacon style
function LocationMarker({ location, onClick }) {
  const markerRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  // Position marker on sphere surface
  const position = latLonToVector3(location.lat, location.lon, 1.02)

  useFrame((state) => {
    // Animate rings
    if (ring1Ref.current) {
      const scale1 = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.5
      ring1Ref.current.scale.setScalar(scale1)
      ring1Ref.current.material.opacity = 0.6 - (scale1 - 1) * 0.4
    }
    if (ring2Ref.current) {
      const scale2 = 1 + Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.5
      ring2Ref.current.scale.setScalar(scale2)
      ring2Ref.current.material.opacity = 0.6 - (scale2 - 1) * 0.4
    }
  })

  return (
    <group position={position}>
      {/* Center core - bright cyan dot */}
      <mesh>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#60A5FA" />
      </mesh>

      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.3} />
      </mesh>

      {/* Animated ring 1 */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.035, 0.04, 32]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Animated ring 2 */}
      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[0.045, 0.05, 32]} />
        <meshBasicMaterial color="#93C5FD" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Click target - larger invisible hit area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick(location)
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default function Globe({ locations, onLocationClick, autoRotate = true }) {
  return (
    <div className="globe-container h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Earth autoRotate={autoRotate}>
          {locations.map((location) => (
            <LocationMarker
              key={location.id}
              location={location}
              onClick={onLocationClick}
            />
          ))}
        </Earth>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
