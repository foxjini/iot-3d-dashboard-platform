'use client';

import React from 'react';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Html } from '@react-three/drei';

interface CdsSensorNodeProps {
  isModalOpen?: boolean;
}

export function CdsSensorNode({ isModalOpen = false }: CdsSensorNodeProps) {
  const light = useIoTStore((s) => s.sensors.cds_light);
  const selectedDeviceId = useIoTStore((s) => s.selectedDeviceId);
  const setSelectedDevice = useIoTStore((s) => s.setSelectedDevice);

  const isSelected = selectedDeviceId === 'cds_light';
  // 0 ~ 65535를 0 ~ 100% 밝기 비율로 환산
  const lightPercent = Math.round((light.value / 65535) * 100);

  return (
    <group
      position={[-0.8, 1.05, -2.1]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedDevice('cds_light');
      }}
    >
      {/* 1. Cds 센서 모듈 받침대 (황동 & 화이트 세라믹) */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 0.08, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* 2. Cds 수광부 센서 헤드 (황화카드뮴 패턴) */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.02, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#FBBF24"
          emissiveIntensity={0.3 + (lightPercent / 100) * 0.7}
          roughness={0.2}
        />
      </mesh>

      {/* 3. 넉넉하고 시원한 가로형 실시간 수치 배지 (세로 꺾임 원천 차단) */}
      {!isModalOpen && (
        <Html position={[0, 0.38, 0]} center distanceFactor={7} zIndexRange={[10, 0]}>
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-xl cursor-pointer whitespace-nowrap min-w-[130px] ${
              isSelected
                ? 'bg-amber-600/95 border-amber-300 text-white scale-105 ring-2 ring-amber-400/50'
                : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800/90'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDevice('cds_light');
            }}
          >
            {/* 황색 조도 인디케이터 도트 */}
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shrink-0 animate-pulse" />

            <div className="flex flex-col shrink-0">
              <span className="text-[10px] text-amber-200/90 font-medium leading-tight">
                Cds 조도 센서
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-extrabold text-amber-300 leading-none">
                  {lightPercent}%
                </span>
                <span className="text-[9px] text-slate-400">({light.value} ADC)</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
