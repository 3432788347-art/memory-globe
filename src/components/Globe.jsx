import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return [x, y, z]
}

function RotatingGlobe() {
  const globeRef = useRef()

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={globeRef}>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#0c4a6e"
          emissive="#1e3a5f"
          emissiveIntensity={0.2}
          wireframe
        />
      </Sphere>
      <Sphere args={[0.99, 64, 64]}>
        <meshStandardMaterial
          color="#0ea5e9"
          transparent
          opacity={0.1}
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
      markerRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.2)
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
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshStandardMaterial
        color="#f43f5e"
        emissive="#f43f5e"
        emissiveIntensity={0.8}
      />
    </mesh>
  )
}

export default function Globe({ locations, onLocationClick }) {
  return (
    <div className="globe-container h-full w-full">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} />
        <RotatingGlobe />
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
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}
