"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Users, AlertTriangle, ShieldCheck, Activity, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getScanHistory, fetchAnalytics, ScanHistoryItem, AdminAnalytics } from "@/services/api";

// --- ROBOT COMPONENT ---
const Robot = (props: any) => {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    // Mouse tracking for the head
    const targetX = (state.pointer.x * Math.PI) / 3;
    const targetY = (state.pointer.y * Math.PI) / 4;

    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetX,
        0.1
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -targetY,
        0.1
      );
    }

    // Blink mechanic
    const time = state.clock.getElapsedTime();
    const blinkCycle = time % 4; // blink every 4 seconds
    const isBlinking = blinkCycle > 3.8; // blink duration

    if (leftEyeRef.current && rightEyeRef.current) {
      const scaleY = isBlinking ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, scaleY, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, scaleY, 0.3);
    }
  });

  return (
    <group {...props}>
      <Float speed={2.5} rotationIntensity={0.1} floatIntensity={1.2}>
        <group position={[0, -0.5, 0]}>
          {/* Jetpack / Back accent */}
          <mesh position={[0, 0, -0.6]} castShadow>
            <boxGeometry args={[0.8, 1, 0.3]} />
            <meshStandardMaterial color="#00f0ff" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Body */}
          <mesh castShadow position={[0, 0, 0]}>
            <capsuleGeometry args={[0.7, 0.8, 8, 32]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
          </mesh>

          {/* Chest Accent */}
          <mesh position={[0, 0.2, 0.65]}>
            <circleGeometry args={[0.2, 32]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
          </mesh>

          {/* Head */}
          <group ref={headRef} position={[0, 1.4, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.4, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
              <meshStandardMaterial color="#333333" />
            </mesh>

            <mesh castShadow>
              <boxGeometry args={[1.5, 1.1, 1.3]} />
              <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
            </mesh>
            
            {/* Face Screen */}
            <mesh position={[0, 0, 0.66]}>
              <planeGeometry args={[1.3, 0.8]} />
              <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0} />
            </mesh>

            {/* Glowing Eyes */}
            <mesh ref={leftEyeRef} position={[-0.35, 0, 0.67]}>
              <capsuleGeometry args={[0.15, 0.1, 4, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
            </mesh>
            <mesh ref={rightEyeRef} position={[0.35, 0, 0.67]}>
              <capsuleGeometry args={[0.15, 0.1, 4, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} />
            </mesh>
          </group>

          {/* Arms */}
          <mesh castShadow position={[-0.9, 0.1, 0]} rotation={[0, 0, 0.2]}>
            <capsuleGeometry args={[0.2, 0.6, 4, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
          </mesh>
          <mesh castShadow position={[0.9, 0.1, 0]} rotation={[0, 0, -0.2]}>
            <capsuleGeometry args={[0.2, 0.6, 4, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
          </mesh>
        </group>
      </Float>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
    </group>
  );
};

export default function ModernDashboard() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("Admin");
  
  // Data states
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Attempt to parse username from localStorage
    try {
      const storedName = localStorage.getItem("username");
      if (storedName) setUsername(storedName);
    } catch {}

    // Load API data
    Promise.all([getScanHistory(20), fetchAnalytics()]).then(([hData, aData]) => {
      setHistory(hData);
      setAnalytics(aData);
    }).catch(console.error);
    
  }, []);

  if (!mounted) return null;

  // Deriving metrics
  const totalScans = analytics?.total_scans || (history.length > 0 ? history.length : 0);
  
  // Calculate total vulnerabilities in recent scans
  const totalVulns = history.reduce((sum, item) => sum + item.vulnerability_count, 0);
  
  // Calculate "Score" (Simple heuristic based on vulns per scan)
  const avgVulns = totalScans > 0 ? totalVulns / totalScans : 0;
  const score = Math.max(0, Math.min(100, Math.round(100 - (avgVulns * 5))));
  
  let scoreStatus = "Good standing";
  if (score < 60) scoreStatus = "Critical attention required";
  else if (score < 80) scoreStatus = "Needs attention";

  // Vulnerability Over Time formatting
  const chartData = [...history].reverse().map((item, index) => {
    const d = new Date(item.created_at);
    return {
      name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: item.vulnerability_count
    };
  });

  // Fallback if no history yet
  const displayChartData = chartData.length > 0 ? chartData : [
    { name: 'No data', value: 0 }
  ];

  return (
    <div className="min-h-[850px] bg-[#05050f] text-white p-6 font-sans overflow-hidden flex flex-col md:flex-row gap-6 relative rounded-3xl border border-white/5 shadow-2xl">
      
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00f0ff] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      {/* LEFT PANEL: 3D Robot Assistant */}
      <div className="relative w-full md:w-[35%] h-[500px] md:h-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col shadow-[0_0_30px_rgba(0,240,255,0.05)] overflow-hidden group">
        <div className="absolute top-6 left-6 flex items-center gap-2 z-10 transition-transform group-hover:scale-110">
          <Activity className="w-5 h-5 text-[#00f0ff] animate-pulse" />
          <span className="text-sm font-semibold tracking-widest text-[#00f0ff] uppercase">Sys-Bot Assistant</span>
        </div>
        
        <div className="w-full h-full absolute inset-0">
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
            <Robot position={[0, -0.5, 0]} scale={1.2} />
            <Environment preset="city" />
          </Canvas>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-sm text-[#00f0ff] font-medium backdrop-blur-md text-center group-hover:bg-[#00f0ff]/20 transition-colors">
          Processing {totalScans} user code scans... Looks {score > 80 ? "clean!" : "fishy!"}
        </div>
      </div>

      {/* RIGHT PANEL: Dashboard Content */}
      <div className="w-full md:w-[65%] flex flex-col gap-6 z-10">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Hello {username}, Security Lead
          </h1>
          <p className="text-sm text-gray-400">Real-time threat monitoring and system health based on your recent scans.</p>
        </div>

        {/* Top Cards (Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden hover:border-[#00f0ff]/50 transition-colors cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Scans</p>
                <h3 className="text-4xl font-bold mt-2">{totalScans}</h3>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl text-[#00f0ff]">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden hover:border-red-500/50 transition-colors cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative flex justify-between items-start flex-col">
              <div className="flex justify-between w-full">
                <p className="text-sm text-gray-400 font-medium">High Risk Issues</p>
                <div className="p-3 bg-red-400/20 rounded-2xl text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-4xl font-bold mt-2 text-red-400">{totalVulns}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg overflow-hidden hover:border-green-400/50 transition-colors cursor-pointer"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative flex justify-between items-start flex-col">
              <div className="flex justify-between w-full">
                <p className="text-sm text-gray-400 font-medium">Security Score</p>
                <div className="p-3 bg-green-400/20 rounded-2xl text-green-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="text-4xl font-bold text-green-400">{score}/100</h3>
                <span className={`text-xs mt-1 font-semibold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>{scoreStatus}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Vulnerability Over Time Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg min-h-[300px] flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#00f0ff]/5 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-lg font-semibold text-white/90">Vulnerability Over Time</h2>
          
          <div className="w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVuln" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(5, 5, 15, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00f0ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVuln)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
