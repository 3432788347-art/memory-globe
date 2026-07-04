import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

function Earth({ autoRotate }) {
  const earthRef = useRef()
  const [texture, setTexture] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    // 使用 jsdelivr CDN 更稳定
    loader.load(
      'https://cdn.jsdelivr.net/npm/three-globe@example/img/earth-blue-marble.jpg',
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        setTexture(loadedTexture)
        setLoading(false)
      },
      undefined,
      () => {
        // 如果 CDN 失败，使用备用方案
        setLoading(false)
      }
    )
  }, [])

  useFrame(() => {
    if (earthRef.current && autoRotate) {
      earthRef.current.rotation.y += 0.0005
    }
  })

  return (
    <group ref={earthRef}>
      <Sphere args={[1, 64, 64]}>
        {loading ? (
          <meshStandardMaterial
            color="#b8c4ce"
            metalness={0.2}
            roughness={0.7}
          />
        ) : (
          <meshStandardMaterial
            map={texture}
            color="#b8c4ce"
            metalness={0.1}
            roughness={0.8}
          />
        )}
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial
          color="#4a90d9"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}

function LocationMarker({ location, onClick }) {
  const markerRef = useRef()
  const position = latLonToVector3(location.lat, location.lon, 1.05)

  useFrame(() => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.003) * 0.3
      markerRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh
      ref={markerRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick(location)
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <sphereGeometry args={[0.025, 16, 16]} />
      <meshStandardMaterial
        color="#4a90d9"
        emissive="#4a90d9"
        emissiveIntensity={0.8}
      />
    </mesh>
  )
}

export default function Globe({ locations, onLocationClick, autoRotate = true }) {
  return (
    <div className="globe-container h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.4} color="#404060" />
        <pointLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <Earth autoRotate={autoRotate} />
        {locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            onClick={onLocationClick}
          />
        ))}
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
