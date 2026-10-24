'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIoTStore } from '@/core/store/useIoTStore';
import { LightObject } from '@/components/3d/LightObject';
import { CdsSensorNode } from '@/components/3d/CdsSensorNode';
import { Html } from '@react-three/drei';

interface SmartFarmRoomProps {
  isModalOpen?: boolean;
}

export function SmartFarmRoom({ isModalOpen = false }: SmartFarmRoomProps) {
  const domeRef = useRef<THREE.Group>(null);
  const reportedAngle = useIoTStore((s) => s.actuators.sg90_door.reportedAngle);
  
  // 온습도 센서 및 가상 토양 수분 수치
  const temp = useIoTStore((s) => s.sensors.dht11_temp.value);
  const humi = useIoTStore((s) => s.sensors.dht11_humi.value);
  const soilMoisture = Math.round((humi * 0.9 + 18) * 10) / 10; // 온실 습도 연동 토양 수분

  // SG90 서보모터 각도(0~180도)에 따라 온실 환기 돔 개폐 각도(0 ~ 55도) 부드럽게 보간
  const domeOpenRad = (Math.min(180, Math.max(0, reportedAngle)) / 180) * 0.95;

  useFrame((_, delta) => {
    if (domeRef.current) {
      domeRef.current.rotation.x = THREE.MathUtils.damp(
        domeRef.current.rotation.x,
        -domeOpenRad,
        5,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 온실 흙 바닥 (Soil Ground) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 6.5]} />
        <meshStandardMaterial color="#2E1B0E" roughness={0.9} />
      </mesh>

      {/* 2. 온실 바닥 잔디 가장자리 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#166534" roughness={0.95} />
      </mesh>

      {/* 3. 온실 투명 유리 프레임 기둥 (Greenhouse Frame) */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[4.8, 2.8, 4.8]} />
        <meshStandardMaterial
          color="#38BDF8"
          transparent
          opacity={0.15}
          roughness={0.1}
        />
      </mesh>

      {/* 온실 철골 알루미늄 프레임 모서리 */}
      {[
        [-2.4, 1.4, -2.4],
        [2.4, 1.4, -2.4],
        [-2.4, 1.4, 2.4],
        [2.4, 1.4, 2.4],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <boxGeometry args={[0.08, 2.8, 0.08]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* 4. 환기 돔 지붕 (Ventilation Dome Roof - SG90 연동 개폐) */}
      <group ref={domeRef} position={[0, 2.8, -2.2]}>
        <mesh position={[0, 0.4, 2.2]}>
          <boxGeometry args={[4.6, 0.1, 4.2]} />
          <meshStandardMaterial
            color="#67E8F9"
            transparent
            opacity={0.35}
            roughness={0.2}
          />
        </mesh>
        {/* 지붕 알루미늄 리브 */}
        <mesh position={[0, 0.46, 2.2]}>
          <boxGeometry args={[4.62, 0.04, 0.1]} />
          <meshStandardMaterial color="#64748B" metalness={0.7} />
        </mesh>
      </group>

      {/* 5. 스마트팜 중앙 스마트 화분 배드 (Smart Plant Bed) */}
      <group position={[0, 0.35, 0]}>
        {/* 나무 화분 상자 */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.7, 1.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>

        {/* 배양토 */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[2.6, 0.05, 1.4]} />
          <meshStandardMaterial color="#1C1917" roughness={1.0} />
        </mesh>

        {/* 식물들 (작은 실린더 줄기 + 구형/원뿔형 잎) */}
        {[-0.9, -0.45, 0, 0.45, 0.9].map((x, idx) => (
          <group key={idx} position={[x, 0.4, (idx % 2 === 0 ? 0.25 : -0.25)]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.03, 0.04, 0.5]} />
              <meshStandardMaterial color="#15803D" />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <sphereGeometry args={[0.2, 12, 12]} />
              <meshStandardMaterial color="#22C55E" roughness={0.4} />
            </mesh>
          </group>
        ))}

        {/* 토양 수분 & 온실 센서 3D 배지 */}
        {!isModalOpen && (
          <Html position={[0, 1.4, 0]} center distanceFactor={8} zIndexRange={[10, 0]}>
            <div className="flex flex-col gap-1.5 p-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/60 text-white shadow-2xl backdrop-blur-md pointer-events-none select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-300">스마트팜 온실 센서</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">토양 수분: </span>
                  <span className="font-extrabold text-emerald-400">{soilMoisture}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">내부 온도: </span>
                  <span className="font-extrabold text-blue-400">{temp}℃</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">환기 돔: </span>
                  <span className="font-extrabold text-amber-400">{reportedAngle}°</span>
                </div>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* 6. 스마트팜 조명(식물 생장등) 및 Cds 조도센서 노드 */}
      <LightObject isModalOpen={isModalOpen} />
      <CdsSensorNode isModalOpen={isModalOpen} />
    </group>
  );
}
