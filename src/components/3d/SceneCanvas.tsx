'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { SmartHomeRoom } from './SmartHomeRoom';
import { CameraRig } from './CameraRig';
import { useIoTStore } from '@/core/store/useIoTStore';

export function SceneCanvas() {
  const lightVal = useIoTStore((s) => s.sensors.cds_light.value);
  const rgbState = useIoTStore((s) => s.actuators.rgb_light.reportedState);
  const rgbColor = useIoTStore((s) => s.actuators.rgb_light.reportedColor) || '#3B82F6';
  const setSelectedDevice = useIoTStore((s) => s.setSelectedDevice);

  const isLightOn = rgbState === 'ON';
  // Cds 센서값(0~65535) 정규화
  const normalizedLight = Math.min(1, Math.max(0, lightVal / 65535));

  // 조명이 꺼졌을 때는 방이 차분하게 어두워지고(0.18 ~ 0.32),
  // 조명이 켜졌을 때는 무드등 색상이 돋보이도록 적절한 보조광 세팅
  const ambientIntensity = isLightOn
    ? 0.25 + normalizedLight * 0.15
    : 0.15 + normalizedLight * 0.18;

  // 조명이 켜졌을 때 앰비언트 라이트가 무드등의 색조를 은은하게 머금어 방 전체 색감을 일치시킴
  const ambientColor = isLightOn ? rgbColor : '#94A3B8';

  return (
    <div
      className="w-full h-full relative"
      onClick={() => setSelectedDevice(null)}
    >
      <Canvas
        shadows
        camera={{ position: [6.5, 4.8, 7.5], fov: 42 }}
        className="w-full h-full"
      >
        {/* 1. 은은한 헤미스피어 라이트 (무드등 색상을 방해하지 않도록 대폭 절제) */}
        <hemisphereLight
          color={isLightOn ? rgbColor : '#CBD5E1'}
          groundColor="#1E293B"
          intensity={isLightOn ? 0.25 : 0.15}
        />

        {/* 2. Cds 조도 센서 & 무드등 연동 앰비언트 라이트 */}
        <ambientLight color={ambientColor} intensity={ambientIntensity} />

        {/* 3. 창문 밖 은은한 자연광 (무드등 색상을 죽이지 않도록 그림자 해제 & 강도 절제) */}
        <directionalLight
          position={[-3.5, 6.0, -5.0]}
          intensity={isLightOn ? 0.25 : 0.35 + normalizedLight * 0.25}
          color="#F1F5F9"
          castShadow={false} // 강한 백색 그림자 제거 -> 무드등이 그림자의 주인공이 됨
        />

        {/* 3D 스마트홈 룸 및 카메라 컨트롤러 */}
        <SmartHomeRoom />
        <CameraRig />
      </Canvas>
    </div>
  );
}
