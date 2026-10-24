'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Html } from '@react-three/drei';

export function DoorObject() {
  const doorHingeRef = useRef<THREE.Group>(null);
  const reportedAngle = useIoTStore((s) => s.actuators.sg90_door.reportedAngle);
  const isPending = useIoTStore((s) => s.actuators.sg90_door.pending);
  const selectedDeviceId = useIoTStore((s) => s.selectedDeviceId);
  const setSelectedDevice = useIoTStore((s) => s.setSelectedDevice);

  const isSelected = selectedDeviceId === 'sg90_door';

  // 서보모터 각도 (0 ~ 180도) -> 라디안 변환 (최대 95도 활짝 열림)
  // 0도: 닫힘 (0 rad), 90도: 활짝 열림 (약 1.6 rad)
  const targetRad = (Math.min(180, Math.max(0, reportedAngle)) / 90) * (Math.PI * 0.52);

  useFrame((_, delta) => {
    if (doorHingeRef.current) {
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        -targetRad,
        7,
        delta
      );
    }
  });

  return (
    // 좌측 벽 개구부(x = -2.75, z = 1.2)에 정확히 위치
    <group position={[-2.75, 0, 1.2]}>
      {/* 1. 속이 뻥 뚫린 오픈 문틀 (Hollow Door Frame) */}
      <group position={[0, 0, 0]}>
        {/* 뒤쪽 기둥 (Hinge Side Post) */}
        <mesh position={[0, 1.25, -0.62]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.5, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* 앞쪽 기둥 (Latch Side Post) */}
        <mesh position={[0, 1.25, 0.62]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.5, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* 상단 인방 (Header) */}
        <mesh position={[0, 2.46, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.08, 1.32]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* 바닥 문턱 (Threshold) */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[0.14, 0.04, 1.32]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* 2. 회전 경첩 피벗 (Hinge Pivot - 뒤쪽 기둥 안쪽에 부착) */}
      <group
        ref={doorHingeRef}
        position={[0, 0, -0.58]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedDevice('sg90_door');
        }}
      >
        {/* 실제 회전하는 문짝 (Door Leaf) */}
        <mesh position={[0, 1.22, 0.58]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 2.4, 1.16]} />
          <meshStandardMaterial
            color={isSelected ? '#38BDF8' : '#D97706'}
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>

        {/* 문 인테리어 장식 몰딩 패널 (앞/뒤 음각 디테일) */}
        <mesh position={[0.028, 1.45, 0.58]}>
          <boxGeometry args={[0.01, 0.85, 0.9]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>
        <mesh position={[0.028, 0.65, 0.58]}>
          <boxGeometry args={[0.01, 0.55, 0.9]} />
          <meshStandardMaterial color="#B45309" roughness={0.4} />
        </mesh>

        {/* 고급 메탈 도어 핸들 (앞/뒤 손잡이) */}
        <group position={[0, 1.1, 1.02]}>
          {/* 실내 손잡이 레버 */}
          <mesh position={[0.05, 0, 0]}>
            <boxGeometry args={[0.03, 0.03, 0.14]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* 손잡이 축 */}
          <mesh position={[0.03, 0, -0.05]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
        </group>

        {/* 선택 시 상단 3D 배지 */}
        {isSelected && (
          <Html position={[0, 2.6, 0.6]} center distanceFactor={8}>
            <div className="px-2.5 py-1 rounded-lg bg-blue-600/95 text-white text-xs font-bold whitespace-nowrap shadow-xl backdrop-blur-md pointer-events-none animate-bounce border border-blue-300">
              SG90 도어 [{reportedAngle}°] {isPending ? '동작 중...' : reportedAngle === 0 ? '닫힘' : '열림'}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
