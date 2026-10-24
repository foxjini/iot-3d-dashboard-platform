'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIoTStore } from '@/core/store/useIoTStore';
import { LightObject } from '@/components/3d/LightObject';
import { CdsSensorNode } from '@/components/3d/CdsSensorNode';
import { Html } from '@react-three/drei';

export function SmartFarmRoom() {
  const domeRef = useRef<THREE.Group>(null);
  const reportedAngle = useIoTStore((s) => s.actuators.sg90_door.reportedAngle);
  const soilMoisture = 65.4; // 스마트팜 토양수분 예시

  // 서보모터 각도(0~180도)에 따라 온실 환기 돔 개폐 각도(0 ~ 50도) 보간
  const domeOpenRad = (Math.min(180, Math.max(0, reportedAngle)) / 180) * 0.8;

  useFrame((_, delta) => {
    if (domeRef.current) {
      domeRef.current.rotation.x = THREE.MathUtils.damp(
        domeRef.current.rotation.x,
        -domeOpenRad,
        6,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 온실 흙 바닥 (Soil Ground) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[5.5, 5.5]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>

      {/* 2. 온실 유리 돔 프레임 (Greenhouse Frame) */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[4.5, 2.8, 4.5]} />
        <meshStandardMaterial
          color="#38BDF8"
          transparent
          opacity={0.18}
          roughness={0.1}
        />
      </mesh>

      {/* 3. 환기 돔 지붕 (Ventilation Dome Roof - SG90 연동 개폐) */}
      <group ref={domeRef} position={[0, 2.8, -1.8]}>
        <mesh position={[0, 0.4, 1.8]}>
          <boxGeometry args={[4.2, 0.1, 3.6]} />
          <meshStandardMaterial
            color="#67E8F9"
            transparent
            opacity={0.4}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 4. 스마트팜 중앙 스마트 화분 배드 (Smart Plant Bed) */}
      <group position={[0, 0.35, 0]}>
        {/* 나무 화분 상자 */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.7, 1.4]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.7} />
        </mesh>

        {/* 배양토 */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[2.2, 0.05, 1.2]} />
          <meshStandardMaterial color="#1B120C" roughness={1.0} />
        </mesh>

        {/* 식물들 (작은 실린더 줄기 + 구형 잎) */}
        {[-0.7, 0, 0.7].map((x, idx) => (
          <group key={idx} position={[x, 0.4, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6]} />
              <meshStandardMaterial color="#15803D" />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial color="#22C55E" roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* 토양 수분 센서 3D 배지 */}
        <Html position={[0, 1.2, 0]} center distanceFactor={8}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-white shadow-xl backdrop-blur-md">
            <span className="text-xs font-semibold text-emerald-300">토양 수분:</span>
            <span className="text-sm font-bold text-emerald-400">{soilMoisture}%</span>
          </div>
        </Html>
      </group>

      {/* 기존 조명(성장등) 및 조도센서 결합 */}
      <LightObject />
      <CdsSensorNode />
    </group>
  );
}
