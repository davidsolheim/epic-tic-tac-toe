import React, { useState, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from 'next-themes'

type Player = 'X' | 'O'

interface GameBoard3DProps {
  board: (Player | null)[]
  size: number
  onMove: (index: number) => void
  winner: Player | 'draw' | null
}

function Cell({ value, position, onClick, boardColor }: { value: Player | null; position: [number, number, number]; onClick: () => void; boardColor: string }) {
  const [hovered, setHover] = useState(false)

  const letterGeometry = useMemo(() => {
    if (!value) return null

    if (value === 'X') {
      const shape1 = new THREE.Shape()
      shape1.moveTo(-0.3, -0.3)
      shape1.lineTo(0.3, 0.3)

      const shape2 = new THREE.Shape()
      shape2.moveTo(0.3, -0.3)
      shape2.lineTo(-0.3, 0.3)

      const extrudeSettings = {
        steps: 1,
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5
      }

      const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings)
      const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings)

      return [geometry1, geometry2]
    } else {
      const shape = new THREE.Shape()
      shape.absarc(0, 0, 0.3, 0, Math.PI * 2)
      shape.holes.push(new THREE.Path().absarc(0, 0, 0.15, 0, Math.PI * 2, true))

      const extrudeSettings = {
        steps: 1,
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5
      }

      return new THREE.ExtrudeGeometry(shape, extrudeSettings)
    }
  }, [value])

  const color = value === 'X' ? '#FFD700' : value === 'O' ? '#C0C0C0' : boardColor

  return (
    <group position={position}>
      <mesh
        scale={hovered ? 1.05 : 1}
        onClick={onClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[0.9, 0.9, 0.1]} />
        <meshPhysicalMaterial 
          color={boardColor}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          reflectivity={1}
        />
      </mesh>
      
      {letterGeometry && (
        Array.isArray(letterGeometry) ? (
          letterGeometry.map((geo, index) => (
            <group key={index}>
              <mesh position={[0, 0, 0.05]}>
                <primitive object={geo} />
                <meshPhysicalMaterial 
                  color={color} 
                  metalness={0.8} 
                  roughness={0.2}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh position={[0, 0, -0.05]} rotation={[Math.PI, 0, 0]}>
                <primitive object={geo} />
                <meshPhysicalMaterial 
                  color={color} 
                  metalness={0.8} 
                  roughness={0.2}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ))
        ) : (
          <>
            <mesh position={[0, 0, 0.05]}>
              <primitive object={letterGeometry} />
              <meshPhysicalMaterial 
                color={color} 
                metalness={0.8} 
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0, -0.05]} rotation={[Math.PI, 0, 0]}>
              <primitive object={letterGeometry} />
              <meshPhysicalMaterial 
                color={color} 
                metalness={0.8} 
                roughness={0.2}
                clearcoat={1}
                clearcoatRoughness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )
      )}
    </group>
  )
}

function RotatingBoard({ board, size, onMove, boardColor }: GameBoard3DProps & { boardColor: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {board.map((cell, index) => {
        const x = (index % size) - (size - 1) / 2
        const y = Math.floor(index / size) - (size - 1) / 2
        return (
          <Cell
            key={index}
            value={cell}
            position={[x, -y, 0]}
            onClick={() => onMove(index)}
            boardColor={boardColor}
          />
        )
      })}
    </group>
  )
}

export default function GameBoard3D({ board, size, onMove, winner }: GameBoard3DProps) {
  const { theme } = useTheme()
  const boardColor = theme === 'dark' ? '#FFFFFF' : '#000000'

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, -3, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <RotatingBoard board={board} size={size} onMove={onMove} winner={winner} boardColor={boardColor} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}