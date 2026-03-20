"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const RobotModel = (props: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // Simple animation: Float up and down, track mouse
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Float animation
      meshRef.current.position.y = -2 + Math.sin(t * 2) * 0.15;
    }
    
    if (headRef.current) {
      // Track mouse with the head
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 6;
      
      // Smooth interpolation for look direction
      headRef.current.rotation.y += (targetX - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.x += (-targetY - headRef.current.rotation.x) * 0.1;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Robot Body */}
      <mesh castShadow position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.6, 0.8, 4, 32]} />
        <meshStandardMaterial color="#e0e4cc" metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Robot Head */}
      <group ref={headRef} position={[0, 0.9, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.1} />
        </mesh>
        
        {/* Visor/Eye (Cute wide visor) */}
        <mesh position={[0, 0.1, 0.45]}>
          <capsuleGeometry args={[0.15, 0.5, 4, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
        </mesh>
        
        {/* Antenna Base */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.2]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Antenna Bulb */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={3} />
        </mesh>
      </group>
      
      {/* Little floating arms */}
      <mesh castShadow position={[-0.8, -0.1, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.15, 0.4, 4, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.1} />
      </mesh>
      <mesh castShadow position={[0.8, -0.1, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.15, 0.4, 4, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={1.0} roughness={0.1} />
      </mesh>
    </group>
  );
};
