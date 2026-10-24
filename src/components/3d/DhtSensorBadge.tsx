'use client';

import React from 'react';
import { useIoTStore } from '@/core/store/useIoTStore';
import { Html } from '@react-three/drei';

export function DhtSensorBadge() {
  const temp = useIoTStore((s) => s.sensors.dht11_temp);
  const humi = useIoTStore((s) => s.sensors.dht11_humi);
  const selectedDeviceId = useIoTStore((s) => s.selectedDeviceId);
  const setSelectedDevice = useIoTStore((s) => s.setSelectedDevice);

  const isSelected = selectedDeviceId === 'dht11_temp' || selectedDeviceId === 'dht11_humi';

  return (
    <group
      position={[1.8, 1.05, -1.2]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedDevice('dht11_temp');
      }}
    >
      {/* DHT11 센서 모듈 본체 (파란색 플라스틱 그릴) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.22, 0.3, 0.1]} />
        <meshStandardMaterial
          color={isSelected ? '#38BDF8' : '#0284C7'}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* PCB 베이스 */}
      <mesh position={[0, -0.05, -0.06]}>
        <boxGeometry args={[0.25, 0.42, 0.02]} />
        <meshStandardMaterial color="#064E3B" roughness={0.7} />
      </mesh>

      {/* 실시간 수치 플로팅 배지 */}
      <Html position={[0, 0.45, 0]} center distanceFactor={7}>
        <div
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border backdrop-blur-md transition-all shadow-lg cursor-pointer ${
            isSelected
              ? 'bg-blue-600/90 border-blue-400 text-white scale-105'
              : 'bg-slate-900/80 border-slate-700/80 text-slate-100 hover:bg-slate-800/90'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedDevice('dht11_temp');
          }}
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-300 font-medium leading-none">DHT11 센서</span>
            <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
              <span className="text-rose-400">{temp.value.toFixed(1)}℃</span>
              <span className="text-slate-500">|</span>
              <span className="text-sky-400">{humi.value.toFixed(1)}%</span>
            </div>
          </div>
          {temp.isStale && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="데이터 지연" />
          )}
        </div>
      </Html>
    </group>
  );
}
