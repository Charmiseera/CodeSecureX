"use client";
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { StatsCard } from './StatsCard';
import { RobotModel } from './RobotModel';
import './Dashboard.css';

const Dashboard3D = ({ analytics, loading }: { analytics: any, loading: boolean }) => {
  return (
    <div className="dashboard-container relative min-h-[500px] rounded-3xl overflow-hidden mt-6 mb-8 w-full border border-white/5 shadow-[0_0_40px_rgba(172,161,253,0.05)] bg-[hsl(226,12%,10%)]">
      {/* The 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.4} />
        
        <spotLight
          position={[10, 20, 10]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          castShadow
          color="#aca1fd"
        />

        <spotLight
          position={[-10, 10, -10]}
          angle={0.5}
          penumbra={1}
          intensity={0.5}
          color="#8b5cf6"
        />

        {/* Background Effects */}
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
        
        {/* 3D Objects */}
        <Suspense fallback={null}>
          <RobotModel position={[3, -1, 0]} />
          
          <group position={[-3.5, 2, 0]}>
            <StatsCard 
              title="TOTAL SCANS" 
              value={loading ? "..." : (analytics?.total_scans || "0")} 
              trend="+12%" 
              trendColor="#aca1fd" 
            />
          </group>

          <group position={[1.5, 2.5, -2]}>
             <StatsCard 
              title="ACTIVE USERS" 
              value={loading ? "..." : (analytics?.active_users || "0")} 
              trend="-5%" 
              trendColor="#f87171" 
            />
          </group>

          <group position={[-1, -1.5, 3]}>
             <StatsCard 
              title="TOTAL USERS" 
              value={loading ? "..." : (analytics?.total_users || "0")} 
               trend="+8%" 
              trendColor="#aca1fd" 
            />
          </group>
          
        </Suspense>
        
        {/* Controls */}
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
};

export default Dashboard3D;
