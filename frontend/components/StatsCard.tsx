"use client";
import React from 'react';
import { Html } from '@react-three/drei';
import './Dashboard.css';

export const StatsCard = ({ title, value, trend, trendColor }: any) => {
  return (
    // 'occlude' makes the card hide behind 3D objects if they pass in front
    <Html center occlude transform distanceFactor={10}>
      <div className="stats-card-3d">
        <div className="card-header">{title}</div>
        <div className="card-value">{value}</div>
        <div className="card-trend" style={{ color: trendColor }}>
          {trend}
        </div>
      </div>
    </Html>
  );
};
