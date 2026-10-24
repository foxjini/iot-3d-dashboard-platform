'use client';

import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useIoTStore } from '@/core/store/useIoTStore';

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isAutoRotate = useIoTStore((s) => s.isAutoRotate);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      autoRotate={isAutoRotate}
      autoRotateSpeed={0.8}
      minDistance={3.5}
      maxDistance={14}
      maxPolarAngle={Math.PI / 2 - 0.05} // 바닥 밑으로 카메라 못 내려가게 방지
      target={[0, 1.2, 0]}
    />
  );
}
